import { useCallback, useMemo, useState } from 'react';
import { AppMode, GameScreen, VizLabTool, AppStateSetters } from '../types';

interface AppNavigationState {
    mode: AppMode;
    gameScreen: GameScreen;
    vizLabTool: VizLabTool;
    setters: AppStateSetters;
    setMode: (mode: AppMode) => void;
    setGameScreen: (screen: GameScreen) => void;
    setVizLabTool: (tool: VizLabTool) => void;
}

export const useAppNavigation = (): AppNavigationState => {
    const [mode, setMode] = useState<AppMode>('campaign');
    const [gameScreen, setGameScreen] = useState<GameScreen>('hub');
    const [vizLabTool, setVizLabTool] = useState<VizLabTool>('avatarStudio');

    const memoizedSetMode = useCallback((nextMode: AppMode) => {
        setMode(current => (current === nextMode ? current : nextMode));
    }, []);

    const memoizedSetGameScreen = useCallback((screen: GameScreen) => {
        setGameScreen(screen);
    }, []);

    const memoizedSetVizLabTool = useCallback((tool: VizLabTool) => {
        setVizLabTool(tool);
    }, []);

    const setters = useMemo<AppStateSetters>(() => ({
        setMode: memoizedSetMode,
        setGameScreen: memoizedSetGameScreen,
        setVizLabTool: memoizedSetVizLabTool,
    }), [memoizedSetMode, memoizedSetGameScreen, memoizedSetVizLabTool]);

    return {
        mode,
        gameScreen,
        vizLabTool,
        setters,
        setMode: memoizedSetMode,
        setGameScreen: memoizedSetGameScreen,
        setVizLabTool: memoizedSetVizLabTool,
    };
};
