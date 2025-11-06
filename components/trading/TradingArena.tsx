import React, { useState, useEffect, useMemo } from 'react';
import { Episode, Session } from '../../types';
import { Timeframe } from '../../ports/charting';
import { LoadingIcon } from '../Icons';
import { useGameCandlestickData } from '../../hooks/useGameCandles';
import { useGameIndicators } from '../../hooks/useGameIndicators';
import { Drill, Phase } from '../../game/director';
import { ReplayDrill } from '../../game/drills/replay-drill';
import { mockCoach } from '../../services/mockCoach';
import { mockJournal } from '../../services/mockJournal';
import { Director } from '../../game/director';
import { useTradingSession } from '../../hooks/useTradingSession';
import { TradingChart } from './TradingChart';
import { TradeDashboard } from './TradeDashboard';
import { TradeControls } from './TradeControls';
import { CoachsCorner } from './CoachsCorner';
import { PhaseOverlay } from './PhaseOverlay';

interface TradingArenaProps {
    episode: Episode; // Keep this for context, but the drill will drive the action
    onComplete: (session: Session) => void;
}

const TimeframeSelector: React.FC<{ selected: Timeframe, onSelect: (tf: Timeframe) => void }> = ({ selected, onSelect }) => {
    const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h'];
    return (
        <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 p-1">
            {timeframes.map(tf => (
                <button
                    key={tf}
                    onClick={() => onSelect(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        selected === tf ? 'bg-cyan-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    {tf}
                </button>
            ))}
        </div>
    );
};

export const TradingArena: React.FC<TradingArenaProps> = ({ episode, onComplete }) => {
    const drill = ReplayDrill; // Use the structured drill
    const director = useMemo(() => new Director(drill), [drill]);

    const [phase, setPhase] = useState<Phase | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentTip, setCurrentTip] = useState<string | null>(null);
    const [candleIndex, setCandleIndex] = useState(0);

    const { 
        position, closedTrades, ruleHits, journalNotes, score,
        setJournalNotes, setScore, handleTradeAction, 
        calculateUnrealizedPnl, calculateRealizedPnl, addRuleHit
    } = useTradingSession();
    
    const [timeframe, setTimeframe] = useState<Timeframe>(drill.timeframe);
    const anchorDate = useMemo(() => new Date(drill.anchorDate), [drill.anchorDate]);

    const { allCandleData, isLoading: isLoadingCandles } = useGameCandlestickData(drill.symbol, anchorDate);
    const { indicators } = useGameIndicators(allCandleData, timeframe);
    
    const replayCandles = allCandleData['1m'];
    const currentPrice = replayCandles[candleIndex]?.close ?? 0;
    
    const handleComplete = () => {
        const finalPnl = closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
        const session: Session = {
            episodeId: episode.id,
            closedTrades: closedTrades,
            finalPnl: finalPnl,
        };
        onComplete(session);
    };
    
    useEffect(() => {
        director.onPhaseChange = (newPhase) => setPhase(newPhase);
        director.onTick = (time) => {
             setTimeLeft(time);
             const playPhase = drill.phases.find(p => p.id === 'play');
             if (playPhase?.durationSec && replayCandles.length > 0) {
                const totalDuration = playPhase.durationSec;
                const elapsed = totalDuration - time;
                const progress = elapsed / totalDuration;
                setCandleIndex(Math.min(Math.floor(progress * replayCandles.length), replayCandles.length -1));
                
                // Evaluate coach tick
                const coachResult = mockCoach.evaluateTick({ price: currentPrice, position, indicators });
                if (coachResult.tip) setCurrentTip(coachResult.tip);
                if (coachResult.ruleHit) addRuleHit(coachResult.ruleHit);
             }
        };
        director.onTip = (tip) => setCurrentTip(tip);
        
        if (!isLoadingCandles) {
            director.start();
        }

        return () => director.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [director, isLoadingCandles, replayCandles.length]);


    const handleFinishReview = async () => {
        const pnl = parseFloat(calculateRealizedPnl());
        const calculatedScore = drill.scoring.rubric({ pnl, ruleHits });
        setScore(calculatedScore);
        
        await mockJournal.save({
            drillId: drill.id,
            pnl,
            score: calculatedScore,
            notes: journalNotes,
            ruleHits,
        });

        director.advancePhase();
    };
    
    if (isLoadingCandles) {
        return <div className="flex flex-col items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Market Data...</span></div>;
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <PhaseOverlay 
                phase={phase}
                currentTip={currentTip}
                journalNotes={journalNotes}
                onJournalNotesChange={setJournalNotes}
                score={score}
                onAdvance={director.advancePhase}
                onFinishReview={handleFinishReview}
                onComplete={handleComplete}
            />
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">{phase?.title || 'Loading...'}</h1>
                <p className="text-gray-400">{drill.id}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                <div className="md:col-span-3 flex flex-col gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                           <h2 className="text-lg font-semibold text-white">Market View</h2>
                           <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
                        </div>
                        <TradingChart candles={allCandleData[timeframe].slice(0, Math.ceil(candleIndex / { '1m':1, '5m':5, '15m':15, '1h':60, '4h':240 }[timeframe]))} />
                    </div>
                     <TradeDashboard 
                        timeLeft={timeLeft}
                        position={position}
                        unrealizedPnl={calculateUnrealizedPnl(currentPrice)}
                        realizedPnl={calculateRealizedPnl()}
                     />
                </div>
                <div className="md:col-span-1 flex flex-col gap-4">
                    <TradeControls 
                        position={position}
                        phaseId={phase?.id}
                        onTradeAction={(action) => handleTradeAction(action, currentPrice, timeLeft)}
                    />
                    <CoachsCorner tip={currentTip} />
                </div>
            </div>
        </div>
    );
};
