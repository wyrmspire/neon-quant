import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const LoadersSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Loaders & Spinners"
            description="A showcase of stylized loading bars and spinners that fit the neon-cyberpunk theme."
        >
            <div className="w-full max-w-2xl p-8 grid grid-cols-3 gap-8 items-center justify-items-center">
                
                {/* Loader 1: Pulsing Dots */}
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse-dot" style={{animationDelay: '0s'}}></div>
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse-dot" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse-dot" style={{animationDelay: '0.4s'}}></div>
                </div>

                {/* Loader 2: Spinning Triangle */}
                <div className="w-12 h-12 border-4 border-transparent border-t-purple-400 border-r-purple-400 rounded-full animate-spin-fast"></div>

                {/* Loader 3: Bar Scanner */}
                <div className="w-40 h-2 bg-gray-700 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-cyan-400 w-1/4 animate-scanner"></div>
                </div>

            </div>
            <style>{`
                @keyframes pulse-dot-anim {
                    0%, 80%, 100% { transform: scale(0.5); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
                .animate-pulse-dot {
                    animation: pulse-dot-anim 1.4s infinite ease-in-out both;
                }

                @keyframes spin-fast-anim {
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast {
                    animation: spin-fast-anim 0.8s linear infinite;
                }
                
                @keyframes scanner-anim {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(400%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-scanner {
                    animation: scanner-anim 2s linear infinite;
                }
            `}</style>
        </SamplePageLayout>
    );
};