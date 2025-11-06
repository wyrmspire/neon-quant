import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const PopAnimationSample: React.FC = () => {
    const items = Array.from({ length: 6 });

    return (
        <SamplePageLayout
            title="Pop Animations"
            description="Staggered entry animations for UI elements, implemented with a looping CSS animation."
        >
            <div className="w-full max-w-2xl p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="grid grid-cols-3 gap-6">
                    {items.map((_, index) => (
                        <div 
                            key={index}
                            className="h-32 bg-cyan-500/80 rounded-lg shadow-lg pop-in-loop"
                            style={{ animationDelay: `${index * 150}ms` }}
                        ></div>
                    ))}
                </div>
                <p className="text-center text-gray-400 mt-6 text-sm">The animation is a pure CSS loop for better performance.</p>
            </div>
            <style>{`
                @keyframes pop-in-loop {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) translateY(20px);
                    }
                    20% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    80% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.5) translateY(20px);
                    }
                }
                .pop-in-loop {
                    animation: pop-in-loop 3s ease-in-out infinite;
                }
            `}</style>
        </SamplePageLayout>
    );
};
