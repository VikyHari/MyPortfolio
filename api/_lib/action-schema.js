// ────────────────────────────────────────────────────────────────────────────
// The structured "reshape the page" action list — schema for what we ask
// Gemini to return, plus the server-side re-validation that decides what
// actually gets sent to the browser.
//
// IMPORTANT: RESPONSE_SCHEMA constrains what Gemini *tries* to produce, but
// it is not treated as a security boundary — sanitizeActions() re-derives
// safety from src/theme/manifest.js independently of whatever the model
// returned. Nothing from the model reaches the client unless it passes this
// re-validation, and the client-side reducer (src/theme/OverridesContext.js)
// re-validates again before touching any state. Neither side trusts the
// other.
// ────────────────────────────────────────────────────────────────────────────

const manifest = require('../../src/theme/manifest');
const { TOKENS, TEXT_SLOTS, SECTIONS, FEATURES, validateTokenValue, validateTextValue, isValidSectionOrder } = manifest;

const MAX_ACTIONS_PER_TURN = 8;

// Kept deliberately flat — one object shape with every field optional except
// `type` — rather than a discriminated union. Gemini's structured-output
// schema support doesn't reliably express JSON-Schema-style unions, and since
// this schema isn't our safety boundary anyway (see above), simple is better
// than clever here.
const ACTION_ITEM_SCHEMA = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['setToken', 'setText', 'toggleSection', 'reorderSections', 'toggleFeature', 'reset'],
        },
        target: { type: 'string', nullable: true },
        targets: { type: 'array', items: { type: 'string' }, nullable: true },
        value: { type: 'string', nullable: true },
    },
    required: ['type'],
};

const RESPONSE_SCHEMA = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        actions: { type: 'array', items: ACTION_ITEM_SCHEMA },
    },
    required: ['message', 'actions'],
};

function isOn(value) {
    return !(value === false || value === 'false');
}

// Re-validates a raw (untrusted) action list against the manifest. Anything
// unknown, malformed, or out-of-range is dropped silently — never throws.
function sanitizeActions(rawActions) {
    if (!Array.isArray(rawActions)) return [];

    const clean = [];
    for (const raw of rawActions.slice(0, MAX_ACTIONS_PER_TURN)) {
        if (!raw || typeof raw !== 'object' || typeof raw.type !== 'string') continue;

        switch (raw.type) {
            case 'setToken': {
                if (!TOKENS[raw.target]) break;
                const value = validateTokenValue(raw.target, raw.value);
                if (!value) break;
                clean.push({ type: 'setToken', target: raw.target, value });
                break;
            }
            case 'setText': {
                if (!TEXT_SLOTS[raw.target]) break;
                const value = validateTextValue(raw.target, raw.value);
                if (!value) break;
                clean.push({ type: 'setText', target: raw.target, value });
                break;
            }
            case 'toggleSection': {
                if (!SECTIONS.includes(raw.target)) break;
                clean.push({ type: 'toggleSection', target: raw.target, value: isOn(raw.value) });
                break;
            }
            case 'reorderSections': {
                if (!isValidSectionOrder(raw.targets)) break;
                clean.push({ type: 'reorderSections', targets: [...raw.targets] });
                break;
            }
            case 'toggleFeature': {
                if (!FEATURES[raw.target]) break;
                clean.push({ type: 'toggleFeature', target: raw.target, value: isOn(raw.value) });
                break;
            }
            case 'reset':
                clean.push({ type: 'reset' });
                break;
            default:
                break; // unknown type — dropped
        }
    }
    return clean;
}

module.exports = { RESPONSE_SCHEMA, sanitizeActions, MAX_ACTIONS_PER_TURN };
