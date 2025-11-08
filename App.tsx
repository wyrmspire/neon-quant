import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgentView } from './components/agent/AgentView';
import { GameView } from './components/GameView';
import { VizLabView } from './components/VizLabView';
import { CampaignView } from './components/CampaignView';
import { AppMode, GameScreen, VizLabTool, AppStateSetters } from './types';
import { AgentIcon, GamepadIcon, VizLabIcon, TestTubeIcon, CampaignIcon } from './components/Icons';
import { DevTestRunnerModal } from './components/DevTestRunnerModal';
import { DataProvider } from './context/DataContext';
import { SmokeTestRunner } from './components/dev/SmokeTestRunner';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>('campaign');
    const [gameScreen, setGameScreen] = useState<GameScreen>('hub');
    const [vizLabTool, setVizLabTool] = useState<VizLabTool>('avatarStudio');
    
    const [isTestRunnerVisible, setIsTestRunnerVisible] = useState(false);
    const [isSmokeTestRunning, setIsSmokeTestRunning] = useState(false);

    // Expose debug controls to the window object for manual console testing
    useEffect(() => {
        // @ts-ignore
        window.neonQuantDebug = {
            setMode,
            setGameScreen,
            setVizLabTool,
        };
        console.log('Neon Quant Debug Tools enabled. Access with `window.neonQuantDebug`.');
        
        return () => {
            // @ts-ignore
            delete window.neonQuantDebug;
        };
    }, [setMode, setGameScreen, setVizLabTool]);


    const renderView = () => {
        switch (mode) {
            case 'agent':
                return <AgentView />;
            case 'game':
                return <GameView screen={gameScreen} setScreen={setGameScreen} />;
            case 'vizlab':
                return <VizLabView tool={vizLabTool} setTool={setVizLabTool} />;
            case 'campaign':
                return <CampaignView />;
            default:
                return <CampaignView />;
        }
    };

    const NavButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => {
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive
                        ? 'bg-cyan-500 text-gray-900'
                        : 'text-gray-400 hover:bg-gray-700'
                }`}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    };
    
    const onCompleteSmokeTest = useCallback(() => {
        setIsSmokeTestRunning(false);
    }, []);

    const appStateSetters = useMemo<AppStateSetters>(() => ({
        setMode,
        setGameScreen,
        setVizLabTool,
    }), [setMode, setGameScreen, setVizLabTool]);


    return (
        <DataProvider>
            <div className="bg-transparent text-white h-screen flex flex-col font-sans">
                {isSmokeTestRunning && (
                    <SmokeTestRunner 
                        setters={appStateSetters} 
                        onComplete={onCompleteSmokeTest} 
                    />
                )}
                {isTestRunnerVisible && (
                    <DevTestRunnerModal 
                        onClose={() => setIsTestRunnerVisible(false)} 
                        onStartSmokeTest={() => {
                            setIsSmokeTestRunning(true);
                            setIsTestRunnerVisible(false);
                        }}
                    />
                )}
                <header className="flex justify-between items-center p-2 border-b border-gray-700/50 bg-black/30 backdrop-blur-md flex-shrink-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-lg">N</div>
                        <h1 className="text-xl font-bold text-white tracking-wider">
                            Project: <span className="text-cyan-400">Neon Quant</span>
                        </h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <NavButton
                                label="Campaign Mode"
                                icon={<CampaignIcon />}
                                isActive={mode === 'campaign'}
                                onClick={() => setMode('campaign')}
                            />
                            <NavButton
                                label="Agent Mode"
                                icon={<AgentIcon />}
                                isActive={mode === 'agent'}
                                onClick={() => setMode('agent')}
                            />
                            <NavButton
                                label="Game Mode"
                                icon={<GamepadIcon />}
                                isActive={mode === 'game'}
                                onClick={() => setMode('game')}
                            />
                            <NavButton
                                label="VizLab"
                                icon={<VizLabIcon />}
                                isActive={mode === 'vizlab'}
                                onClick={() => setMode('vizlab')}
                            />
                        </div>
                        <div className="w-px h-6 bg-gray-700"></div>
                        <button onClick={() => setIsTestRunnerVisible(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10 rounded-md transition-colors" title="Run Dev Tests">
                            <TestTubeIcon />
                            <span>Dev Tools</span>
                        </button>
                    </nav>
                </header>
                <main className="flex-1 overflow-hidden">
                    {renderView()}
                </main>
            </div>
        </DataProvider>
    );
};

export default App;