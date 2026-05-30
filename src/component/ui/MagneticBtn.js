import { useRef } from 'react';
import gsap from 'gsap';

function MagneticBtn({ children, className, strength = 0.35, ...props }) {
    const ref = useRef(null);

    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    };

    return (
        <div
            ref={ref}
            className={`magnetic-wrap ${className || ''}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            {...props}
        >
            {children}
        </div>
    );
}

export default MagneticBtn;
