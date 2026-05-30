import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SplitText({ children, className = '', tag: Tag = 'div', delay = 0, stagger = 0.08 }) {
    const ref = useRef(null);

    const words = String(children).split(' ').map((w, i, arr) => (
        <React.Fragment key={i}>
            <span className="sw-wrap">
                <span className="sw">{w}</span>
            </span>
            {i < arr.length - 1 && <span className="sw-space"> </span>}
        </React.Fragment>
    ));

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const wordSpans = el.querySelectorAll('.sw');
        gsap.set(wordSpans, { y: '110%', opacity: 0 });

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(wordSpans, {
                    y: 0, opacity: 1,
                    stagger, duration: 0.9, delay,
                    ease: 'power4.out',
                });
            },
        });
        return () => trigger.kill();
    }, [delay, stagger]);

    return (
        <Tag ref={ref} className={`split-text ${className}`} aria-label={String(children)}>
            {words}
        </Tag>
    );
}

export default SplitText;
