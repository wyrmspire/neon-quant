import React, { useCallback, useMemo, useState } from 'react';
import { AgentView } from './components/agent/AgentView';
import { GameView } from './components/GameView';
import { VizLabView } from './components/VizLabView';
import { CampaignView } from './components/CampaignView';
import { AppStateSetters, AppMode, GameScreen, VizLabTool } from './types';
import { TestTubeIcon } from './components/Icons';
import { DataProvider } from './context/DataContext';
import { SmokeTestRunner } from './components/dev/SmokeTestRunner';
import { DevToolsPanel } from './components/dev/DevToolsPanel';
import { AppLayout } from './components/layout/AppLayout';
import { AppHeader } from './components/layout/AppHeader';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useDebugControls } from './hooks/useDebugControls';

const isDevEnvironment = import.meta.env.DEV;

const renderViewForMode = (
    mode: AppMode,
    gameScreen: GameScreen,
    vizLabTool: VizLabTool,
    appStateSetters: AppStateSetters
) => {
    switch (mode) {
        case 'agent':
            return <AgentView />;
        case 'game':
            return <GameView screen={gameScreen} setScreen={appStateSetters.setGameScreen} />;
        case 'vizlab':
            return <VizLabView tool={vizLabTool} setTool={appStateSetters.setVizLabTool} />;
        case 'campaign':
        default:
            return <CampaignView />;
    }
};

const App: React.FC = () => {
    const { mode, gameScreen, vizLabTool, setMode, setters } = useAppNavigation();
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
    const [isSmokeTestRunning, setIsSmokeTestRunning] = useState(false);

    useDebugControls(setters);

    const handleStartSmokeTest = useCallback(() => {
        setIsSmokeTestRunning(true);
        setIsDevToolsOpen(false);
    }, []);

    const handleCompleteSmokeTest = useCallback(() => {
        setIsSmokeTestRunning(false);
    }, []);

    const toggleDevTools = useCallback(() => {
        setIsDevToolsOpen(prev => !prev);
    }, []);

    const activeView = useMemo(
        () => renderViewForMode(mode, gameScreen, vizLabTool, setters),
        [mode, gameScreen, vizLabTool, setters]
    );

    return (
        <DataProvider>
            <AppLayout
                header={
                    <AppHeader mode={mode} onChangeMode={setMode}>
                        {isDevEnvironment && (
                            <button
                                onClick={toggleDevTools}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10 rounded-md transition-colors"
                                title="Open developer tools"
                            >
                                <TestTubeIcon />
                                <span>{isDevToolsOpen ? 'Hide Dev Tools' : 'Dev Tools'}</span>
                            </button>
                        )}
                    </AppHeader>
                }
            >
                {isDevEnvironment && isDevToolsOpen && (
                    <DevToolsPanel onClose={toggleDevTools} onStartSmokeTest={handleStartSmokeTest} />
                )}
                {isDevEnvironment && isSmokeTestRunning && (
                    <SmokeTestRunner setters={setters} onComplete={handleCompleteSmokeTest} />
                )}
                {activeView}
            </AppLayout>
        </DataProvider>
    );
};

export default App;
