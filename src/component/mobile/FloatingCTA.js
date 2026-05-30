import { useEffect, useState, useRef } from 'react';
import './FloatingCTA.scss';
import gsap from 'gsap';

function FloatingCTA() {
    const [visible, setVisible] = useState(false);
    const btnRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Animate in/out
    useEffect(() => {
        if (!btnRef.current) return;
        if (visible) {
            gsap.to(btnRef.current, {
                scale: 1, opacity: 1, y: 0,
                duration: 0.5, ease: 'back.out(2)',
            });
        } else {
            gsap.to(btnRef.current, {
                scale: 0.6, opacity: 0, y: 20,
                duration: 0.3, ease: 'power2.in',
            });
        }
    }, [visible]);

    const onTap = (e) => {
        gsap.timeline()
            .to(btnRef.current, { scale: 0.88, duration: 0.1 })
            .to(btnRef.current, { scale: 1,    duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    };

    return (
        <a
            ref={btnRef}
            href="mailto:vikyhari321@gmail.com"
            className="fcta"
            style={{ opacity: 0, transform: 'scale(0.6) translateY(20px)' }}
            onTouchStart={onTap}
        >
            <i className="fa-solid fa-paper-plane" />
            <span>Hire Me</span>
            <div className="fcta__pulse" />
        </a>
    );
}

export default FloatingCTA;
