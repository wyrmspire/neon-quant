import React from 'react';
import { AvatarStudio } from './AvatarStudio';
import { VizLabTool } from '../types';
import { GradientIcon, AnimationIcon, TextStreamIcon, FadeIcon, PulseIcon, CharacterIcon, StylerIcon, GlitchIcon, HoloCardIcon, MarketPulseIcon, GridIcon, NeonButtonIcon, ScanlinesIcon, TerminalIcon, LoaderBarIcon, ParallaxIcon, DataNodesIcon } from './Icons';
import { GradientDepthSample } from './vizlab/GradientDepthSample';
import { PopAnimationSample } from './vizlab/PopAnimationSample';
import { StreamingTextSample } from './vizlab/StreamingTextSample';
import { FadeEffectsSample } from './vizlab/FadeEffectsSample';
import { PulsingLightsSample } from './vizlab/PulsingLightsSample';
import { ThemeStudioSample } from './vizlab/ThemeStudioSample';
import { DataGlitchSample } from './vizlab/DataGlitchSample';
import { HoloCardSample } from './vizlab/HoloCardSample';
import { MarketPulseSample } from './vizlab/MarketPulseSample';
import { ChartGridSample } from './vizlab/ChartGridSample';
import { NeonButtonSample } from './vizlab/NeonButtonSample';
import { ScanlineSample } from './vizlab/ScanlineSample';
import { TerminalLoggerSample } from './vizlab/TerminalLoggerSample';
import { LoadersSample } from './vizlab/LoadersSample';
import { ParallaxHoverSample } from './vizlab/ParallaxHoverSample';
import { DataNodesSample } from './vizlab/DataNodesSample';

interface VizLabViewProps {
    tool: VizLabTool;
    setTool: (tool: VizLabTool) => void;
}

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
    themeStudio: { label: 'Theme Studio', icon: <StylerIcon />, component: <ThemeStudioSample /> },
    gradientDepth: { label: 'Gradient Depth', icon: <GradientIcon />, component: <GradientDepthSample /> },
    popAnimation: { label: 'Pop Animations', icon: <AnimationIcon />, component: <PopAnimationSample /> },
    streamingText: { label: 'Streaming Text', icon: <TextStreamIcon />, component: <StreamingTextSample /> },
    fadeEffects: { label: 'Fade Effects', icon: <FadeIcon />, component: <FadeEffectsSample /> },
    pulsingLights: { label: 'Pulsing Lights', icon: <PulseIcon />, component: <PulsingLightsSample /> },
    dataGlitch: { label: 'Data Glitch', icon: <GlitchIcon />, component: <DataGlitchSample /> },
    holoCard: { label: 'Holographic Card', icon: <HoloCardIcon />, component: <HoloCardSample /> },
    marketPulse: { label: 'Market Pulse', icon: <MarketPulseIcon />, component: <MarketPulseSample /> },
    chartGrid: { label: 'Chart Grid', icon: <GridIcon />, component: <ChartGridSample /> },
    neonButton: { label: 'Neon Buttons', icon: <NeonButtonIcon />, component: <NeonButtonSample /> },
    scanline: { label: 'Scanline Overlay', icon: <ScanlinesIcon />, component: <ScanlineSample /> },
    terminalLogger: { label: 'Terminal Logger', icon: <TerminalIcon />, component: <TerminalLoggerSample /> },
    loaders: { label: 'Loaders', icon: <LoaderBarIcon />, component: <LoadersSample /> },
    parallaxHover: { label: 'Parallax Hover', icon: <ParallaxIcon />, component: <ParallaxHoverSample /> },
    dataNodes: { label: 'Data Nodes', icon: <DataNodesIcon />, component: <DataNodesSample /> },
};

export const VizLabView: React.FC<VizLabViewProps> = ({ tool, setTool }) => {
    const renderTool = () => {
        return toolConfig[tool].component;
    };

    return (
        <div className="view-container flex h-full max-h-[calc(100vh-65px)]">
            <aside className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 flex-shrink-0 overflow-y-auto">
                <h2 className="text-lg font-bold text-white mb-4 px-2">VizLab Tools</h2>
                <nav className="space-y-2">
                    {Object.entries(toolConfig).map(([key, { label, icon }]) => (
                        <NavButton
                            key={key}
                            label={label}
                            icon={icon}
                            isActive={tool === key}
                            onClick={() => setTool(key as VizLabTool)}
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