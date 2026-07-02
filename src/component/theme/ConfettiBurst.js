import { useEffect, useState } from 'react';
import { useConfettiTrigger } from '../../theme/OverridesContext';
import './ConfettiBurst.scss';

const COLOR_TOKENS = ['--purple', '--cyan', '--pink', '--green', '--gold'];
const PIECE_COUNT = 60;
const LIFETIME_MS = 3600;

// Pre-built, chatbot-toggleable feature. The AI can only flip this on — it
// never authors the effect itself. Pure CSS animation, no new dependency.
function ConfettiBurst() {
    const trigger = useConfettiTrigger();
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        if (trigger === 0) return; // never fired yet this session

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return; // respect it by skipping the effect entirely

        setPieces(
            Array.from({ length: PIECE_COUNT }, (_, i) => ({
                id: `${trigger}-${i}`,
                left: Math.random() * 100,
                delay: Math.random() * 0.4,
                duration: 2.2 + Math.random() * 1.2,
                colorVar: COLOR_TOKENS[i % COLOR_TOKENS.length],
            })),
        );

        const timeout = setTimeout(() => setPieces([]), LIFETIME_MS);
        return () => clearTimeout(timeout);
    }, [trigger]);

    if (pieces.length === 0) return null;

    return (
        <div className="confetti-burst" aria-hidden="true">
            {pieces.map((p) => (
                <span
                    key={p.id}
                    className="confetti-burst__piece"
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        background: `var(${p.colorVar})`,
                    }}
                />
            ))}
        </div>
    );
}

export default ConfettiBurst;
