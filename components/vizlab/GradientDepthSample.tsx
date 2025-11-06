import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const GradientDepthSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Gradient Depth"
            description="Multi-layered, animated gradients to create a sense of depth."
        >
            <div className="w-full max-w-2xl h-96 rounded-xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden flex items-center justify-center p-8">
                 <div className="gradient-bg grad-1"></div>
                 <div className="gradient-bg grad-2"></div>
                 <div className="gradient-bg grad-3"></div>
                 <div className="relative z-10 text-center bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg">
                    <h2 className="text-3xl font-bold text-white">Animated Background</h2>
                    <p className="text-gray-300 mt-2">This effect is created by animating the `background-position` of multiple overlapping radial gradients at different speeds, creating a parallax effect.</p>
                 </div>
            </div>
            <style>{`
                .gradient-bg {
                    position: absolute;
                    inset: -50%;
                    background-size: 300% 300%;
                    animation: move-gradient 20s linear infinite;
                }
                .grad-1 {
                    background-image: radial-gradient(circle at 20% 20%, #0891b2 0%, transparent 40%);
                    animation-duration: 25s;
                }
                .grad-2 {
                    background-image: radial-gradient(circle at 80% 30%, #6d28d9 0%, transparent 35%);
                    animation-duration: 30s;
                    animation-direction: reverse;
                }
                .grad-3 {
                    background-image: radial-gradient(circle at 50% 90%, #be185d 0%, transparent 30%);
                    animation-duration: 20s;
                }
                @keyframes move-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </SamplePageLayout>
    );
};