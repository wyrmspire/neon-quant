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
    // The component is now only rendered when it's supposed to be running.
    // There is no more 'ready' state, it starts immediately.
    const [status, setStatus] = useState<'running' | 'done'>('running');
    const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 to kick off the sequence.
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
        // This single effect now controls the entire lifecycle of the test.
        if (status !== 'running') return;

        // Start immediately, then delay for subsequent steps.
        const delay = currentIndex === -1 ? 0 : TEST_DELAY_MS;

        const timer = setTimeout(() => {
            runTestStep(currentIndex + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [status, currentIndex, runTestStep]);
    
    // The component now only renders the running/done UI.
    // The confusing 'ready' state popup is gone.
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
