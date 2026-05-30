import React, { useState, useEffect, useRef } from 'react';
import './styles/Contact.scss';
import SplitText from '../ui/SplitText';
import MagneticBtn from '../ui/MagneticBtn';

const CONTACT_INFO = [
    { icon: 'fa-solid fa-map-location-dot', label: 'Location', value: 'Chennai, India',        color: 'var(--purple)' },
    { icon: 'fa-regular fa-envelope',       label: 'Email',    value: 'vikyhari321@gmail.com', color: 'var(--cyan)'   },
    { icon: 'fa-solid fa-phone',             label: 'Phone',    value: '+91 9344556276',        color: 'var(--pink)'   },
    { icon: 'fa-brands fa-linkedin-in',      label: 'LinkedIn', value: 'vigneshwar-h1222',      color: 'var(--green)'  },
];

function Contact() {
    const sectionRef = useRef(null);
    const [form, setForm]   = useState({ user_name: '', user_email: '', user_message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.rv').forEach((el, i) => {
                        setTimeout(() => el.classList.add('rv--in'), i * 90);
                    });
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const validate = () => {
        const e = {};
        if (!form.user_name.trim())  e.user_name    = 'Name is required';
        if (!form.user_email.trim()) e.user_email   = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.user_email)) e.user_email = 'Enter a valid email';
        if (!form.user_message.trim()) e.user_message = 'Message is required';
        return e;
    };

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(er => ({ ...er, [e.target.name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setForm({ user_name: '', user_email: '', user_message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1200);
    };

    return (
        <div className="contact-section" ref={sectionRef}>
            <div className="contact-orb contact-orb--1" />
            <div className="contact-orb contact-orb--2" />

            <div className="contact-inner">
                <div className="section-header">
                    <div className="section-label rv">Contact</div>
                    <SplitText tag="h2" className="section-title" stagger={0.06}>Let's Work Together</SplitText>
                    <p className="section-subtitle rv">Open to Full Stack and AI-enabled engineering roles. Let's build something great.</p>
                </div>

                <div className="contact-layout">
                    {/* Left */}
                    <div className="contact-info rv">
                        <div className="contact-info__heading">Get in Touch</div>
                        <p className="contact-info__sub">
                            Whether you have a project idea, a job opportunity, or just want to say hi —
                            I'd love to hear from you.
                        </p>

                        <div className="contact-info__cards">
                            {CONTACT_INFO.map((item, i) => (
                                <div key={item.label} className="info-card glass-card rv" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <div className="info-card__icon" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                                        <i className={item.icon} style={{ color: item.color }} />
                                    </div>
                                    <div>
                                        <div className="info-card__label">{item.label}</div>
                                        <div className="info-card__value">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="contact-socials">
                            {[
                                { href: 'https://www.linkedin.com/in/vigneshwar-h1222', icon: 'fa-brands fa-linkedin-in' },
                                { href: 'https://github.com/VikyHari',                   icon: 'fa-brands fa-github' },
                                { href: 'mailto:vikyhari321@gmail.com',                   icon: 'fa-regular fa-envelope' },
                            ].map(s => (
                                <MagneticBtn key={s.icon} strength={0.5}>
                                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="c-social">
                                        <i className={s.icon} />
                                    </a>
                                </MagneticBtn>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="contact-form-wrap glass-card rv" style={{ transitionDelay: '0.2s' }}>
                        <div className="contact-form__heading">Send a Message</div>

                        {status === 'success' ? (
                            <div className="form-success">
                                <div className="form-success__icon"><i className="fa-solid fa-circle-check" /></div>
                                <div className="form-success__title">Message sent!</div>
                                <div className="form-success__sub">Thanks for reaching out. I'll get back to you soon.</div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                                {[
                                    { name: 'user_name',    label: 'Full Name',     type: 'text',  placeholder: 'Your name' },
                                    { name: 'user_email',   label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                                ].map(f => (
                                    <div key={f.name} className="form-group">
                                        <label className="form-label">{f.label}</label>
                                        <input type={f.type} name={f.name} placeholder={f.placeholder}
                                            className={`form-input${errors[f.name] ? ' form-input--error' : ''}`}
                                            value={form[f.name]} onChange={handleChange} />
                                        {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea name="user_message" placeholder="Tell me about your project..." rows={5}
                                        className={`form-input form-textarea${errors.user_message ? ' form-input--error' : ''}`}
                                        value={form.user_message} onChange={handleChange} />
                                    {errors.user_message && <span className="form-error">{errors.user_message}</span>}
                                </div>
                                <MagneticBtn className="form-submit-wrap" strength={0.2}>
                                    <button type="submit" className="form-submit" disabled={status === 'loading'}>
                                        {status === 'loading'
                                            ? <><span className="submit-spinner" />Sending...</>
                                            : <><i className="fa-solid fa-paper-plane" />Send Message</>}
                                    </button>
                                </MagneticBtn>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
