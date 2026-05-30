import React from 'react';
import './styles/Footer.scss';

const NAV_LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'tools', label: 'Services' },
    { id: 'contact', label: 'Contact' },
];

function Footer({ scrollTo }) {
    const handleScroll = (id) => {
        if (scrollTo) {
            scrollTo(id);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Brand */}
                <div className="footer-brand" onClick={() => handleScroll('home')}>
                    <span className="footer-brand__v">V</span>igneshwar<span className="footer-brand__dot">.</span>
                </div>

                {/* Nav links */}
                <div className="footer-nav">
                    {NAV_LINKS.map(n => (
                        <button key={n.id} className="footer-link" onClick={() => handleScroll(n.id)}>
                            {n.label}
                        </button>
                    ))}
                </div>

                {/* Socials */}
                <div className="footer-socials">
                    <a href="https://www.linkedin.com/in/vigneshwar-h1222" target="_blank" rel="noopener noreferrer" className="footer-social" title="LinkedIn">
                        <i className="fa-brands fa-linkedin-in" />
                    </a>
                    <a href="https://github.com/VikyHari" target="_blank" rel="noopener noreferrer" className="footer-social" title="GitHub">
                        <i className="fa-brands fa-github" />
                    </a>
                    <a href="mailto:vikyhari321@gmail.com" className="footer-social" title="Email">
                        <i className="fa-regular fa-envelope" />
                    </a>
                </div>

                <div className="footer-divider" />

                <div className="footer-bottom">
                    <span className="footer-copy">
                        © {new Date().getFullYear()} Vigneshwar H. Built with React &amp; Three.js
                    </span>
                    <span className="footer-role">
                        Full Stack Developer · AI Engineer
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
