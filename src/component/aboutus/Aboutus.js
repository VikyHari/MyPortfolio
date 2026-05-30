import React, { useEffect, useRef } from 'react';
import './styles/Aboutus.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PersonalContent, Experience, Qualifications, SkillCategories } from '../../commoncontent/AboutusData';
import SplitText from '../ui/SplitText';
import MagneticBtn from '../ui/MagneticBtn';

gsap.registerPlugin(ScrollTrigger);

const pdf = '/resume.html';

function useReveal(ref) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.rv').forEach((el, i) => {
                        setTimeout(() => el.classList.add('rv--in'), i * 80);
                    });
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
}

function Aboutus() {
    const sectionRef = useRef(null);
    useReveal(sectionRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: '.skills-grid',
                start: 'top 78%',
                once: true,
                onEnter: () => {
                    document.querySelectorAll('.skill-bar__fill').forEach(bar => {
                        gsap.to(bar, {
                            width: bar.getAttribute('data-width'),
                            duration: 1.4, ease: 'power3.inOut',
                            delay: parseFloat(bar.getAttribute('data-delay') || 0),
                        });
                    });
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const colorMap = { purple: 'var(--purple)', cyan: 'var(--cyan)', pink: 'var(--pink)' };

    return (
        <div className="about-section" ref={sectionRef}>
            <div className="about-orb about-orb--1" />
            <div className="about-orb about-orb--2" />

            <div className="about-inner">

                {/* ── Header ── */}
                <div className="section-header">
                    <div className="section-label rv">About Me</div>
                    <SplitText tag="h2" className="section-title about-title" stagger={0.06}>
                        Full Stack Developer &amp; AI Engineer
                    </SplitText>
                    <p className="section-subtitle rv">{PersonalContent.desc}</p>
                </div>

                {/* ── Personal Info + Education Grid ── */}
                <div className="about-grid">
                    <div className="about-card glass-card rv">
                        <div className="about-card__header">
                            <i className="fa-solid fa-user about-card__icon" />
                            <span>Personal Info</span>
                        </div>
                        <div className="info-list">
                            {[
                                { icon: 'fa-solid fa-user',             label: 'Name',     value: PersonalContent.name },
                                { icon: 'fa-solid fa-map-location-dot', label: 'Location', value: PersonalContent.address },
                                { icon: 'fa-regular fa-envelope',       label: 'Email',    value: PersonalContent.emailid },
                                { icon: 'fa-solid fa-phone',            label: 'Phone',    value: PersonalContent.phoneno },
                                { icon: 'fa-solid fa-calendar',         label: 'DOB',      value: PersonalContent.dob },
                                { icon: 'fa-solid fa-graduation-cap',   label: 'Degree',   value: PersonalContent.deggre },
                            ].map((item, i) => (
                                <div key={i} className="info-row">
                                    <i className={`${item.icon} info-row__icon`} />
                                    <div>
                                        <div className="info-row__label">{item.label}</div>
                                        <div className="info-row__value">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <MagneticBtn>
                            <a href={pdf} target="_blank" rel="noopener noreferrer" className="download-btn">
                                <i className="fa-solid fa-file-lines" /> View &amp; Download Resume
                            </a>
                        </MagneticBtn>
                    </div>

                    <div className="about-card glass-card rv" style={{ transitionDelay: '0.12s' }}>
                        <div className="about-card__header">
                            <i className="fa-solid fa-road about-card__icon" />
                            <span>Education</span>
                        </div>
                        <div className="timeline">
                            {Qualifications.map((q, i) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-dot" />
                                    <div className="timeline-content">
                                        <div className="timeline-year">{q.year}</div>
                                        <div className="timeline-title">{q.name}</div>
                                        <div className="timeline-sub">{q.dgname}</div>
                                        <div className="timeline-place">
                                            <i className="fa-solid fa-building-columns" />
                                            {q.clgName} — {q.place}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Experience ── */}
                <div className="exp-section">
                    <div className="section-label rv">Experience</div>
                    <SplitText tag="h3" className="exp-title" stagger={0.05}>
                        Where I've Worked
                    </SplitText>

                    <div className="exp-list">
                        {Experience.map((exp, i) => (
                            <div key={exp.id} className="exp-card glass-card rv" style={{ transitionDelay: `${i * 0.12}s` }}>
                                {exp.current && <div className="exp-card__badge">Current</div>}

                                <div className="exp-card__top">
                                    <div className="exp-card__left">
                                        <div className="exp-card__logo">
                                            {exp.company === 'AvironiX Drones'
                                                ? <i className="fa-solid fa-drone-front" />
                                                : <i className="fa-solid fa-graduation-cap" />}
                                        </div>
                                        <div>
                                            <div className="exp-card__role">{exp.role}</div>
                                            <div className="exp-card__company">
                                                {exp.company}
                                                <span className="exp-card__type">{exp.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="exp-card__right">
                                        <div className="exp-card__period">{exp.period}</div>
                                        <div className="exp-card__duration">{exp.duration}</div>
                                        <div className="exp-card__location">
                                            <i className="fa-solid fa-location-dot" />{exp.location}
                                        </div>
                                    </div>
                                </div>

                                <ul className="exp-card__bullets">
                                    {exp.bullets.map((b, bi) => (
                                        <li key={bi}>{b}</li>
                                    ))}
                                </ul>

                                <div className="exp-card__skills">
                                    {exp.skills.map(s => (
                                        <span key={s} className={`exp-skill ${exp.current ? 'exp-skill--purple' : 'exp-skill--cyan'}`}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Skills ── */}
                <div className="skills-section">
                    <div className="section-label rv">Skills</div>
                    <SplitText tag="h3" className="skills-title" stagger={0.05} delay={0.1}>
                        What I Work With
                    </SplitText>

                    <div className="skills-grid">
                        {SkillCategories.map((cat, ci) => (
                            <div key={cat.id} className="skill-category glass-card rv" style={{ transitionDelay: `${ci * 0.1}s` }}>
                                <div className="skill-category__header">
                                    <i className={cat.icon} style={{ color: colorMap[cat.color] }} />
                                    <span>{cat.category}</span>
                                </div>
                                <div className="skill-list">
                                    {cat.skills.map((skill, i) => (
                                        <div key={i} className="skill-item">
                                            <div className="skill-item__top">
                                                <span className="skill-item__name">{skill.name}</span>
                                                <span className="skill-item__pct" style={{ color: colorMap[cat.color] }}>{skill.level}%</span>
                                            </div>
                                            <div className="skill-bar">
                                                <div
                                                    className="skill-bar__fill"
                                                    data-width={`${skill.level}%`}
                                                    data-delay={`${i * 0.06}`}
                                                    style={{
                                                        width: 0,
                                                        background: `linear-gradient(90deg, ${colorMap[cat.color]}, ${
                                                            cat.color === 'purple' ? 'var(--cyan)' :
                                                            cat.color === 'cyan'   ? 'var(--green)' : 'var(--purple)'
                                                        })`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── AI Banner ── */}
                <div className="ai-banner glass-card rv">
                    <div className="ai-banner__icon"><i className="fa-solid fa-microchip" /></div>
                    <div className="ai-banner__content">
                        <div className="ai-banner__title">AI Integration Focus</div>
                        <p className="ai-banner__text">
                            Built a fully <strong>local RAG system</strong> using Ollama (Gemma) + ChromaDB —
                            processes PDFs, performs semantic vector search, and generates context-aware LLM responses
                            with zero external API dependency.
                        </p>
                    </div>
                    <div className="ai-banner__tags">
                        {['Ollama', 'ChromaDB', 'RAG', 'LLMOps', 'Vector DB', 'Gemma'].map(t => (
                            <span key={t} className="ai-tag">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Aboutus;
