import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const ChartGridSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Chart Grid"
            description="Demonstration of the animated, perspective grid lines used for chart backgrounds."
        >
            <div className="w-full max-w-2xl h-96 rounded-xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden flex items-center justify-center p-8">
                <div className="perspective-grid"></div>
                <h2 className="relative text-3xl font-bold text-white z-10">PERSPECTIVE GRID</h2>
            </div>
            <style>{`
                .perspective-grid {
                    --color-grid: rgba(0, 255, 255, 0.2);
                    content: '';
                    position: absolute;
                    inset: -100%;
                    background-image:
                      linear-gradient(var(--color-grid) 1px, transparent 1px),
                      linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: grid-move-sample 30s linear infinite;
                    transform: rotateX(75deg);
                    opacity: 0.7;
                }

                @keyframes grid-move-sample {
                    from { background-position-y: 0; }
                    to { background-position-y: -100px; }
                }
            `}</style>
        </SamplePageLayout>
    );
};