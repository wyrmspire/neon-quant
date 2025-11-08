import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const StreamingTextSample: React.FC = () => {
    const text = "Project Neon Quant: The future of simulated trading is here...";
    const characterCount = text.length;

    return (
        <SamplePageLayout
            title="Streaming Text"
            description="A typewriter effect for revealing text character-by-character."
        >
            <div className="w-full max-w-3xl p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 
                    className="streaming-text font-mono text-3xl text-green-300 whitespace-nowrap overflow-hidden border-r-4 border-green-300"
                    style={{ width: `${characterCount}ch`, animation: `typing ${characterCount * 0.1}s steps(${characterCount}, end), blink-caret .75s step-end infinite` }}
                >
                    {text}
                </h2>
            </div>
            <style>{`
                @keyframes typing {
                    from { width: 0 }
                    to { width: ${characterCount}ch }
                }
                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: #6ee7b7; } /* green-300 */
                }
            `}</style>
        </SamplePageLayout>
    );
};