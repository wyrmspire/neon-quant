import React from 'react';
import { AppMode } from '../../types';
import { AgentIcon, CampaignIcon, GamepadIcon, VizLabIcon } from '../Icons';
import { NavButton } from './NavButton';

const NAV_ITEMS: { mode: AppMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'campaign', label: 'Campaign Mode', icon: <CampaignIcon /> },
    { mode: 'agent', label: 'Agent Mode', icon: <AgentIcon /> },
    { mode: 'game', label: 'Game Mode', icon: <GamepadIcon /> },
    { mode: 'vizlab', label: 'VizLab', icon: <VizLabIcon /> },
];

interface AppHeaderProps {
    mode: AppMode;
    onChangeMode: (mode: AppMode) => void;
    children?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ mode, onChangeMode, children }) => {
    return (
        <header className="flex justify-between items-center p-2 border-b border-gray-700/50 bg-black/30 backdrop-blur-md flex-shrink-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-lg">N</div>
                <h1 className="text-xl font-bold text-white tracking-wider">
                    Project: <span className="text-cyan-400">Neon Quant</span>
                </h1>
            </div>
            <nav className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {NAV_ITEMS.map(item => (
                        <NavButton
                            key={item.mode}
                            label={item.label}
                            icon={item.icon}
                            isActive={mode === item.mode}
                            onClick={() => onChangeMode(item.mode)}
                        />
                    ))}
                </div>
                {children && <div className="flex items-center gap-2">{children}</div>}
            </nav>
        </header>
    );
};
