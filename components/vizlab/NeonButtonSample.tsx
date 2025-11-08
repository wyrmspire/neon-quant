import React from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const NeonButtonSample: React.FC = () => {
    return (
        <SamplePageLayout
            title="Neon Button Styles"
            description="A collection of button styles with various neon glow and press effects."
        >
            <div className="grid grid-cols-2 gap-8">
                <button className="neon-button neon-cyan">CYAN</button>
                <button className="neon-button neon-magenta">MAGENTA</button>
                <button className="neon-button neon-green">GREEN</button>
                <button className="neon-button neon-purple">PURPLE</button>
            </div>
            <style>{`
                .neon-button {
                    padding: 0.75rem 2rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    border: 2px solid;
                    border-radius: 0.5rem;
                    transition: all 0.3s ease;
                    text-shadow: 0 0 5px, 0 0 10px;
                }
                .neon-button:hover {
                    box-shadow: 0 0 10px, 0 0 20px, 0 0 30px;
                    transform: scale(1.05);
                }
                .neon-button:active {
                    transform: scale(0.95);
                }

                .neon-cyan { border-color: #06b6d4; color: #06b6d4; text-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4; }
                .neon-cyan:hover { box-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4; color: white; background-color: #06b6d4; }
                
                .neon-magenta { border-color: #d946ef; color: #d946ef; text-shadow: 0 0 5px #d946ef, 0 0 10px #d946ef; }
                .neon-magenta:hover { box-shadow: 0 0 10px #d946ef, 0 0 20px #d946ef, 0 0 30px #d946ef; color: white; background-color: #d946ef; }

                .neon-green { border-color: #4ade80; color: #4ade80; text-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80; }
                .neon-green:hover { box-shadow: 0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 30px #4ade80; color: white; background-color: #4ade80; }

                .neon-purple { border-color: #8b5cf6; color: #8b5cf6; text-shadow: 0 0 5px #8b5cf6, 0 0 10px #8b5cf6; }
                .neon-purple:hover { box-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6; color: white; background-color: #8b5cf6; }
            `}</style>
        </SamplePageLayout>
    );
};