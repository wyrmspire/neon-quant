
import React, { useState, useEffect } from 'react';
import { GameScreen, Strategy } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeftIcon, LoadingIcon } from './Icons';

interface StrategyPlaybookScreenProps {
    onNavigate: (screen: GameScreen) => void;
}

const RegimeTag: React.FC<{ regime: Strategy['regime'] }> = ({ regime }) => {
    const regimeStyles: Record<Strategy['regime'], string> = {
        news: 'bg-red-500/20 text-red-300 border-red-500/30',
        range: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        trend: 'bg-green-500/20 text-green-300 border-green-500/30',
        volcrush: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${regimeStyles[regime]}`}>
            {regime.toUpperCase()}
        </span>
    );
};

const RulesSection: React.FC<{ title: string; rules: string[]; color: string }> = ({ title, rules, color }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <h4 className={`font-semibold mb-3 text-lg ${color}`}>{title}</h4>
        <ul className="space-y-2">
            {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                    <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></span>
                    <span className="text-gray-300">{rule}</span>
                </li>
            ))}
        </ul>
    </div>
);


export const StrategyPlaybookScreen: React.FC<StrategyPlaybookScreenProps> = ({ onNavigate }) => {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStrategies = async () => {
            setLoading(true);
            const data = await mockApi.getStrategies();
            setStrategies(data);
            if (data.length > 0) {
                setSelectedStrategy(data[0]);
            }
            setLoading(false);
        };
        fetchStrategies();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Strategies...</span></div>;
    }

    return (
        <div className="p-8 h-full max-h-[calc(100vh-65px)] flex flex-col">
            <header className="flex items-start justify-between mb-8 flex-shrink-0">
                <button onClick={() => onNavigate('hub')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    <ArrowLeftIcon />
                    Back to Hub
                </button>
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Strategy Playbook</h1>
                    <p className="text-lg text-gray-400 mt-1">Your personal library of trading knowledge.</p>
                </div>
                <div className="w-40"></div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* Left Pane: Strategy List */}
                <div className="md:col-span-1 bg-gray-800/50 p-4 rounded-lg border border-gray-700 overflow-y-auto">
                    <h2 className="text-xl font-bold text-white mb-4 px-2">Available Strategies</h2>
                    <nav className="space-y-2">
                        {strategies.map(strategy => (
                            <button
                                key={strategy.id}
                                onClick={() => setSelectedStrategy(strategy)}
                                className={`w-full text-left p-3 rounded-md transition-colors ${selectedStrategy?.id === strategy.id ? 'bg-cyan-500/20 text-cyan-200' : 'hover:bg-gray-700/50 text-gray-300'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{strategy.name}</span>
                                    <RegimeTag regime={strategy.regime} />
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Pane: Strategy Details */}
                <div className="md:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 overflow-y-auto">
                    {selectedStrategy ? (
                        <div className="space-y-6">
                            <header>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-3xl font-bold text-white">{selectedStrategy.name}</h2>
                                    <RegimeTag regime={selectedStrategy.regime} />
                                </div>
                                <p className="text-gray-400 mt-2">{selectedStrategy.description}</p>
                            </header>
                            <div className="space-y-4">
                               <RulesSection title="Entry Conditions" rules={selectedStrategy.entryConditions} color="text-green-400" />
                               <RulesSection title="Exit Conditions" rules={selectedStrategy.exitConditions} color="text-red-400" />
                               {/* FIX: Corrected variable name from `selected` to `selectedStrategy`. */}
                               <RulesSection title="Risk Management" rules={selectedStrategy.riskManagement} color="text-yellow-400" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-lg">
                                {strategies.length > 0 ? "Select a strategy to view its details." : "No strategies created yet. Go to Agent Mode to create one."}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
