import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const MarketPulseSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Market Pulse"
            description="A visual indicator that pulses with color and size, reflecting real-time market activity."
        >
            <div className="w-full max-w-md h-48 p-8 flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="pulse-dot bg-green-400"></div>
                    <div className="pulse-dot bg-red-400" style={{ animationDelay: '1.5s' }}></div>
                </div>
            </div>
            <style>{`
                .pulse-dot {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    animation: market-pulse 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
                }

                @keyframes market-pulse {
                    0% {
                        transform: scale(0.1);
                        opacity: 1;
                    }
                    70% {
                        transform: scale(1);
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>
        </SamplePageLayout>
    );
};