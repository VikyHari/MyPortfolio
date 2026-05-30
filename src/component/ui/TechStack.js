import './TechStack.scss';

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// ── Row 1: Dev tools — direct SVG from devicons CDN ──────────────────────────
const ROW1 = [
    { name: 'React.js',     src: `${BASE}/react/react-original.svg` },
    { name: 'JavaScript',   src: `${BASE}/javascript/javascript-plain.svg` },
    { name: 'HTML5',        src: `${BASE}/html5/html5-plain.svg` },
    { name: 'CSS3',         src: `${BASE}/css3/css3-plain.svg` },
    { name: 'TypeScript',   src: `${BASE}/typescript/typescript-plain.svg` },
    { name: 'Node.js',      src: `${BASE}/nodejs/nodejs-original.svg` },
    { name: 'Python',       src: `${BASE}/python/python-original.svg` },
    { name: 'SASS',         src: `${BASE}/sass/sass-original.svg` },
    { name: 'Electron',     src: `${BASE}/electron/electron-original.svg` },
    { name: 'MongoDB',      src: `${BASE}/mongodb/mongodb-original.svg` },
    { name: 'AWS',          src: `${BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg` },
    { name: 'Git',          src: `${BASE}/git/git-original.svg` },
    { name: 'GitHub',       src: `${BASE}/github/github-original.svg`, invert: true },
    { name: 'Bootstrap',    src: `${BASE}/bootstrap/bootstrap-original.svg` },
    { name: 'Redux',        src: `${BASE}/redux/redux-original.svg` },
    { name: 'React Native', src: `${BASE}/react/react-original.svg` },
    { name: 'Figma',        src: `${BASE}/figma/figma-original.svg` },
    { name: 'VS Code',      src: `${BASE}/vscode/vscode-original.svg` },
    { name: 'Postman',      src: `${BASE}/postman/postman-original.svg` },
];

// ── Row 2: AI + custom tools (custom badges) ─────────────────────────────────
const ROW2 = [
    { name: 'ChatGPT',     badge: 'GPT',  color: '#10a37f' },
    { name: 'Gemini',      badge: 'G✦',  color: '#4f81fc' },
    { name: 'Claude',      badge: 'Cl',   color: '#d4830a' },
    { name: 'Ollama',      badge: 'O',    color: '#8b5cf6' },
    { name: 'ChromaDB',    badge: 'DB',   color: '#22d3ee' },
    { name: 'LangChain',   badge: 'LC',   color: '#34d399' },
    { name: 'Hugging Face',badge: '🤗',   color: '#ffd21e' },
    { name: 'RAG',         badge: 'RAG',  color: '#f472b6' },
    { name: 'LLMOps',      badge: 'Ops',  color: '#818cf8' },
    { name: 'MCP',         badge: 'MCP',  color: '#c9a96e' },
    { name: 'OpenAI',      badge: 'OAI',  color: '#10a37f' },
    { name: 'Agentic AI',  badge: 'AGI',  color: '#a78bfa' },
    { name: 'Vector DB',   badge: '⟨v⟩', color: '#7dd3fc' },
    { name: 'LLM',         badge: 'LLM',  color: '#fb7185' },
];

function TechIcon({ item }) {
    if (item.badge) {
        return (
            <div className="tech-item">
                <div className="tech-badge" style={{ '--tc': item.color }}>
                    <span style={{ color: item.color }}>{item.badge}</span>
                </div>
                <span className="tech-name">{item.name}</span>
            </div>
        );
    }
    return (
        <div className="tech-item">
            <img
                src={item.src}
                alt={item.name}
                className={`tech-img${item.invert ? ' tech-img--invert' : ''}`}
                loading="lazy"
                onError={(e) => { e.target.style.opacity = '0.2'; }}
            />
            <span className="tech-name">{item.name}</span>
        </div>
    );
}

function TechStack() {
    const doubled1 = [...ROW1, ...ROW1];
    const doubled2 = [...ROW2, ...ROW2];

    return (
        <div className="techstack">
            <div className="techstack__label">Tech Stack</div>

            <div className="techstack__row">
                <div className="techstack__track techstack__track--ltr">
                    {doubled1.map((item, i) => <TechIcon key={i} item={item} />)}
                </div>
            </div>

            <div className="techstack__row">
                <div className="techstack__track techstack__track--rtl">
                    {doubled2.map((item, i) => <TechIcon key={i} item={item} />)}
                </div>
            </div>
        </div>
    );
}

export default TechStack;
