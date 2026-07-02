import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import manifest from './manifest';

const { TOKENS, TEXT_SLOTS, SECTIONS, FEATURES, validateTokenValue, validateTextValue, isValidSectionOrder } = manifest;

// ────────────────────────────────────────────────────────────────────────────
// The ephemeral "overrides" store. Empty by default. Lives only in memory —
// never written to localStorage/sessionStorage/a backend/source files. A hard
// reload, navigation, or tab close throws all of this away for free, simply
// because it's ordinary React state with no persistence layer attached.
//
// This file is the ONLY place that mutates the overrides. applyAction() below
// re-validates every single field against src/theme/manifest.js itself — it
// never trusts its caller, so it's safe to feed it anything (including,
// worst case, a tampered network response) without risking bad state or
// arbitrary CSS/HTML/JS reaching the DOM.
// ────────────────────────────────────────────────────────────────────────────

function defaultFeatureState() {
    const out = {};
    Object.keys(FEATURES).forEach((id) => { out[id] = FEATURES[id].default; });
    return out;
}

function freshState() {
    return {
        tokens: {},
        text: {},
        hiddenSections: [],
        sectionOrder: [...SECTIONS],
        features: defaultFeatureState(),
        confettiTrigger: 0,
    };
}

function applyAction(state, action) {
    if (!action || typeof action.type !== 'string') return state;

    switch (action.type) {
        case 'setToken': {
            if (!TOKENS[action.target]) return state;
            const value = validateTokenValue(action.target, action.value);
            if (!value) return state;
            return { ...state, tokens: { ...state.tokens, [action.target]: value } };
        }
        case 'setText': {
            if (!TEXT_SLOTS[action.target]) return state;
            const value = validateTextValue(action.target, action.value);
            if (!value) return state;
            return { ...state, text: { ...state.text, [action.target]: value } };
        }
        case 'toggleSection': {
            if (!SECTIONS.includes(action.target)) return state;
            const show = !(action.value === false || action.value === 'false');
            const hidden = new Set(state.hiddenSections);
            if (show) hidden.delete(action.target); else hidden.add(action.target);
            return { ...state, hiddenSections: [...hidden] };
        }
        case 'reorderSections': {
            if (!isValidSectionOrder(action.targets)) return state;
            return { ...state, sectionOrder: [...action.targets] };
        }
        case 'toggleFeature': {
            if (!FEATURES[action.target]) return state;
            const on = !(action.value === false || action.value === 'false');
            if (action.target === 'confetti') {
                // Confetti is a momentary burst, not a persistent mode: only
                // "on" does anything, and every "on" fires a fresh burst.
                return on ? { ...state, confettiTrigger: state.confettiTrigger + 1 } : state;
            }
            return { ...state, features: { ...state.features, [action.target]: on } };
        }
        case 'reset':
            return freshState();
        default:
            return state; // unknown action type — ignored
    }
}

function reducer(state, dispatched) {
    if (dispatched.type === '__RESET__') return freshState();
    if (dispatched.type === '__APPLY_LIST__') {
        const list = Array.isArray(dispatched.list) ? dispatched.list : [];
        return list.reduce(applyAction, state);
    }
    return state;
}

const OverridesContext = createContext(null);

export function OverridesProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, freshState);

    // The only place that touches the DOM: mirror token overrides (+ the
    // internal playful-font token) onto :root as inline custom properties.
    // Inline style on the root element beats the :root rule in App.scss at
    // equal specificity, so this cleanly overrides — and removeProperty()
    // just as cleanly falls back to the stylesheet default.
    useEffect(() => {
        const root = document.documentElement;
        Object.keys(TOKENS).forEach((id) => {
            const value = state.tokens[id];
            if (value) root.style.setProperty(id, value);
            else root.style.removeProperty(id);
        });
        if (state.features.playfulFont) {
            root.style.setProperty('--font-heading', "'Fredoka', 'Poppins', 'Inter', sans-serif");
        } else {
            root.style.removeProperty('--font-heading');
        }
    }, [state.tokens, state.features.playfulFont]);

    const applyActions = useCallback((list) => dispatch({ type: '__APPLY_LIST__', list }), []);
    const reset = useCallback(() => dispatch({ type: '__RESET__' }), []);

    const value = useMemo(() => ({ ...state, applyActions, reset }), [state, applyActions, reset]);

    return <OverridesContext.Provider value={value}>{children}</OverridesContext.Provider>;
}

function useOverrides() {
    const ctx = useContext(OverridesContext);
    if (!ctx) throw new Error('useOverrides must be used within <OverridesProvider>');
    return ctx;
}

// Returns the visitor's override for a text slot, or `fallback` (the
// component's own real default) if nothing has been set.
export function useOverrideText(slotId, fallback) {
    const { text } = useOverrides();
    if (!TEXT_SLOTS[slotId]) return fallback;
    return text[slotId] ?? fallback;
}

// Ordered list of currently-visible section ids (excludes hidden ones).
export function useSectionState() {
    const { sectionOrder, hiddenSections } = useOverrides();
    return useMemo(
        () => sectionOrder.filter((id) => !hiddenSections.includes(id)),
        [sectionOrder, hiddenSections],
    );
}

export function useFeature(featureId) {
    const { features } = useOverrides();
    return !!features[featureId];
}

export function useConfettiTrigger() {
    return useOverrides().confettiTrigger;
}

export function useOverridesActions() {
    const { applyActions, reset } = useOverrides();
    return { applyActions, reset };
}

// True as soon as anything differs from the defaults — drives the visibility
// of the "Reset to original" control.
export function useHasOverrides() {
    const { tokens, text, hiddenSections, sectionOrder, features } = useOverrides();
    return (
        Object.keys(tokens).length > 0 ||
        Object.keys(text).length > 0 ||
        hiddenSections.length > 0 ||
        sectionOrder.some((id, i) => id !== SECTIONS[i]) ||
        Object.keys(features).some((id) => features[id] !== FEATURES[id].default)
    );
}
