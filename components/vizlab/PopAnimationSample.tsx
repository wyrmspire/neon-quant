import React, { useState, useEffect } from 'react';

const SamplePageLayout: React.FC<{ title: string; description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="p-8 h-full flex flex-col">
        <header className="text-center mb-8 flex-shrink-0">
            <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-lg text-gray-400 mt-1">{description}</p>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center">
            {children}
        </main>
    </div>
);

export const PopAnimationSample: React.FC = () => {
    const [key, setKey] = useState(0);

    // This allows re-triggering the animation
    useEffect(() => {
        const timer = setTimeout(() => setKey(prev => prev + 1), 2500);
        return () => clearTimeout(timer);
    }, [key]);

    const items = Array.from({ length: 6 });

    return (
        <SamplePageLayout
            title="Pop Animations"
            description="Staggered entry animations for UI elements."
        >
            <div className="w-full max-w-2xl p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <div key={key} className="grid grid-cols-3 gap-6">
                    {items.map((_, index) => (
                        <div 
                            key={index}
                            className="h-32 bg-cyan-500/80 rounded-lg shadow-lg pop-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        ></div>
                    ))}
                </div>
                <p className="text-center text-gray-400 mt-6 text-sm">The animation re-triggers every few seconds.</p>
            </div>
            <style>{`
                @keyframes pop-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .pop-in {
                    opacity: 0;
                    animation: pop-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
            `}</style>
        </SamplePageLayout>
    );
};
