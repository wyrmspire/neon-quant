import React, { useState, useEffect, useCallback } from 'react';
import { AppStateSetters, GameScreen, VizLabTool, AppMode } from '../../types';
import { LoadingIcon, CheckCircleIcon } from '../Icons';

// This is the sequence of screens the test will navigate through.
const TEST_SEQUENCE: { mode: AppMode; screen?: GameScreen; tool?: VizLabTool }[] = [
    { mode: 'campaign' },
    { mode: 'agent' },
    { mode: 'game', screen: 'hub' },
    { mode: 'game', screen: 'episodeSelect' },
    { mode: 'game', screen: 'strategybook' },
    { mode: 'game', screen: 'dojo' },
    { mode: 'game', screen: 'market' },
    { mode: 'game', screen: 'contacts' },
    // Skip 'trading', 'debrief' as they require state
    { mode: 'vizlab', tool: 'avatarStudio' },
    { mode: 'vizlab', tool: 'themeStudio' },
    { mode: 'vizlab', tool: 'gradientDepth' },
    { mode: 'vizlab', tool: 'popAnimation' },
    { mode: 'vizlab', tool: 'streamingText' },
    { mode: 'vizlab', tool: 'fadeEffects' },
    { mode: 'vizlab', tool: 'pulsingLights' },
    { mode: 'vizlab', tool: 'dataGlitch' },
    { mode: 'vizlab', tool: 'holoCard' },
    { mode: 'vizlab', tool: 'marketPulse' },
    { mode: 'vizlab', tool: 'chartGrid' },
    { mode: 'vizlab', tool: 'neonButton' },
    { mode: 'vizlab', tool: 'scanline' },
    { mode: 'vizlab', tool: 'terminalLogger' },
    { mode: 'vizlab', tool: 'loaders' },
    { mode: 'vizlab', tool: 'parallaxHover' },
    { mode: 'vizlab', tool: 'dataNodes' },
];

const TEST_DELAY_MS = 750;

interface SmokeTestRunnerProps {
    setters: AppStateSetters;
    onComplete: () => void;
}

export const SmokeTestRunner: React.FC<SmokeTestRunnerProps> = ({ setters, onComplete }) => {
    const [status, setStatus] = useState<'ready' | 'running' | 'done'>('ready');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState('Initializing...');

    const runTestStep = useCallback((index: number) => {
        if (index >= TEST_SEQUENCE.length) {
            setStatus('done');
            setCurrentStep('Test Complete!');
            setTimeout(onComplete, 1500); // Wait before closing
            return;
        }

        const step = TEST_SEQUENCE[index];
        setters.setMode(step.mode);
        if (step.screen) {
            setters.setGameScreen(step.screen);
            setCurrentStep(`Testing Game > ${step.screen}`);
        } else if (step.tool) {
            setters.setVizLabTool(step.tool);
             setCurrentStep(`Testing VizLab > ${step.tool}`);
        } else {
             setCurrentStep(`Testing Mode > ${step.mode}`);
        }
        setCurrentIndex(index);
    }, [setters, onComplete]);

    useEffect(() => {
        if (status !== 'running') return;

        const timer = setTimeout(() => {
            runTestStep(currentIndex + 1);
        }, TEST_DELAY_MS);

        return () => clearTimeout(timer);
    }, [status, currentIndex, runTestStep]);

    const handleStart = () => {
        setStatus('running');
        runTestStep(0);
    };

    if (status === 'ready') {
        return (
            <div className="fixed bottom-4 right-4 bg-gray-800 border-2 border-purple-400/50 rounded-xl shadow-2xl p-6 text-white z-50 max-w-sm">
                <h2 className="text-xl font-bold text-purple-300 mb-2">UI Smoke Test Ready</h2>
                <p className="text-sm text-gray-300 mb-4">This will automatically cycle through all major UI screens to check for crashes. The app will be unresponsive during the test.</p>
                <button onClick={handleStart} className="w-full py-2 bg-purple-600 font-bold rounded-md hover:bg-purple-500">
                    Start Test
                </button>
            </div>
        );
    }
    
    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 border-2 border-purple-400/50 rounded-xl shadow-2xl p-4 text-white z-50">
            <div className="flex items-center gap-4">
                {status === 'running' ? <LoadingIcon className="text-purple-400" /> : <CheckCircleIcon className="text-green-400" />}
                <div>
                    <h3 className="font-bold text-lg">
                        {status === 'running' ? 'Smoke Test Running...' : 'Smoke Test Complete'}
                    </h3>
                    <p className="text-sm text-gray-400">{currentStep}</p>
                </div>
            </div>
        </div>
    );
};