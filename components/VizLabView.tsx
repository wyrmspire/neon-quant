import React, { useState } from 'react';
import { AvatarStudio } from './AvatarStudio';
import { VizLabTool } from '../types';
import { GradientIcon, AnimationIcon, TextStreamIcon, FadeIcon, PulseIcon, CharacterIcon } from './Icons';
import { GradientDepthSample } from './vizlab/GradientDepthSample';
import { PopAnimationSample } from './vizlab/PopAnimationSample';
import { StreamingTextSample } from './vizlab/StreamingTextSample';
import { FadeEffectsSample } from './vizlab/FadeEffectsSample';
import { PulsingLightsSample } from './vizlab/PulsingLightsSample';

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                    ? 'bg-cyan-500/20 text-cyan-200'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

const toolConfig = {
    avatarStudio: { label: 'Avatar Studio', icon: <CharacterIcon />, component: <AvatarStudio /> },
    gradientDepth: { label: 'Gradient Depth', icon: <GradientIcon />, component: <GradientDepthSample /> },
    popAnimation: { label: 'Pop Animations', icon: <AnimationIcon />, component: <PopAnimationSample /> },
    streamingText: { label: 'Streaming Text', icon: <TextStreamIcon />, component: <StreamingTextSample /> },
    fadeEffects: { label: 'Fade Effects', icon: <FadeIcon />, component: <FadeEffectsSample /> },
    pulsingLights: { label: 'Pulsing Lights', icon: <PulseIcon />, component: <PulsingLightsSample /> },
};

export const VizLabView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<VizLabTool>('avatarStudio');

    const renderTool = () => {
        return toolConfig[activeTool].component;
    };

    return (
        <div className="flex h-full max-h-[calc(100vh-65px)]">
            <aside className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 flex-shrink-0">
                <h2 className="text-lg font-bold text-white mb-4 px-2">VizLab Tools</h2>
                <nav className="space-y-2">
                    {Object.entries(toolConfig).map(([key, { label, icon }]) => (
                        <NavButton
                            key={key}
                            label={label}
                            icon={icon}
                            isActive={activeTool === key}
                            onClick={() => setActiveTool(key as VizLabTool)}
                        />
                    ))}
                </nav>
            </aside>
            <main className="flex-1 overflow-auto">
                {renderTool()}
            </main>
        </div>
    );
};
