// ────────────────────────────────────────────────────────────────────────────
// Live-theming manifest — the single source of truth for what a visitor is
// allowed to change via the chatbot.
//
// Written in plain CommonJS on purpose: this exact file is `require()`'d
// directly by the serverless function (api/_lib/*.js, Node, no build step)
// AND `import`'d by the React app (Babel's CommonJS interop handles the
// `module.exports = {...}` -> default import for us). Keep it free of JSX
// and ESM-only syntax so both sides can keep reading the same file.
//
// ── To add a new editable token / text slot / feature ──
// Add an entry to TOKENS / TEXT_SLOTS / FEATURES below. Nothing else needs
// to change — the AI-facing capability description (api/_lib/capability-
// prompt.js) and both the client and server validators all derive from this
// automatically. To add a new *section*, see the SECTIONS list further down
// — it also requires wiring the component into App.js's SECTION_COMPONENTS.
//
// This file only describes what's ALLOWED and how to validate values. It
// does not import React, styles, or any site content, so it stays cheap to
// require() from the serverless function.
// ────────────────────────────────────────────────────────────────────────────

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGB_COLOR = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;

function isValidColor(value) {
    if (typeof value !== 'string') return false;
    const v = value.trim();
    return HEX_COLOR.test(v) || RGB_COLOR.test(v);
}

function isValidSizePx(value, min, max) {
    if (typeof value !== 'string') return false;
    const m = value.trim().match(/^(\d{1,3}(?:\.\d+)?)px$/);
    if (!m) return false;
    const n = parseFloat(m[1]);
    return n >= min && n <= max;
}

// ── Editable CSS custom properties ──────────────────────────────────────────
// Deliberately a *subset* of the tokens defined in src/App.scss: structural/
// derived values (--glass*, --shadow, --blur, --transition) are excluded
// because they're hard to validate safely and easy to make illegible.
const TOKENS = {
    '--bg':        { kind: 'color', label: 'page background color' },
    '--bg2':       { kind: 'color', label: 'panel/card background color' },
    '--bg3':       { kind: 'color', label: 'alternate background color' },
    '--text':      { kind: 'color', label: 'main text color' },
    '--purple':    { kind: 'color', label: 'accent color — purple' },
    '--cyan':      { kind: 'color', label: 'accent color — cyan' },
    '--pink':      { kind: 'color', label: 'accent color — pink' },
    '--green':     { kind: 'color', label: 'accent color — green' },
    '--gold':      { kind: 'color', label: 'accent color — gold' },
    '--radius':    { kind: 'size', min: 0, max: 40, label: 'card corner roundness' },
    '--radius-sm': { kind: 'size', min: 0, max: 40, label: 'small-element corner roundness' },
};

function validateTokenValue(tokenId, value) {
    const def = TOKENS[tokenId];
    if (!def) return null;
    if (def.kind === 'color') return isValidColor(value) ? value.trim() : null;
    if (def.kind === 'size') return isValidSizePx(value, def.min, def.max) ? value.trim() : null;
    return null;
}

// ── Editable text slots ─────────────────────────────────────────────────────
// Each component keeps its own real default inline (via useOverrideText's
// `fallback` argument) — this manifest only declares which ids exist, a
// human label for the AI, and a length cap. No default text is duplicated
// here, so there's nothing to drift out of sync with the real content.
const TEXT_SLOTS = {
    'home.badge':     { maxLength: 60, label: 'hero badge text' },
    'home.greeting':  { maxLength: 40, label: 'hero greeting ("Hello, I\'m")' },
    'home.tagline':   { maxLength: 60, label: 'hero tagline under the name' },
    'home.bio':       { maxLength: 220, label: 'hero intro sentence' },
    'about.label':    { maxLength: 40, label: 'About section eyebrow label' },
    'about.title':    { maxLength: 80, label: 'About section heading' },
    'projects.label': { maxLength: 40, label: 'Projects section eyebrow label' },
    'projects.title': { maxLength: 80, label: 'Projects section heading' },
    'tools.label':    { maxLength: 40, label: 'Services section eyebrow label' },
    'tools.title':    { maxLength: 80, label: 'Services section heading' },
    'contact.label':  { maxLength: 40, label: 'Contact section eyebrow label' },
    'contact.title':  { maxLength: 80, label: 'Contact section heading' },
};

function validateTextValue(slotId, value) {
    const def = TEXT_SLOTS[slotId];
    if (!def || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > def.maxLength) return null;
    if (/[<>]/.test(trimmed)) return null; // plain text only, never markup
    return trimmed;
}

// ── Sections ─────────────────────────────────────────────────────────────────
// 'home' is intentionally NOT included: it's the fixed landing/scroll anchor
// the nav points at, so it's always visible and always first.
const SECTIONS = ['about', 'projects', 'tools', 'contact'];

function isValidSectionOrder(targets) {
    return (
        Array.isArray(targets) &&
        targets.length === SECTIONS.length &&
        SECTIONS.every((id) => targets.includes(id)) &&
        new Set(targets).size === SECTIONS.length
    );
}

// ── Pre-built toggleable features ───────────────────────────────────────────
// The AI can only flip these on/off — it never authors the behavior itself.
const FEATURES = {
    confetti:       { default: false, label: 'a brief confetti burst (momentary, not a persistent mode)' },
    animatedCursor: { default: true, label: 'the custom animated cursor that follows the pointer' },
    playfulFont:    { default: false, label: 'a playful heading font' },
};

module.exports = {
    TOKENS,
    TEXT_SLOTS,
    SECTIONS,
    FEATURES,
    isValidColor,
    isValidSizePx,
    isValidSectionOrder,
    validateTokenValue,
    validateTextValue,
};
