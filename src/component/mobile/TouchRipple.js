import { useEffect } from 'react';
import './TouchRipple.scss';

// Global touch ripple — mounts once, listens on document
function TouchRipple() {
    useEffect(() => {
        const onTouch = (e) => {
            const touch = e.touches[0];
            const el = document.createElement('div');
            el.className = 'g-ripple';
            el.style.left = touch.clientX + 'px';
            el.style.top  = touch.clientY + 'px';
            document.body.appendChild(el);
            el.addEventListener('animationend', () => el.remove(), { once: true });
        };

        document.addEventListener('touchstart', onTouch, { passive: true });
        return () => document.removeEventListener('touchstart', onTouch);
    }, []);

    return null;
}

export default TouchRipple;
