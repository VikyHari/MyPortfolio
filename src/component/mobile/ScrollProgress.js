import { useEffect, useState } from 'react';
import './ScrollProgress.scss';

function ScrollProgress() {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const total   = document.documentElement.scrollHeight - window.innerHeight;
            setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="scroll-prog">
            <div className="scroll-prog__bar" style={{ width: `${pct}%` }} />
        </div>
    );
}

export default ScrollProgress;
