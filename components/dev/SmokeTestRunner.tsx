import React, { useState, useEffect } from 'react';
import { AppStateSetters, AppMode, GameScreen, VizLabTool } from '../../types';
import { LoadingIcon } from '../Icons';

interface SmokeTestRunnerProps {
    stateSetters: AppStateSetters;
    onComplete: () => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const testSteps: { action: keyof AppStateSetters | 'log' | 'wait'; payload?: any; message?: string }[] = [
    { action: 'log', message: 'Starting UI Smoke Test...' },
    { action: 'setMode', payload: 'agent' },
    { action: 'wait', payload: 1500 },
    { action: 'setMode', payload: 'vizlab' },
    { action: 'wait', payload: 1000 },
    { action: 'setVizLabTool', payload: 'themeStudio' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'gradientDepth' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'popAnimation' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'streamingText' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'fadeEffects' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'pulsingLights' },
    { action: 'wait', payload: 1500 },
    { action: 'setVizLabTool', payload: 'avatarStudio' }, // A suspected component
    { action: 'wait', payload: 2000 },
    { action: 'setMode', payload: 'game' },
    { action: 'wait', payload: 1000 },
    { action: 'setGameScreen', payload: 'episodeSelect' },
    { action: 'wait', payload: 1500 },
    { action: 'setGameScreen', payload: 'strategybook' },
    { action: 'wait', payload: 1500 },
    { action: 'setGameScreen', payload: 'dojo' },
    { action: 'wait', payload: 1500 },
    { action: 'setGameScreen', payload: 'market' },
    { action: 'wait', payload: 1500 },
    { action: 'setGameScreen', payload: 'contacts' },
    { action: 'wait', payload: 1500 },
    { action: 'setGameScreen', payload: 'hub' },
    { action: 'wait', payload: 1000 },
    { action: 'setMode', payload: 'agent' },
    { action: 'log', message: 'Smoke Test Complete!' },
];

export const SmokeTestRunner: React.FC<SmokeTestRunnerProps> = ({ stateSetters, onComplete }) => {
    const [status, setStatus] = useState('Starting...');
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        const runTest = async () => {
            for (const step of testSteps) {
                if (isCancelled) break;
                
                const statusMessage = step.message || `Executing: ${step.action} with payload ${step.payload || 'N/A'}`;
                console.log(`%c[Smoke Test] ${statusMessage}`, 'color: #8B5CF6');
                setStatus(statusMessage);
                setCurrentStep(prev => prev + 1);

                switch (step.action) {
                    case 'setMode':
                        stateSetters.setMode(step.payload as AppMode);
                        break;
                    case 'setGameScreen':
                        stateSetters.setGameScreen(step.payload as GameScreen);
                        break;
                    case 'setVizLabTool':
                        stateSetters.setVizLabTool(step.payload as VizLabTool);
                        break;
                    case 'wait':
                        await sleep(step.payload as number);
                        break;
                }
                 await sleep(200); // Small buffer between steps
            }
            if (!isCancelled) {
                onComplete();
            }
        };

        runTest();

        return () => {
            isCancelled = true;
        };
    }, [stateSetters, onComplete]);

    const progress = (currentStep / testSteps.length) * 100;

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-2xl p-4 w-96 z-50 text-white">
            <h3 className="font-bold text-purple-300 flex items-center gap-2 mb-2">
                <LoadingIcon className="animate-spin" size={5}/> UI Smoke Test in Progress...
            </h3>
            <p className="text-sm text-gray-400 truncate">{status}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
             <button onClick={onComplete} className="text-xs text-gray-500 hover:text-white mt-2">Cancel</button>
        </div>
    );
};
