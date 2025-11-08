import { useEffect } from 'react';
import { AppStateSetters } from '../types';

type DebugTools = AppStateSetters;

export const useDebugControls = (setters: DebugTools) => {
    useEffect(() => {
        if (!import.meta.env.DEV) {
            return;
        }

        const debugTools: DebugTools = {
            setMode: setters.setMode,
            setGameScreen: setters.setGameScreen,
            setVizLabTool: setters.setVizLabTool,
        };

        (window as unknown as { neonQuantDebug?: DebugTools }).neonQuantDebug = debugTools;
        console.log('Neon Quant Debug Tools enabled. Access with `window.neonQuantDebug`.');

        return () => {
            delete (window as unknown as { neonQuantDebug?: DebugTools }).neonQuantDebug;
        };
    }, [setters]);
};
