import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

const nodes = [
    { id: 'a', x: 100, y: 150, label: 'API' },
    { id: 'b', x: 300, y: 80, label: 'AGENT' },
    { id: 'c', x: 300, y: 220, label: 'GAME' },
    { id: 'd', x: 500, y: 150, label: 'UI' },
];

const links = [
    { source: 'a', target: 'b' },
    { source: 'a', target: 'c' },
    { source: 'b', target: 'd' },
    { source: 'c', target: 'd' },
];

export const DataNodesSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Interactive Data Nodes"
            description="An interactive graph visualization with glowing nodes and connecting beams."
        >
            <div className="w-full max-w-2xl h-80 bg-gray-900/50 rounded-lg border border-gray-700 relative">
                <svg width="100%" height="100%" viewBox="0 0 600 300">
                    <defs>
                        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(217, 70, 239, 0)" />
                            <stop offset="50%" stopColor="rgba(217, 70, 239, 1)" />
                            <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
                        </linearGradient>
                    </defs>

                    {/* Links */}
                    {links.map(link => {
                        const source = nodes.find(n => n.id === link.source)!;
                        const target = nodes.find(n => n.id === link.target)!;
                        return (
                             <line
                                key={`${link.source}-${link.target}`}
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke="rgba(0, 255, 255, 0.3)"
                                strokeWidth="2"
                                className="animated-beam"
                             />
                        );
                    })}
                    
                    {/* Nodes */}
                    {nodes.map(node => (
                        <g key={node.id} className="data-node" transform={`translate(${node.x}, ${node.y})`}>
                            <circle r="12" fill="#06b6d4" />
                            <circle r="20" fill="transparent" stroke="#06b6d4" strokeWidth="2" className="pulse-ring" />
                            <text x="0" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node.label}</text>
                        </g>
                    ))}
                </svg>
            </div>
            <style>{`
                .data-node {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .data-node:hover {
                    transform: translate(var(--tx), var(--ty)) scale(1.1);
                }
                .pulse-ring {
                    animation: pulse-node 2s infinite ease-in-out;
                    transform-origin: center;
                }
                @keyframes pulse-node {
                    0% { transform: scale(1); opacity: 1; }
                    70% { transform: scale(1.5); opacity: 0; }
                    100% { opacity: 0; }
                }
            `}</style>
        </SamplePageLayout>
    );
};