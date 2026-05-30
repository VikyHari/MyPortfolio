import { useEffect, useRef } from 'react';
import './MobileNav.scss';
import gsap from 'gsap';

const NAV_ITEMS = [
    { id: 'home',     label: 'Home',     icon: 'fa-solid fa-house' },
    { id: 'about',    label: 'About',    icon: 'fa-solid fa-user' },
    { id: 'projects', label: 'Work',     icon: 'fa-solid fa-folder-open' },
    { id: 'tools',    label: 'Services', icon: 'fa-solid fa-wrench' },
    { id: 'contact',  label: 'Contact',  icon: 'fa-regular fa-envelope' },
];

function MobileNav({ scrollTo, activeSection }) {
    const navRef  = useRef(null);
    const inkRef  = useRef(null);

    // Animate ink indicator to active item
    useEffect(() => {
        const nav    = navRef.current;
        if (!nav) return;
        const active = nav.querySelector('.mnav__item--active');
        if (!active || !inkRef.current) return;
        const navRect    = nav.getBoundingClientRect();
        const itemRect   = active.getBoundingClientRect();
        const center     = itemRect.left - navRect.left + itemRect.width / 2;
        gsap.to(inkRef.current, {
            x: center - 20, duration: 0.4, ease: 'power3.out',
        });
    }, [activeSection]);

    // Entrance animation
    useEffect(() => {
        gsap.from(navRef.current, {
            y: 100, opacity: 0, duration: 0.8, ease: 'power4.out', delay: 1,
        });
    }, []);

    const handleTap = (id, e) => {
        // Tap scale burst on icon
        const icon = e.currentTarget.querySelector('i');
        gsap.timeline()
            .to(icon, { scale: 1.4, duration: 0.12, ease: 'power2.out' })
            .to(icon, { scale: 1,   duration: 0.25, ease: 'elastic.out(1, 0.4)' });
        scrollTo(id);
    };

    return (
        <nav ref={navRef} className="mnav">
            {/* Sliding ink indicator */}
            <div ref={inkRef} className="mnav__ink" />

            {NAV_ITEMS.map(item => (
                <button
                    key={item.id}
                    className={`mnav__item ${activeSection === item.id ? 'mnav__item--active' : ''}`}
                    onClick={(e) => handleTap(item.id, e)}
                >
                    <span className="mnav__icon-wrap">
                        <i className={item.icon} />
                        {activeSection === item.id && <span className="mnav__dot" />}
                    </span>
                    <span className="mnav__label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default MobileNav;
