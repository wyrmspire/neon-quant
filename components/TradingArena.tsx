import React, { useState, useEffect, useRef } from 'react';
// Fix: Corrected import paths for types and other components/services.
import { Episode, AiCharacter, Trade, Session } from '../types';
import { CharacterDialogueModal } from './CharacterDialogueModal';
import { InfoIcon } from './Icons';
import { mockApi } from '../services/mockApi';
import { syntheticMarket } from '../services/syntheticMarket';

interface TradingArenaProps {
    episode: Episode;
    onComplete: (session: Session) => void;
}

// A simple placeholder for a chart
const PriceChart: React.FC<{ data: number[] }> = ({ data }) => {
    const chartHeight = 200;
    if (data.length < 2) {
        return <div style={{ height: `${chartHeight}px` }} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">Not enough data to display chart.</div>;
    }
    const maxPrice = Math.max(...data);
    const minPrice = Math.min(...data);
    const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;
    
    const points = data.map((price, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((price - minPrice) / priceRange) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: `${chartHeight}px`, width: '100%' }}>
                <polyline
                    fill="none"
                    stroke="#06b6d4" // cyan-500
                    strokeWidth="0.5"
                    points={points}
                />
            </svg>
        </div>
    );
}

export const TradingArena: React.FC<TradingArenaProps> = ({ episode, onComplete }) => {
    const EPISODE_DURATION = 180; // 3 minutes
    const [time, setTime] = useState(EPISODE_DURATION);
    const [priceData, setPriceData] = useState<number[]>([]);
    const [currentPrice, setCurrentPrice] = useState(100);
    const [position, setPosition] = useState<Trade | null>(null);
    const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
    const [activeBeat, setActiveBeat] = useState<{ character: AiCharacter; dialogue: string; } | null>(null);
    const [characters, setCharacters] = useState<AiCharacter[]>([]);

    // Fix: The return type of setInterval in the browser is a number, not NodeJS.Timeout.
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Generate full price data on mount
        const data = syntheticMarket.generatePriceData(episode.seed, EPISODE_DURATION + 1);
        setPriceData(data);
        setCurrentPrice(data[0]);
        mockApi.getCharacters().then(setCharacters);
    }, [episode.seed]);
    
    const handleComplete = () => {
         if(timerRef.current) clearInterval(timerRef.current);
         // Calculate final PNL
         const finalPnl = closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
         const session: Session = {
             episodeId: episode.id,
             closedTrades: closedTrades,
             finalPnl: finalPnl
         };
         onComplete(session);
    }

    useEffect(() => {
        timerRef.current = window.setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime - 1;
                const elapsedTime = EPISODE_DURATION - newTime;

                // Update price
                if (priceData[elapsedTime]) {
                    setCurrentPrice(priceData[elapsedTime]);
                }

                // Check for character beats
                const beat = episode.characterBeats.find(b => b.t === elapsedTime);
                if (beat && characters.length > 0) {
                    const character = characters.find(c => c.id === beat.characterId);
                    if (character) {
                        setActiveBeat({ character, dialogue: beat.dialogue });
                    }
                }

                // End of episode
                if (newTime <= 0) {
                    handleComplete();
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [episode, onComplete, priceData, characters]);

    const handleTradeAction = (action: 'buy' | 'sell' | 'flatten') => {
        if (action === 'buy' && !position) {
            setPosition({ entryPrice: currentPrice, direction: 'long', size: 1, entryTime: time });
        } else if (action === 'sell' && !position) {
            setPosition({ entryPrice: currentPrice, direction: 'short', size: 1, entryTime: time });
        } else if (action === 'flatten' && position) {
            const pnl = (currentPrice - position.entryPrice) * (position.direction === 'long' ? 1 : -1);
            const closedTrade = { ...position, exitPrice: currentPrice, exitTime: time, pnl };
            setClosedTrades(prev => [...prev, closedTrade]);
            setPosition(null);
        }
    };
    
    const calculateUnrealizedPnl = () => {
        if (!position) return "0.00";
        const pnl = (currentPrice - position.entryPrice) * (position.direction === 'long' ? 1 : -1);
        return pnl.toFixed(2);
    }
    
    const calculateRealizedPnl = () => {
        return closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0).toFixed(2);
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="p-6 h-full flex flex-col">
            {activeBeat && <CharacterDialogueModal beat={activeBeat} onClose={() => setActiveBeat(null)} />}
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">{episode.title}</h1>
                <p className="text-gray-400">{episode.description}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                <div className="md:col-span-3 flex flex-col gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-white mb-2">Market View</h2>
                        <PriceChart data={priceData.slice(0, EPISODE_DURATION - time + 1)} />
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-white mb-2">Dashboard</h2>
                         <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-400">Time Left</p>
                                <p className="text-2xl font-mono font-bold text-cyan-300">{formatTime(time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Position</p>
                                <p className={`text-2xl font-bold ${position ? (position.direction === 'long' ? 'text-green-400' : 'text-red-400') : 'text-gray-200'}`}>
                                    {position ? `${position.direction.toUpperCase()} @ ${position.entryPrice.toFixed(2)}` : 'FLAT'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Unrealized P&L</p>
                                <p className={`text-2xl font-mono font-bold ${parseFloat(calculateUnrealizedPnl()) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {calculateUnrealizedPnl()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Realized P&L</p>
                                <p className={`text-2xl font-mono font-bold ${parseFloat(calculateRealizedPnl()) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {calculateRealizedPnl()}
                                </p>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="md:col-span-1 flex flex-col gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-3">Trade Controls</h3>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => handleTradeAction('buy')} disabled={!!position} className="w-full py-3 bg-green-600 font-bold rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed">BUY</button>
                            <button onClick={() => handleTradeAction('sell')} disabled={!!position} className="w-full py-3 bg-red-600 font-bold rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed">SELL</button>
                            <button onClick={() => handleTradeAction('flatten')} disabled={!position} className="w-full py-2 bg-gray-500 font-bold rounded-md hover:bg-gray-400 disabled:bg-gray-700 disabled:cursor-not-allowed">FLATTEN</button>
                        </div>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3">Objectives</h3>
                        <ul className="space-y-2">
                           {episode.objectives.map((obj, i) => (
                               <li key={i} className="flex items-center gap-2 text-gray-400">
                                   {/* Logic for completion not implemented yet */}
                                   <InfoIcon size={5}/> 
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