import React, { useEffect, useRef } from 'react';
import './WorkingTools.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import vscode from '../../assests/images/vscode.png';
import postman from '../../assests/images/postman.png';
import github from '../../assests/images/github.png';
import android from '../../assests/images/android.png';
import gitlab from '../../assests/images/gitlab.png';
import SplitText from '../ui/SplitText';
import MagneticBtn from '../ui/MagneticBtn';
import { useOverrideText } from '../../theme/OverridesContext';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
    { id: 1, icon: 'fa-solid fa-code',        title: 'Full Stack Development',  desc: 'End-to-end web apps using React.js + Node.js + REST APIs. Scalable, performant, production-ready.', tags: ['React.js','Node.js','REST APIs','MongoDB'], accent: 'purple' },
    { id: 2, icon: 'fa-solid fa-brain',        title: 'AI Pipeline Integration', desc: 'RAG systems, LLM integrations, and Agentic AI workflows. Vector databases, prompt engineering, LLMOps.', tags: ['RAG','LLMOps','Ollama','ChromaDB','MCP'], accent: 'cyan' },
    { id: 3, icon: 'fa-solid fa-mobile-screen', title: 'Mobile App Development',  desc: 'Cross-platform mobile apps with React Native. Smooth UX and native performance for Android and iOS.', tags: ['React Native','Android','iOS'], accent: 'pink' },
    { id: 4, icon: 'fa-solid fa-palette',      title: 'UI/UX & Responsive Design', desc: 'Pixel-perfect interfaces. Modern design systems, SCSS architecture, mobile-first responsive layouts.', tags: ['UI/UX','SCSS','Bootstrap','Figma'], accent: 'green' },
];

const TOOLS = [
    { name: 'VS Code', image: vscode },
    { name: 'Postman', image: postman },
    { name: 'GitHub', image: github },
    { name: 'Android Studio', image: android },
    { name: 'GitLab', image: gitlab },
];

const AI_TOOLS = [
    { name: 'Ollama', icon: 'fa-solid fa-brain', color: 'var(--purple)' },
    { name: 'ChromaDB', icon: 'fa-solid fa-database', color: 'var(--cyan)' },
    { name: 'Gemma LLM', icon: 'fa-solid fa-microchip', color: 'var(--pink)' },
    { name: 'Embeddings', icon: 'fa-solid fa-layer-group', color: 'var(--green)' },
    { name: 'RAG Pipeline', icon: 'fa-solid fa-diagram-project', color: 'var(--purple)' },
    { name: 'LLMOps', icon: 'fa-solid fa-gears', color: 'var(--cyan)' },
];

const ACCENT_MAP  = { purple:'var(--purple)', cyan:'var(--cyan)', pink:'var(--pink)', green:'var(--green)' };
const BORDER_MAP  = { purple:'rgba(139,92,246,0.2)', cyan:'rgba(34,211,238,0.2)', pink:'rgba(244,114,182,0.2)', green:'rgba(52,211,153,0.2)' };

function WorkingTools() {
    const sectionRef = useRef(null);

    // IntersectionObserver for reliable reveals
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.rv').forEach((el, i) => {
                        setTimeout(() => el.classList.add('rv--in'), i * 80);
                    });
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="tools-section" ref={sectionRef}>
            <div className="tools-orb tools-orb--1" />
            <div className="tools-orb tools-orb--2" />

            <div className="tools-inner">
                {/* Header */}
                <div className="section-header">
                    <div className="section-label rv">{useOverrideText('tools.label', 'Services')}</div>
                    <SplitText tag="h2" className="section-title" stagger={0.06}>{useOverrideText('tools.title', 'What I Offer')}</SplitText>
                    <p className="section-subtitle rv">
                        From scalable web applications to AI-powered pipelines —
                        I help build products where technology solves real problems.
                    </p>
                </div>

                {/* Services */}
                <div className="services-grid">
                    {SERVICES.map((svc, i) => (
                        <div key={svc.id} className="service-card glass-card rv" style={{ '--s-color': ACCENT_MAP[svc.accent], borderColor: BORDER_MAP[svc.accent], transitionDelay: `${i * 0.1}s` }}>
                            <div className="service-card__icon"><i className={svc.icon} /></div>
                            <h3 className="service-card__title">{svc.title}</h3>
                            <p className="service-card__desc">{svc.desc}</p>
                            <div className="service-card__tags">
                                {svc.tags.map(t => <span key={t} className="service-tag">{t}</span>)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dev tools */}
                <div className="tools-sub-header">
                    <div className="section-label rv" style={{ marginBottom: '8px' }}>Tooling</div>
                    <SplitText tag="h3" className="tools-sub-title" stagger={0.05}>Daily Dev Tools</SplitText>
                </div>

                <div className="dev-tools-row">
                    {TOOLS.map((tool, i) => (
                        <MagneticBtn key={tool.name} strength={0.4}>
                            <div className="dev-tool glass-card rv" style={{ transitionDelay: `${i * 0.07}s` }}>
                                <img src={tool.image} alt={tool.name} className="dev-tool__img" />
                                <span className="dev-tool__name">{tool.name}</span>
                            </div>
                        </MagneticBtn>
                    ))}
                </div>

                {/* AI stack */}
                <div className="tools-sub-header" style={{ marginTop: '64px' }}>
                    <div className="section-label rv" style={{ marginBottom: '8px' }}>AI Stack</div>
                    <SplitText tag="h3" className="tools-sub-title" stagger={0.05}>AI Technologies</SplitText>
                </div>

                <div className="ai-tools-grid">
                    {AI_TOOLS.map((tool, i) => (
                        <MagneticBtn key={tool.name} strength={0.3}>
                            <div className="ai-tool glass-card rv" style={{ transitionDelay: `${i * 0.07}s` }}>
                                <i className={`${tool.icon} ai-tool__icon`} style={{ color: tool.color }} />
                                <span className="ai-tool__name">{tool.name}</span>
                            </div>
                        </MagneticBtn>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WorkingTools;
