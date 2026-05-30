import React, { useEffect, useRef, useState } from 'react';
import './styles/Projects.scss';
import { ProjectDatas } from '../../commoncontent/ProjectData';
import Tilt from 'react-parallax-tilt';
import SplitText from '../ui/SplitText';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ACCENT_COLORS = {
    purple: { border: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.15)', text: 'var(--purple)' },
    cyan:   { border: 'rgba(34,211,238,0.25)',  glow: 'rgba(34,211,238,0.15)',  text: 'var(--cyan)'   },
    pink:   { border: 'rgba(244,114,182,0.25)', glow: 'rgba(244,114,182,0.15)', text: 'var(--pink)'   },
    green:  { border: 'rgba(52,211,153,0.25)',  glow: 'rgba(52,211,153,0.15)',  text: 'var(--green)'  },
};

function ProjectCard({ project, index, colors }) {
    return (
        <div
            className="project-card"
            style={{ borderColor: colors.border, '--card-glow': colors.glow, '--card-accent': colors.text }}
        >
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
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                   className="project-cta" style={{ '--btn-color': colors.text }}>
                    <span>{project.button}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
            </div>
        </div>
    );
}

function Projects() {
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.rv').forEach((el, i) => {
                        setTimeout(() => el.classList.add('rv--in'), i * 100);
                    });
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="projects-section" ref={sectionRef}>
            <div className="projects-orb projects-orb--1" />
            <div className="projects-orb projects-orb--2" />

            <div className="projects-inner">
                <div className="section-header">
                    <div className="section-label rv">Projects</div>
                    <SplitText tag="h2" className="section-title" stagger={0.06}>Things I've Built</SplitText>
                    <p className="section-subtitle rv">
                        From AI-powered RAG pipelines to full-stack web apps —
                        real products shipped and running.
                    </p>
                </div>

                {/* ── Mobile: stacked card swiper ── */}
                {isMobile ? (
                    <div className="projects-swiper-wrap rv">
                        <Swiper
                            slidesPerView={1.12}
                            spaceBetween={16}
                            centeredSlides={true}
                            grabCursor={true}
                            pagination={{ clickable: true, dynamicBullets: true, el: '.proj-pagination' }}
                            modules={[Pagination, A11y]}
                            className="projects-swiper"
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
                        {/* External pagination — easy to center */}
                        <div className="proj-pagination" />
                        <div className="swipe-hint">
                            <i className="fa-solid fa-hand-pointer" />
                            <span>Swipe to explore</span>
                        </div>
                    </div>
                ) : (
                    /* ── Desktop: tilt grid ── */
                    <div className="projects-grid">
                        {ProjectDatas.map((project, index) => {
                            const colors = ACCENT_COLORS[project.accent] || ACCENT_COLORS.purple;
                            return (
                                <div key={project.id} className="rv" style={{ transitionDelay: `${index * 0.08}s` }}>
                                    <Tilt
                                        tiltMaxAngleX={12} tiltMaxAngleY={12}
                                        scale={1.03} transitionSpeed={500}
                                        glareEnable={true} glareMaxOpacity={0.1}
                                        glareColor="rgba(255,255,255,1)" glarePosition="all"
                                        className="project-tilt"
                                    >
                                        <ProjectCard project={project} index={index} colors={colors} />
                                    </Tilt>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;
