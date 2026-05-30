import './Marquee.scss';

const ITEMS = [
    'React.js', '✦', 'LLMOps', '✦', 'RAG Pipelines', '✦',
    'Node.js', '✦', 'Agentic AI', '✦', 'MCP', '✦',
    'ChromaDB', '✦', 'Ollama', '✦', 'Full Stack Dev', '✦',
];

function Marquee({ reverse = false }) {
    const doubled = [...ITEMS, ...ITEMS];
    return (
        <div className={`marquee ${reverse ? 'marquee--reverse' : ''}`}>
            <div className="marquee__track">
                {doubled.map((item, i) => (
                    <span key={i} className={item === '✦' ? 'marquee__dot' : 'marquee__item'}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Marquee;
