import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const ScanlineSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Scanline Overlay"
            description="A retro CRT-style scanline overlay to give components a vintage tech feel."
        >
            <div className="w-full max-w-2xl h-80 rounded-xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden flex items-center justify-center p-8">
                <img src="https://picsum.photos/seed/scanline/800/600" alt="background" className="absolute inset-0 w-full h-full object-cover"/>
                <div className="scanline-overlay"></div>
                <h2 className="relative text-4xl font-bold text-white z-10 text-center" style={{textShadow: '0 0 10px #06b6d4'}}>SCANLINE EFFECT ACTIVE</h2>
            </div>
            <style>{`
                .scanline-overlay {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: linear-gradient(
                        rgba(18, 18, 18, 0) 50%,
                        rgba(0, 0, 0, 0.25) 50%
                    ),
                    linear-gradient(
                        90deg,
                        rgba(255, 0, 0, 0.06),
                        rgba(0, 255, 0, 0.02),
                        rgba(0, 0, 255, 0.06)
                    );
                    background-size: 100% 4px, 100% 100%;
                    animation: scanline-anim 10s linear infinite;
                }
                @keyframes scanline-anim {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: 0% 100%;
                    }
                }
            `}</style>
        </SamplePageLayout>
    );
};