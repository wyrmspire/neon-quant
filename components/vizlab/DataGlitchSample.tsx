import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const DataGlitchSample: React.FC = () => {
    const text = "DATA STREAM";
    return (
        <SamplePageLayout
            title="Data Glitch Effect"
            description="An effect that simulates data corruption, perfect for hover states or critical alerts."
        >
            <div className="w-full max-w-md h-48 p-8 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="glitch-container font-mono text-5xl font-bold" data-text={text}>
                    {text}
                </div>
            </div>
            <style>{`
                .glitch-container {
                    position: relative;
                    color: #06b6d4;
                    animation: glitch-main 3s infinite linear alternate-reverse;
                }
                .glitch-container::before,
                .glitch-container::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #0c1824;
                    overflow: hidden;
                }
                .glitch-container::before {
                    left: 2px;
                    text-shadow: -1px 0 #e11d48;
                    animation: glitch-anim1 2s infinite linear alternate-reverse;
                }
                .glitch-container::after {
                    left: -2px;
                    text-shadow: -1px 0 #4ade80;
                    animation: glitch-anim2 2s infinite linear alternate-reverse;
                }

                @keyframes glitch-main {
                    0% { transform: skewX(0deg); }
                    10% { transform: skewX(5deg); }
                    20% { transform: skewX(0deg); }
                    30% { transform: skewX(-5deg); }
                    40% { transform: skewX(0deg); }
                    100% { transform: skewX(0deg); }
                }
                @keyframes glitch-anim1 {
                    0% { clip: rect(42px, 9999px, 44px, 0); }
                    5% { clip: rect(12px, 9999px, 60px, 0); }
                    10% { clip: rect(52px, 9999px, 80px, 0); }
                    15% { clip: rect(2px, 9999px, 30px, 0); }
                    20% { clip: rect(42px, 9999px, 44px, 0); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(42px, 9999px, 44px, 0); }
                    10% { clip: rect(2px, 9999px, 80px, 0); }
                    20% { clip: rect(52px, 9999px, 12px, 0); }
                    30% { clip: rect(32px, 9999px, 60px, 0); }
                    40% { clip: rect(42px, 9999px, 44px, 0); }
                }
            `}</style>
        </SamplePageLayout>
    );
};