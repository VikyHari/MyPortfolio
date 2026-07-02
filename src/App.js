import { useEffect, useState, useRef } from 'react';
import './App.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Cursor      from './component/cursor/Cursor';
import MobileNav   from './component/mobile/MobileNav';
import TouchRipple from './component/mobile/TouchRipple';
import ScrollProgress from './component/mobile/ScrollProgress';
import FloatingCTA from './component/mobile/FloatingCTA';
import Home         from './component/home/Home';
import Aboutus      from './component/aboutus/Aboutus';
import Projects     from './component/projects/Projects';
import WorkingTools from './component/workingtools/WorkingTools';
import Contact      from './component/contact/Contact';
import Footer       from './component/footer/Footer';
import Marquee      from './component/ui/Marquee';
import TechStack    from './component/ui/TechStack';
import Chatbot      from './component/chatbot/Chatbot';
import ConfettiBurst from './component/theme/ConfettiBurst';
import { OverridesProvider, useSectionState, useFeature } from './theme/OverridesContext';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
    { id: 'home',     label: 'Home'     },
    { id: 'about',    label: 'About'    },
    { id: 'projects', label: 'Projects' },
    { id: 'tools',    label: 'Services' },
    { id: 'contact',  label: 'Contact'  },
];

// Live-theming can show/hide/reorder these four — 'home' stays fixed (see
// src/theme/manifest.js). Defined once; useSectionState() below decides
// which ids render and in what order.
const SECTION_COMPONENTS = {
    about:    <Aboutus />,
    projects: <Projects />,
    tools:    <WorkingTools />,
    contact:  <Contact />,
};

function PortfolioApp() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled,  setScrolled]  = useState(false);
    const [menuOpen,  setMenuOpen]  = useState(false);
    const [loader,    setLoader]    = useState(true);
    const [progress,  setProgress]  = useState(0);
    const lenisRef = useRef(null);
    const visibleSections = useSectionState();
    const animatedCursorOn = useFeature('animatedCursor');

    // ── Loader ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoader(false), 400);
                    return 100;
                }
                return p + 3;
            });
        }, 45);
        return () => clearInterval(timer);
    }, []);

    // ── Lenis smooth scroll ─────────────────────────────────────────────────
    useEffect(() => {
        if (loader) return;
        const mobile = window.innerWidth <= 768;
        const lenis = new Lenis({
            duration: mobile ? 1.0 : 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: mobile ? 1.5 : 1,
        });
        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tickerFn = (time) => { lenis.raf(time * 1000); };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => {
            gsap.ticker.remove(tickerFn);
            lenis.destroy();
        };
    }, [loader]);

    // ── Active section detection ─────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            NAV_ITEMS.forEach(s => {
                const el = document.getElementById(s.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120 && rect.bottom >= 120) setActiveSection(s.id);
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        if (lenisRef.current) {
            const el = document.getElementById(id);
            if (el) lenisRef.current.scrollTo(el, { offset: -80, duration: 1.4 });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuOpen(false);
    };

    // ── Navbar entrance ──────────────────────────────────────────────────────
    useEffect(() => {
        if (loader) return;
        gsap.from('.topnav', { y: -80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.3 });
    }, [loader]);

    if (loader) {
        return (
            <div className="loader-screen">
                <div className="loader-content">
                    <div className="loader-logo">
                        <span className="loader-v">V</span>
                        <span className="loader-name">igneshwar</span>
                    </div>
                    <div className="loader-tagline">Full Stack · AI Engineer</div>
                    <div className="loader-bar-track">
                        <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="loader-percent">{progress}%</div>
                </div>
                <div className="loader-orb loader-orb--1" />
                <div className="loader-orb loader-orb--2" />
                <div className="loader-orb loader-orb--3" />
            </div>
        );
    }

    return (
        <div className="portfolio-app">
            {/* ── Global interaction layer ── */}
            {animatedCursorOn && <Cursor />}
            <TouchRipple />
            <ScrollProgress />
            <FloatingCTA />
            <ConfettiBurst />
            <Chatbot />

            {/* ── Top nav (desktop + mobile hamburger) ── */}
            <nav className={`topnav${scrolled ? ' topnav--scrolled' : ''}`}>
                <div className="topnav__brand" onClick={() => scrollTo('home')}>
                    <span className="brand-v">V</span>igneshwar<span className="brand-dot">.</span>
                </div>

                <div className={`topnav__links${menuOpen ? ' topnav__links--open' : ''}`}>
                    {NAV_ITEMS.map(n => (
                        <button
                            key={n.id}
                            className={`nav-pill${activeSection === n.id ? ' nav-pill--active' : ''}`}
                            onClick={() => scrollTo(n.id)}
                        >
                            {n.label}
                            {activeSection === n.id && <span className="nav-pill__dot" />}
                        </button>
                    ))}
                </div>

                <a href="mailto:vikyhari321@gmail.com" className="hire-cta">
                    <span>Hire Me</span>
                    <i className="fa-solid fa-arrow-right" />
                </a>

                <button
                    className={`menu-toggle${menuOpen ? ' menu-toggle--open' : ''}`}
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </nav>

            {/* ── Page sections ── */}
            <section id="home"><Home scrollTo={scrollTo} /></section>
            <Marquee />
            <TechStack />
            <Marquee reverse />
            {/* about/projects/tools/contact: order + visibility come from the
                visitor's (ephemeral) overrides. With none applied this list is
                exactly ['about','projects','tools','contact'], all visible —
                identical to the original hardcoded markup. */}
            {visibleSections.map((id) => (
                <section id={id} key={id}>{SECTION_COMPONENTS[id]}</section>
            ))}
            <Footer scrollTo={scrollTo} />

            {/* ── Mobile bottom nav (only on mobile) ── */}
            <MobileNav scrollTo={scrollTo} activeSection={activeSection} />
        </div>
    );
}

// Wraps the real app in the ephemeral overrides store. Kept as a thin outer
// component (rather than folded into PortfolioApp) because a component can't
// consume a context it renders itself in the same pass.
function App() {
    return (
        <OverridesProvider>
            <PortfolioApp />
        </OverridesProvider>
    );
}

export default App;
