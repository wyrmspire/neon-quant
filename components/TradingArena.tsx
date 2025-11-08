import React, { useState, useEffect, useRef } from 'react';
import { Episode, AiCharacter, Strategy } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeftIcon, InfoIcon, CheckCircleIcon } from './Icons';
import { CharacterDialogueModal } from './CharacterDialogueModal';


const MockChart: React.FC<{data: number[]}> = ({data}) => {
    const width = 500;
    const height = 250;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((p, i) => `${(i / (data.length -1)) * width},${height - ((p - min) / range) * height}`).join(' ');

    return (
        <div className="bg-gray-900/50 p-2 rounded-md">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <polyline
                fill="none"
                stroke="#06b6d4" // cyan-500
                strokeWidth="2"
                points={points}
            />
        </svg>
        </div>
    )
}

const EpisodeCompleteModal: React.FC<{ reward: number; onConfirm: () => void }> = ({ reward, onConfirm }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 border-2 border-green-400/50 rounded-xl shadow-2xl shadow-green-500/10 w-full max-w-md text-center p-8">
            <div className="flex flex-col items-center">
                <CheckCircleIcon size={16} />
                <h2 className="text-3xl font-bold text-white mt-4">Episode Complete</h2>
                <p className="text-lg text-gray-300 mt-2">You survived the session.</p>
                <div className="mt-6 bg-gray-900/50 rounded-lg p-4">
                    <p className="text-gray-400">Reward</p>
                    <p className="text-4xl font-bold text-green-400">+{reward} Cred</p>
                </div>
                <button 
                    onClick={onConfirm}
                    className="mt-8 px-8 py-3 w-full bg-green-500 text-gray-900 font-semibold rounded-md hover:bg-green-400 transition-colors"
                >
                    Return to Hub
                </button>
            </div>
        </div>
    </div>
);


export const TradingArena: React.FC<{ episode: Episode; onExit: (reward?: number) => void }> = ({ episode, onExit }) => {
    const [time, setTime] = useState(0);
    const [priceData, setPriceData] = useState<number[]>([100]);
    const [pnl, setPnl] = useState(0);
    const [position, setPosition] = useState<"long" | "short" | null>(null);
    const [activeBeat, setActiveBeat] = useState<{character: AiCharacter, dialogue: string} | null>(null);
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [activeStrategy, setActiveStrategy] = useState<Strategy | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const EPISODE_DURATION = 120; // 2 minutes for demo purposes

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            setTime(prev => {
                const newTime = prev + 1;
                if (newTime >= EPISODE_DURATION) {
                    handleComplete();
                }
                return newTime;
            });
            setPriceData(prev => {
                const lastPrice = prev[prev.length -1];
                const change = (Math.random() - 0.5) * 2;
                const newPrice = Math.max(0, lastPrice + change);
                if(position) {
                    const priceDiff = newPrice - lastPrice;
                    setPnl(pnl => pnl + (position === 'long' ? priceDiff : -priceDiff));
                }
                return [...prev.slice(-100), newPrice];
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [position]);
    
    useEffect(() => {
        const checkBeats = async () => {
            const beat = episode.characterBeats.find(b => b.t === time);
            if (beat) {
                const character = await mockApi.getCharacter(beat.characterId);
                if (character) {
                    setActiveBeat({ character, dialogue: beat.dialogue });
                }
            }
        };
        checkBeats();
    }, [time, episode.characterBeats]);
    
    useEffect(() => {
        const fetchStrategies = async () => {
            const data = await mockApi.getStrategies();
            setStrategies(data);
        };
        fetchStrategies();
    }, []);

    const handleTrade = (side: "long" | "short") => {
        if (position) { 
            setPosition(null);
        } else {
            setPosition(side);
        }
    }

    const handleComplete = () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
        mockApi.grantEpisodeReward(episode.reward);
        setIsComplete(true);
    };

    const handleExit = () => {
        onExit(episode.reward);
    }


    return (
        <div className="flex flex-col h-full p-4 md:p-6 bg-gray-900">
            {activeBeat && <CharacterDialogueModal beat={activeBeat} onClose={() => setActiveBeat(null)} />}
            {isComplete && <EpisodeCompleteModal reward={episode.reward} onConfirm={handleExit} />}

            <div className="flex items-center justify-between mb-4">
                <button onClick={() => onExit()} className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    <ArrowLeftIcon />
                    Exit
                </button>
                <h1 className="text-2xl font-bold text-white">{episode.title}</h1>
                <div className="text-lg font-mono">Time: {time}s / {EPISODE_DURATION}s</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Main Panel */}
                <div className="lg:col-span-2 bg-gray-800/50 p-4 rounded-lg flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-cyan-300">Market: {episode.seed}</h2>
                    <div className="flex-1">
                        <MockChart data={priceData} />
                    </div>
                </div>

                {/* Side Panel */}
                <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col gap-4">
                    {/* Position Panel */}
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold mb-2 text-white">Position</h3>
                        <div className="flex justify-between items-center text-lg">
                            <span>Status:</span>
                            <span className={`font-bold ${position === 'long' ? 'text-green-400' : position === 'short' ? 'text-red-400' : 'text-gray-400'}`}>
                                {position ? position.toUpperCase() : 'FLAT'}
                            </span>
                        </div>
                         <div className="flex justify-between items-center text-lg">
                            <span>Unrealized P&L:</span>
                            <span className={`font-mono ${pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-gray-400'}`}>${pnl.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <button onClick={() => handleTrade('long')} className="py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-500 disabled:bg-gray-500">{position ? 'Close' : 'Buy'}</button>
                            <button onClick={() => handleTrade('short')} className="py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-500 disabled:bg-gray-500">{position ? 'Close' : 'Sell'}</button>
                        </div>
                    </div>
                    {/* Strategy Panel */}
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold mb-3 text-white">Strategy Playbook</h3>
                        <select 
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={activeStrategy?.id || ''}
                            onChange={(e) => {
                                const selectedStrategy = strategies.find(s => s.id === e.target.value) || null;
                                setActiveStrategy(selectedStrategy);
                            }}
                        >
                            <option value="">None</option>
                            {strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {activeStrategy && (
                            <div className="mt-4 text-sm space-y-3">
                                <div>
                                    <h4 className="font-semibold text-purple-300">Entry Conditions</h4>
                                    <ul className="list-disc list-inside text-gray-400 pl-2">
                                        {activeStrategy.entryConditions.map((rule, i) => <li key={i}>{rule}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-purple-300">Exit Conditions</h4>
                                    <ul className="list-disc list-inside text-gray-400 pl-2">
                                        {activeStrategy.exitConditions.map((rule, i) => <li key={i}>{rule}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-purple-300">Risk Management</h4>
                                    <ul className="list-disc list-inside text-gray-400 pl-2">
                                        {activeStrategy.riskManagement.map((rule, i) => <li key={i}>{rule}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Objectives Panel */}
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold mb-3 text-white">Objectives</h3>
                        <ul className="space-y-2">
                            {episode.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-300">
                                    <InfoIcon />
                                    <span>{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};