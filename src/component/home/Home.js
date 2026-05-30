import React, { useEffect, useRef } from 'react';
import './styles/Home.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Typewriter } from 'react-simple-typewriter';
import MagneticBtn from '../ui/MagneticBtn';

gsap.registerPlugin(ScrollTrigger);

const pdf = '/resume.html';

// ── Build circular glow texture for particles ────────────────────────────────
function makeParticleTexture() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0,   'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

// ── Generate galaxy positions / colors ───────────────────────────────────────
function buildGalaxy(count = 80000, radius = 10, branches = 3, spin = 1.0, randomness = 0.28, randomnessPower = 3) {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    const inner = new THREE.Color('#8b5cf6'); // purple
    const mid   = new THREE.Color('#f472b6'); // pink
    const outer = new THREE.Color('#22d3ee'); // cyan

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r  = Math.random() * radius;
        const spinAngle   = r * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const rX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
        const rY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * 0.6;
        const rZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

        positions[i3]     = Math.cos(branchAngle + spinAngle) * r + rX;
        positions[i3 + 1] = rY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rZ;

        const t   = r / radius;
        const col = t < 0.5
            ? inner.clone().lerp(mid, t * 2)
            : mid.clone().lerp(outer, (t - 0.5) * 2);

        colors[i3]     = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
    }
    return { positions, colors };
}

function Home({ scrollTo }) {
    const canvasRef = useRef(null);
    const heroRef   = useRef(null);

    // ── Full Three.js galaxy scene ───────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const W = () => canvas.parentElement?.offsetWidth  || window.innerWidth;
        const H = () => canvas.parentElement?.offsetHeight || window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(W(), H());
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, W() / H(), 0.1, 100);
        camera.position.set(0, 4, 9);
        camera.lookAt(0, 0, 0);

        const tex = makeParticleTexture();

        // ── Galaxy disc ───────────────────────────────────────────────────────
        const { positions: gPos, colors: gCol } = buildGalaxy();
        const galaxyGeo = new THREE.BufferGeometry();
        galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
        galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(gCol, 3));
        const galaxyMat = new THREE.PointsMaterial({
            size: 0.018,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            alphaMap: tex,
        });
        const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
        scene.add(galaxy);

        // ── Second outer galaxy ring (tilted, faint) ─────────────────────────
        const { positions: g2Pos, colors: g2Col } = buildGalaxy(30000, 14, 2, 0.5, 0.5, 2);
        const g2Geo = new THREE.BufferGeometry();
        g2Geo.setAttribute('position', new THREE.BufferAttribute(g2Pos, 3));
        g2Geo.setAttribute('color',    new THREE.BufferAttribute(g2Col, 3));
        const g2Mat = new THREE.PointsMaterial({
            size: 0.012, sizeAttenuation: true, vertexColors: true,
            transparent: true, opacity: 0.45, depthWrite: false,
            blending: THREE.AdditiveBlending, alphaMap: tex,
        });
        const galaxy2 = new THREE.Points(g2Geo, g2Mat);
        galaxy2.rotation.x = Math.PI * 0.15;
        galaxy2.rotation.z = Math.PI * 0.1;
        scene.add(galaxy2);

        // ── Background star field ─────────────────────────────────────────────
        const starPositions = new Float32Array(25000 * 3);
        for (let i = 0; i < 25000 * 3; i++) starPositions[i] = (Math.random() - 0.5) * 80;
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff, size: 0.04, transparent: true, opacity: 0.55,
            depthWrite: false, blending: THREE.AdditiveBlending, alphaMap: tex,
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // ── Floating wireframe shapes ─────────────────────────────────────────
        const shapeData = [
            { geo: new THREE.IcosahedronGeometry(1.6, 0), color: 0x8b5cf6, pos: [-5, 1.5, -3], spd: [0.003, 0.004] },
            { geo: new THREE.OctahedronGeometry(1.0, 0),  color: 0x22d3ee, pos: [ 6, -0.8, -4], spd: [0.005, 0.003] },
            { geo: new THREE.TetrahedronGeometry(0.9, 0), color: 0xf472b6, pos: [ 2.5, 3.5, -5], spd: [0.004, 0.007] },
            { geo: new THREE.IcosahedronGeometry(0.7, 0), color: 0x34d399, pos: [-3, -2.5, -3], spd: [0.006, 0.004] },
            { geo: new THREE.OctahedronGeometry(0.5, 0),  color: 0x8b5cf6, pos: [ 4.5, 2, -2], spd: [0.008, 0.005] },
        ];
        const shapes = shapeData.map(({ geo, color, pos, spd }) => {
            const mat  = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.55 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...pos);
            mesh.userData = { spd, baseY: pos[1] };
            scene.add(mesh);
            return mesh;
        });

        // ── Central nebula glow (large transparent sphere) ────────────────────
        const nebulaGeo = new THREE.SphereGeometry(3, 32, 32);
        const nebulaMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6, transparent: true, opacity: 0.04, side: THREE.BackSide,
        });
        scene.add(new THREE.Mesh(nebulaGeo, nebulaMat));

        // ── Mouse ─────────────────────────────────────────────────────────────
        let mx = 0, my = 0;
        const onMouse = (e) => {
            mx = (e.clientX / window.innerWidth  - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * -2;
        };
        window.addEventListener('mousemove', onMouse);

        const onResize = () => {
            renderer.setSize(W(), H());
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        // ── Render loop ───────────────────────────────────────────────────────
        let raf;
        const clock = new THREE.Clock();
        const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Slowly rotate galaxy
            galaxy.rotation.y  = t * 0.04;
            galaxy2.rotation.y = t * 0.025;
            stars.rotation.y   = t * 0.006;
            stars.rotation.x   = t * 0.003;

            // Animate shapes
            shapes.forEach((mesh, i) => {
                mesh.rotation.x += mesh.userData.spd[0];
                mesh.rotation.y += mesh.userData.spd[1];
                mesh.position.y  = mesh.userData.baseY + Math.sin(t * 0.6 + i * 1.3) * 0.4;
            });

            // Smooth camera parallax
            camera.position.x += (mx * 2   - camera.position.x) * 0.022;
            camera.position.y += (my * 1.2 + 4 - camera.position.y) * 0.022;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
            [galaxyGeo, g2Geo, starGeo, galaxyMat, g2Mat, starMat, tex].forEach(o => o.dispose?.());
            renderer.dispose();
        };
    }, []);

    // ── GSAP hero entrance ────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.4 });
            tl.from('.hero__badge',          { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' })
              .from('.hero-title-line',       { y: '105%', opacity: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }, '-=0.3')
              .from('.hero__role',            { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
              .from('.hero__bio',             { y: 16, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
              .from('.hero__actions > *',     { y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
              .from('.hero__socials > *',     { y: 18, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .from('.hero__avatar-wrap',     { scale: 0.6, opacity: 0, duration: 1.2, ease: 'elastic.out(1,0.4)' }, '-=1.2')
              .from('.stat-card',             { y: 36, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
              .from('.hero__scroll',          { opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.2');
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // ── Parallax canvas on scroll ─────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.hero__canvas', {
                opacity: 0.2,
                scrollTrigger: { trigger: '#home', start: 'bottom 60%', end: 'bottom top', scrub: 1 },
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="hero" ref={heroRef}>
            <canvas ref={canvasRef} className="hero__canvas" />

            <div className="hero__orb hero__orb--purple" />
            <div className="hero__orb hero__orb--cyan" />

            <div className="hero__content">
                {/* ── Left ── */}
                <div className="hero__left">
                    <div className="hero__badge">
                        <span className="badge-dot" />
                        Available for opportunities
                    </div>

                    <div className="hero__greeting">Hello, I'm</div>

                    <h1 className="hero__name">
                        <div className="hero-name-clip">
                            <div className="hero-title-line hero-title-line--main">Vigneshwar H.</div>
                        </div>
                        <div className="hero-name-clip hero-name-clip--sub">
                            <div className="hero-title-line hero-title-line--sub">Full Stack · AI Engineer</div>
                        </div>
                    </h1>

                    <div className="hero__role">
                        <span className="role-prefix">&gt;&nbsp;</span>
                        <Typewriter
                            words={['React.js Developer', 'RAG Pipeline Builder', 'LLMOps Practitioner', 'Agentic AI Engineer', 'Node.js Backend Dev']}
                            loop={true} cursor cursorStyle="|"
                            typeSpeed={60} deleteSpeed={35} delaySpeed={1800}
                        />
                    </div>

                    <p className="hero__bio">
                        Building scalable web apps and integrating AI into real-world products.
                        Specializing in <span className="bio-highlight">RAG pipelines</span>,{' '}
                        <span className="bio-highlight">LLMOps</span>, and{' '}
                        <span className="bio-highlight">Agentic AI</span>.
                    </p>

                    <div className="hero__actions">
                        <MagneticBtn>
                            <a href="mailto:vikyhari321@gmail.com" className="btn-primary">
                                <i className="fa-solid fa-paper-plane" />Hire Me
                            </a>
                        </MagneticBtn>
                        <MagneticBtn>
                            <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                <i className="fa-solid fa-download" />Download CV
                            </a>
                        </MagneticBtn>
                    </div>

                    <div className="hero__socials">
                        {[
                            { url: 'https://www.linkedin.com/in/vigneshwar-h1222', icon: 'fa-brands fa-linkedin-in' },
                            { url: 'https://github.com/VikyHari', icon: 'fa-brands fa-github' },
                            { href: 'mailto:vikyhari321@gmail.com', icon: 'fa-regular fa-envelope' },
                        ].map((s, i) => (
                            <MagneticBtn key={i} strength={0.5}>
                                <a href={s.href || '#'} onClick={s.url ? () => window.open(s.url) : undefined} className="social-icon">
                                    <i className={s.icon} />
                                </a>
                            </MagneticBtn>
                        ))}
                    </div>
                </div>

                {/* ── Right ── */}
                <div className="hero__right">
                    <div className="hero__avatar-wrap">
                        <div className="avatar-ring avatar-ring--1" />
                        <div className="avatar-ring avatar-ring--2" />
                        <div className="avatar-ring avatar-ring--3" />
                        <div className="avatar-frame">
                            <div className="avatar-initials">VH</div>
                            <div className="avatar-glow" />
                        </div>
                    </div>

                    <div className="hero__stats">
                        {[
                            { icon: 'fa-solid fa-briefcase', num: '2+', label: 'Years Exp.' },
                            { icon: 'fa-solid fa-folder-open', num: '6+', label: 'Projects', cls: 'stat-card--cyan' },
                            { icon: 'fa-solid fa-brain', num: '1+', label: 'AI Systems', cls: 'stat-card--pink' },
                        ].map((s, i) => (
                            <div key={i} className={`stat-card ${s.cls || ''}`}>
                                <i className={`${s.icon} stat-icon`} />
                                <div className="stat-number">{s.num}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="hero__scroll" onClick={() => scrollTo?.('about')}>
                <div className="scroll-mouse"><div className="scroll-wheel" /></div>
                <span>Scroll down</span>
            </div>
        </div>
    );
}

export default Home;
