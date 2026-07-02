// ────────────────────────────────────────────────────────────────────────────
// POST /api/chat — server-side proxy for the portfolio chatbot.
//
// The React app never talks to Gemini directly (the API key must never reach
// the browser). It calls this endpoint with the running message history, and
// this function attaches the system prompt, calls Gemini, and returns just
// the reply text.
//
// Requires the GEMINI_API_KEY environment variable (see .env.example).
// ────────────────────────────────────────────────────────────────────────────

const { buildSystemPrompt } = require('./_lib/knowledge-base');

// Single, easy-to-change constant for the model used everywhere in this file.
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Quota guardrails, tuned for the Gemini free tier (~15 requests/min,
// ~1,500 requests/day for Flash). Keeping requests small also keeps
// responses fast for what is a small chat widget, not a full chat app.
const MAX_HISTORY_MESSAGES = 12; // only the most recent turns are sent
const MAX_MESSAGE_LENGTH = 600; // hard cap per message, in characters
const MAX_OUTPUT_TOKENS = 500; // keeps replies short but leaves room for a full sentence

const SYSTEM_PROMPT = buildSystemPrompt();

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[api/chat] GEMINI_API_KEY is not set.');
        return res.status(500).json({ error: "The assistant isn't configured yet. Please try again later." });
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
                    // a few words. This is a simple Q&A bot, so thinking adds latency and
                    // quota cost with no benefit: turn it off.
                    thinkingConfig: { thinkingBudget: 0 },
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
        const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim();

        if (!reply) {
            return res.status(502).json({ error: "Sorry, I couldn't come up with a reply to that. Try rephrasing your question?" });
        }

        return res.status(200).json({ reply });
    } catch (err) {
        console.error('[api/chat] Proxy request failed', err);
        return res.status(500).json({ error: 'Something went wrong on my end. Please try again shortly.' });
    }
};
