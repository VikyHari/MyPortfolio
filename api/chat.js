// ────────────────────────────────────────────────────────────────────────────
// POST /api/chat — server-side proxy for the portfolio chatbot.
//
// The React app never talks to Gemini directly (the API key must never reach
// the browser). It calls this endpoint with the running message history, and
// this function attaches the system prompt (facts + the live-theming
// capability manifest), calls Gemini with a strict JSON response schema, and
// returns a short reply plus a validated list of page-reshaping actions.
//
// Requires the GEMINI_API_KEY environment variable (see .env.example).
// ────────────────────────────────────────────────────────────────────────────

const { buildSystemPrompt } = require('./_lib/knowledge-base');
const { buildCapabilityPrompt } = require('./_lib/capability-prompt');
const { RESPONSE_SCHEMA, sanitizeActions } = require('./_lib/action-schema');

// Single, easy-to-change constant for the model used everywhere in this file.
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Quota guardrails, tuned for the Gemini free tier (~15 requests/min,
// ~1,500 requests/day for Flash). Keeping requests small also keeps
// responses fast for what is a small chat widget, not a full chat app.
const MAX_HISTORY_MESSAGES = 12; // only the most recent turns are sent
const MAX_MESSAGE_LENGTH = 600; // hard cap per message, in characters
const MAX_OUTPUT_TOKENS = 700; // message + up to 8 structured actions, still small

const SYSTEM_PROMPT = `${buildSystemPrompt()}\n\n${buildCapabilityPrompt()}`;

// ── Abuse protection ─────────────────────────────────────────────────────────
// Best-effort only: a Vercel function instance is ephemeral and several can
// run concurrently, so this is NOT a mathematically exact global cap — it's a
// first line of defense against a single client (or a single warm instance)
// hammering the endpoint, layered on top of Gemini's own free-tier limit and
// the client-side cooldown in the chat widget. A real cross-instance
// guarantee would need external storage (e.g. Vercel KV); intentionally left
// out for now to keep this feature dependency-free.
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_MINUTE_PER_IP = 8;
const MAX_REQUESTS_PER_DAY_BEST_EFFORT = 1400; // stays under Gemini's ~1,500/day
const DAY_MS = 24 * 60 * 60 * 1000;

const ipHits = new Map(); // ip -> timestamps (ms) of recent requests
let dailyCount = 0;
let dailyResetAt = Date.now() + DAY_MS;

function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    if (now > dailyResetAt) {
        dailyCount = 0;
        dailyResetAt = now + DAY_MS;
    }
    if (dailyCount >= MAX_REQUESTS_PER_DAY_BEST_EFFORT) return false;

    const recent = (ipHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= MAX_REQUESTS_PER_MINUTE_PER_IP) {
        ipHits.set(ip, recent);
        return false;
    }

    recent.push(now);
    ipHits.set(ip, recent);
    dailyCount += 1;
    return true;
}

// Locks the endpoint to same-origin browser calls (plus localhost for local
// dev). Requests with no Origin header (same-origin navigations, curl, server
// to server, etc.) are let through — Origin is what matters for blocking
// cross-site abuse from another page's fetch(), and browsers always send it
// for those.
function isAllowedOrigin(req) {
    const origin = req.headers.origin;
    if (!origin) return true;
    try {
        const originHost = new URL(origin).host;
        if (originHost === req.headers.host) return true;
        return /^localhost(:\d+)?$/.test(originHost);
    } catch {
        return false;
    }
}

function sanitizeHistory(messages) {
    return messages
        .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH),
        }));
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ error: 'Requests from this origin are not allowed.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[api/chat] GEMINI_API_KEY is not set.');
        return res.status(500).json({ error: "The assistant isn't configured yet. Please try again later." });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        return res.status(429).json({
            error: 'Things are moving fast right now — please wait a moment before trying again.',
        });
    }

    const body = req.body || {};
    const history = sanitizeHistory(Array.isArray(body.messages) ? body.messages : []);

    if (history.length === 0) {
        return res.status(400).json({ error: 'No message content received.' });
    }

    const contents = history.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
    }));

    try {
        const geminiRes = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents,
                generationConfig: {
                    maxOutputTokens: MAX_OUTPUT_TOKENS,
                    temperature: 0.4,
                    // Gemini 2.5 Flash "thinks" before answering by default, and those
                    // hidden thinking tokens are counted against maxOutputTokens — which
                    // was silently eating the whole budget and cutting replies off after
                    // a few words. This bot needs quick, mechanical answers, not
                    // deliberation, so thinking is switched off.
                    thinkingConfig: { thinkingBudget: 0 },
                    // Force strict JSON matching RESPONSE_SCHEMA. This is a request to
                    // the model, not a security boundary — sanitizeActions() below
                    // re-validates the result regardless of what comes back.
                    responseMimeType: 'application/json',
                    responseSchema: RESPONSE_SCHEMA,
                },
            }),
        });

        if (geminiRes.status === 429) {
            return res.status(429).json({
                error: "I'm getting a lot of questions right now and hit the free-tier rate limit. Please try again in a minute.",
            });
        }

        if (!geminiRes.ok) {
            const errText = await geminiRes.text().catch(() => '');
            console.error('[api/chat] Gemini API error', geminiRes.status, errText);
            return res.status(502).json({ error: "Sorry, I couldn't get a response just now. Please try again shortly." });
        }

        const data = await geminiRes.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim();

        if (!rawText) {
            return res.status(502).json({ error: "Sorry, I couldn't come up with a reply to that. Try rephrasing your question?" });
        }

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            // Structured output mode is expected to guarantee valid JSON, but if
            // it ever doesn't, fail safe: show the raw text as a reply, no actions.
            return res.status(200).json({ reply: rawText.slice(0, MAX_MESSAGE_LENGTH), actions: [] });
        }

        let reply = typeof parsed.message === 'string' && parsed.message.trim()
            ? parsed.message.trim()
            : "Sorry, I don't have a reply for that.";
        const rawActions = Array.isArray(parsed.actions) ? parsed.actions : [];
        const actions = sanitizeActions(rawActions);

        // The model attempted at least one change but every single one failed
        // validation (bad id, out-of-range value, etc.) — say so rather than
        // silently doing nothing, per the "surface a friendly I can't do that"
        // requirement. Skip the note on partial success to avoid over-talking.
        if (rawActions.length > 0 && actions.length === 0) {
            reply += " (I wasn't actually able to apply that — try naming a specific color, section, or feature.)";
        }

        return res.status(200).json({ reply, actions });
    } catch (err) {
        console.error('[api/chat] Proxy request failed', err);
        return res.status(500).json({ error: 'Something went wrong on my end. Please try again shortly.' });
    }
};
