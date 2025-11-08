import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

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