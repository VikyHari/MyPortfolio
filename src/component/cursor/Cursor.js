import { useEffect, useRef, useState } from 'react';
import './Cursor.scss';

function Cursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const rafRef = useRef(null);
    const [hoverType, setHoverType] = useState('default'); // default | link | button | text
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx, ry = my;

        const onMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
            }
        };

        const onEnter = (e) => {
            const el = e.target;
            if (el.matches('a, button, [data-cursor="link"]')) setHoverType('link');
            else if (el.matches('input, textarea, [data-cursor="text"]')) setHoverType('text');
            else if (el.matches('.project-card, .service-card, .info-card, [data-cursor="block"]')) setHoverType('block');
            else setHoverType('default');
        };

        const onDown = () => setClicked(true);
        const onUp = () => setClicked(false);

        const tick = () => {
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onEnter);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('mouseup', onUp);
        tick();

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onEnter);
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('mouseup', onUp);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className={`cursor-dot cursor-dot--${hoverType} ${clicked ? 'cursor-dot--clicked' : ''}`} />
            <div ref={ringRef} className={`cursor-ring cursor-ring--${hoverType} ${clicked ? 'cursor-ring--clicked' : ''}`}>
                {hoverType === 'link' && <span className="cursor-label">VIEW</span>}
                {hoverType === 'block' && <span className="cursor-label">OPEN</span>}
            </div>
        </>
    );
}

export default Cursor;
