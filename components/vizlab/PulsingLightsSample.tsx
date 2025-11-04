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

export const PulsingLightsSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Pulsing Lights"
            description="A neon glow effect for highlighting interactive elements."
        >
            <div className="w-full max-w-md h-48 p-8 flex items-center justify-center">
                <button
                    className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg pulse-glow"
                >
                    Engage
                </button>
            </div>
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #0891b2;
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 20px #06b6d4, 0 0 40px #0891b2, 0 0 60px #0891b2, 0 0 80px #0e7490;
                        transform: scale(1.05);
                    }
                }
                .pulse-glow {
                    animation: pulse-glow 3s infinite ease-in-out;
                }
            `}</style>
        </SamplePageLayout>
    );
};
