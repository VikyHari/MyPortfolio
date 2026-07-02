import { useState, useRef, useEffect } from 'react';
import { useOverridesActions, useHasOverrides } from '../../theme/OverridesContext';
import './Chatbot.scss';

const MAX_MESSAGE_LENGTH = 600;
const POST_ACTION_COOLDOWN_MS = 3000;

const GREETING = "Hi! I'm Vigneshwar's assistant. Ask about his skills, projects, or hiring — or tell me to tweak this page's look for your visit (colors, layout, a fun effect). It's just for you, and resets whenever you leave.";

let messageId = 0;
const nextId = () => `m${++messageId}`;

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ id: nextId(), role: 'bot', text: GREETING }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [cooldownActive, setCooldownActive] = useState(false);

    const { applyActions, reset } = useOverridesActions();
    const hasOverrides = useHasOverrides();

    const launcherRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Move focus into the panel when it opens, and back to the launcher on close.
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        } else {
            launcherRef.current?.focus({ preventScroll: true });
        }
    }, [isOpen]);

    // Let visitors close the panel with Escape.
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // Auto-scroll to the latest message.
    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
    }, [messages, isTyping, isOpen]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping || cooldownActive) return;

        const history = [...messages, { id: nextId(), role: 'user', text: trimmed }];
        setMessages(history);
        setInput('');
        setIsTyping(true);

        try {
            let res;
            try {
                res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: history.map((m) => ({ role: m.role, content: m.text })),
                    }),
                });
            } catch {
                throw new Error("Hmm, I couldn't reach the server. Check your connection and try again.");
            }

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.error || 'Sorry, something went wrong. Please try again.');
            }

            setMessages((prev) => [
                ...prev,
                { id: nextId(), role: 'bot', text: data.reply || "Sorry, I don't have a reply for that." },
            ]);

            // applyActions re-validates every entry against the manifest itself —
            // it's safe to hand it the response as-is, trusted or not.
            if (Array.isArray(data.actions) && data.actions.length > 0) {
                applyActions(data.actions);
                setCooldownActive(true);
                setTimeout(() => setCooldownActive(false), POST_ACTION_COOLDOWN_MS);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text: err.message, isError: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <>
            <button
                ref={launcherRef}
                type="button"
                className="chatbot__launcher"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
                aria-controls="chatbot-panel"
                aria-label={isOpen ? 'Close chat' : "Chat with Vigneshwar's assistant"}
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'}`} aria-hidden="true" />
            </button>

            {isOpen && (
                <div id="chatbot-panel" className="chatbot__panel" role="dialog" aria-label="Chat with Vigneshwar's assistant">
                    <div className="chatbot__header">
                        <div>
                            <strong>Ask about Vigneshwar</strong>
                            <div className="chatbot__subtitle">Skills · Projects · Hiring</div>
                        </div>
                        <div className="chatbot__headerActions">
                            {hasOverrides && (
                                <button
                                    type="button"
                                    className="chatbot__reset"
                                    onClick={reset}
                                    aria-label="Reset page to original design"
                                    title="Reset page to original design"
                                >
                                    <i className="fa-solid fa-arrow-rotate-left" aria-hidden="true" />
                                    Reset
                                </button>
                            )}
                            <button type="button" className="chatbot__close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="chatbot__messages" role="log" aria-live="polite" aria-relevant="additions">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`chatbot__msg chatbot__msg--${m.role}${m.isError ? ' chatbot__msg--error' : ''}`}
                            >
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chatbot__msg chatbot__msg--bot chatbot__typing" aria-label="Assistant is typing">
                                <span /><span /><span />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot__inputRow" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            className="chatbot__input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={cooldownActive ? 'One moment…' : 'Ask about skills, projects, hiring…'}
                            aria-label="Type your question"
                            maxLength={MAX_MESSAGE_LENGTH}
                            disabled={isTyping || cooldownActive}
                        />
                        <button
                            type="submit"
                            className="chatbot__send"
                            aria-label="Send message"
                            disabled={isTyping || cooldownActive || !input.trim()}
                        >
                            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;
