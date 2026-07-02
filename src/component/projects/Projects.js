import React, { useEffect, useRef, useState } from 'react';
import './styles/Projects.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ProjectDatas } from '../../commoncontent/ProjectData';
import { useOverrideText } from '../../theme/OverridesContext';
import Tilt from 'react-parallax-tilt';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const ACCENT_COLORS = {
    purple: { border: 'rgba(139,92,246,0.3)', glow: 'rgba(139,92,246,0.12)', text: 'var(--purple)' },
    cyan:   { border: 'rgba(34,211,238,0.3)',  glow: 'rgba(34,211,238,0.12)',  text: 'var(--cyan)'   },
    pink:   { border: 'rgba(244,114,182,0.3)', glow: 'rgba(244,114,182,0.12)', text: 'var(--pink)'   },
    green:  { border: 'rgba(52,211,153,0.3)',  glow: 'rgba(52,211,153,0.12)',  text: 'var(--green)'  },
};

function ProjectCard({ project, index, colors }) {
    return (
        <div className="project-card" style={{ borderColor: colors.border, '--card-glow': colors.glow, '--card-accent': colors.text }}>
            <div className="project-card__glow" />
            <div className="project-card__top">
                <div className="project-card__icon" style={{ color: colors.text }}>
                    <i className={project.icon} />
                </div>
                <div className="project-card__num">{String(index + 1).padStart(2, '0')}</div>
            </div>
            <div className="project-card__body">
                <h3 className="project-card__title">{project.name}</h3>
                <p className="project-card__desc">{project.des}</p>
            </div>
            <div className="project-card__tags">
                {project.tags?.map(tag => (
                    <span key={tag} className="project-tag" style={{ color: colors.text, borderColor: colors.border }}>{tag}</span>
                ))}
            </div>
            <div className="project-card__footer">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-cta" style={{ '--btn-color': colors.text }}>
                    <span>{project.button}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
            </div>
        </div>
    );
}

function Projects() {
    const sectionRef  = useRef(null);
    const trackRef    = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // Mobile-only for now: the desktop view's title is a bespoke per-letter
    // "PROJECTS" scroll animation (see labelChars below) that isn't a plain
    // text node, so it's intentionally left out of live-theming for now.
    const projectsTitleOverride = useOverrideText('projects.title', null);

    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, []);

    // ── Mobile: IntersectionObserver reveals ─────────────────────────────────
    useEffect(() => {
        if (!isMobile) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    entry.target.querySelectorAll('.rv').forEach((el, i) => {
                        setTimeout(() => el.classList.add('rv--in'), i * 100);
                    });
            });
        }, { threshold: 0.08 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [isMobile]);

    // ── Desktop: GSAP pinned horizontal scroll (Cartier-style) ───────────────
    useEffect(() => {
        if (isMobile) return;

        const ctx = gsap.context(() => {
            const track  = trackRef.current;
            const cards  = gsap.utils.toArray('.project-tilt');
            if (!track || !cards.length) return;

            // Header reveal
            gsap.from('.proj-cinematic-label', {
                opacity: 0, y: 30, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.projects-horizontal', start: 'top 80%', once: true },
            });
            gsap.from('.proj-cinematic-heading .ch', {
                y: '110%', opacity: 0, stagger: 0.04, duration: 0.9, ease: 'power4.out',
                scrollTrigger: { trigger: '.projects-horizontal', start: 'top 75%', once: true },
            });

            // Pin + horizontal scroll
            const totalSlide = track.scrollWidth - window.innerWidth;
            gsap.to(track, {
                x: -totalSlide,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.projects-horizontal',
                    start: 'top top',
                    end: () => `+=${totalSlide + window.innerWidth * 0.5}`,
                    pin: true,
                    scrub: 1.2,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // Cards fade in as they enter the viewport
            cards.forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0, scale: 0.88, rotateY: 8,
                    duration: 0.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: gsap.getById('proj-track'),
                        start: 'left 90%',
                        once: true,
                    },
                });
            });

            // Progress bar
            ScrollTrigger.create({
                trigger: '.projects-horizontal',
                start: 'top top',
                end: () => `+=${totalSlide + window.innerWidth * 0.5}`,
                scrub: true,
                onUpdate: (self) => {
                    const bar = document.querySelector('.proj-progress__fill');
                    if (bar) bar.style.width = `${self.progress * 100}%`;
                },
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    const labelChars = 'PROJECTS'.split('');

    return (
        <div className="projects-section" ref={sectionRef}>
            <div className="projects-orb projects-orb--1" />
            <div className="projects-orb projects-orb--2" />

            {/* ── Mobile layout ── */}
            {isMobile && (
                <div className="projects-inner">
                    <div className="section-header">
                        <div className="section-label rv">{useOverrideText('projects.label', 'Projects')}</div>
                        <h2 className="section-title rv">
                            {projectsTitleOverride || (<>Things I've <span>Built</span></>)}
                        </h2>
                        <p className="section-subtitle rv">Real products — shipped and running.</p>
                    </div>
                    <div className="projects-swiper-wrap rv">
                        <Swiper
                            slidesPerView={1.12} spaceBetween={16}
                            centeredSlides={true} grabCursor={true}
                            pagination={{ clickable: true, dynamicBullets: true, el: '.proj-pagination' }}
                            modules={[Pagination, A11y]} className="projects-swiper"
                        >
                            {ProjectDatas.map((project, index) => {
                                const colors = ACCENT_COLORS[project.accent] || ACCENT_COLORS.purple;
                                return (
                                    <SwiperSlide key={project.id}>
                                        <ProjectCard project={project} index={index} colors={colors} />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div className="proj-pagination" />
                        <div className="swipe-hint"><i className="fa-solid fa-hand-pointer" /><span>Swipe to explore</span></div>
                    </div>
                </div>
            )}

            {/* ── Desktop: pinned horizontal scroll ── */}
            {!isMobile && (
                <div className="projects-horizontal">
                    {/* Section heading — stays pinned at top-left */}
                    <div className="proj-cinematic-header">
                        <div className="proj-cinematic-label">Selected Work</div>
                        <h2 className="proj-cinematic-heading">
                            {labelChars.map((ch, i) => (
                                <span key={i} className="ch">{ch === ' ' ? ' ' : ch}</span>
                            ))}
                        </h2>
                        <p className="proj-cinematic-sub">
                            From AI pipelines to full-stack platforms — scroll to explore →
                        </p>

                        {/* Scroll progress line */}
                        <div className="proj-progress">
                            <div className="proj-progress__fill" />
                        </div>
                    </div>

                    {/* Horizontal scrolling track */}
                    <div className="projects-track" ref={trackRef}>
                        {ProjectDatas.map((project, index) => {
                            const colors = ACCENT_COLORS[project.accent] || ACCENT_COLORS.purple;
                            return (
                                <div key={project.id} className="proj-slide">
                                    <Tilt
                                        tiltMaxAngleX={8} tiltMaxAngleY={8}
                                        scale={1.02} transitionSpeed={600}
                                        glareEnable={true} glareMaxOpacity={0.08}
                                        glareColor="rgba(255,255,255,1)" glarePosition="all"
                                        className="project-tilt"
                                    >
                                        <ProjectCard project={project} index={index} colors={colors} />
                                    </Tilt>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;
