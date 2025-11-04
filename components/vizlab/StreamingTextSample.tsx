import React from 'react';

const SamplePageLayout: React.FC<{ title: string; description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="p-8 h-full flex flex-col">
        <header className="text-center mb-8 flex-shrink-0">
            <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-lg text-gray-400 mt-1">{description}</p>
        </header>
        <main className="flex-1 flex items-center justify-center">
            {children}
        </main>
    </div>
);

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
