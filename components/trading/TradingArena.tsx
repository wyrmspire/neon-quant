import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Episode, Session, AiCharacter, Drill as ContentDrill } from '../../types';
import { Timeframe } from '../../ports/charting';
import { LoadingIcon } from '../Icons';
import { useGameCandlestickData } from '../../hooks/useGameCandles';
import { useGameIndicators } from '../../hooks/useGameIndicators';
import { Phase, Drill as DirectorDrill } from '../../game/director';
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
import { CharacterDialogueModal } from '../CharacterDialogueModal';
import { useData } from '../../context/DataContext';

interface TradingArenaProps {
    episode?: Episode;
    drill?: ContentDrill;
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

export const TradingArena: React.FC<TradingArenaProps> = ({ episode, drill, onComplete }) => {
    const { characters } = useData();
    // Convert the ContentDrill prop into a DirectorDrill, ensuring activeDrill is always of the correct type for the game director.
    // Use the passed drill or a default replay drill for episodes.
    const activeDrill: DirectorDrill = useMemo(() => {
        if (drill) {
            // Create a DirectorDrill from the ContentDrill, using ReplayDrill as a template for phases/scoring.
            return {
                ...ReplayDrill,
                id: drill.id,
                symbol: drill.scenarioSeed, // Map content seed to director symbol
            };
        }
        return ReplayDrill;
    }, [drill]);
    const director = useMemo(() => new Director(activeDrill), [activeDrill]);

    const [phase, setPhase] = useState<Phase | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentTip, setCurrentTip] = useState<string | null>(null);
    const [candleIndex, setCandleIndex] = useState(0);
    const [dialogue, setDialogue] = useState<{ character: AiCharacter; message: string; } | null>(null);

    const { 
        position, closedTrades, ruleHits, journalNotes, score,
        setJournalNotes, setScore, handleTradeAction, 
        calculateUnrealizedPnl, calculateRealizedPnl, addRuleHit
    } = useTradingSession();
    
    // Determine context from episode or drill
    const sessionContext = useMemo(() => ({
        id: episode?.id || drill?.id || 'unknown',
        title: episode?.title || drill?.name || 'Trading Session',
        seed: episode?.seed || drill?.scenarioSeed || 'RANGE:NORMAL',
        anchorDate: new Date(activeDrill.anchorDate),
        timeframe: activeDrill.timeframe,
    }), [episode, drill, activeDrill]);

    const [timeframe, setTimeframe] = useState<Timeframe>(sessionContext.timeframe);
    
    const { allCandleData, isLoading: isLoadingCandles } = useGameCandlestickData(sessionContext.seed, sessionContext.anchorDate);
    const { indicators } = useGameIndicators(allCandleData, timeframe);
    
    const replayCandles = allCandleData['1m'];
    const currentPrice = replayCandles[candleIndex]?.close ?? 0;
    
    const handleComplete = () => {
        const finalPnl = closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
        const session: Session = {
            episodeId: sessionContext.id,
            closedTrades: closedTrades,
            finalPnl: finalPnl,
        };
        onComplete(session);
    };
    
    const handleFinishReview = async () => {
        const pnl = parseFloat(calculateRealizedPnl());
        const calculatedScore = activeDrill.scoring.rubric({ pnl, ruleHits });
        setScore(calculatedScore);
        
        await mockJournal.save({
            drillId: activeDrill.id,
            pnl,
            score: calculatedScore,
            notes: journalNotes,
            ruleHits,
        });

        director.advancePhase();
    };

    const stateRef = useRef({
        position,
        indicators,
        currentPrice,
        addRuleHit,
        characters,
    });
    useEffect(() => {
        stateRef.current = { position, indicators, currentPrice, addRuleHit, characters };
    });

    useEffect(() => {
        director.onPhaseChange = (newPhase) => {
            setPhase(newPhase);

            if (newPhase.id === 'play' && episode) { // Only show dialogue in episodes
                setTimeout(() => {
                    const { characters } = stateRef.current;
                    const rival = characters.find(c => c.id === 'rival');
                    if(rival) {
                        setDialogue({
                            character: rival,
                            message: "Heard you were back in the arena. Try not to lose it all in one go."
                        });
                    }
                }, 8000);
            }
        };

        director.onTick = (time) => {
             setTimeLeft(time);
             const playPhase = activeDrill.phases.find(p => p.id === 'play');
             if (playPhase?.durationSec && replayCandles.length > 0) {
                const totalDuration = playPhase.durationSec;
                const elapsedSeconds = totalDuration - time;
                const progress = elapsedSeconds / totalDuration;

                setCandleIndex(Math.min(Math.floor(progress * replayCandles.length), replayCandles.length - 1));
                
                const { currentPrice, position, indicators, addRuleHit } = stateRef.current;
                const coachResult = mockCoach.evaluateTick({ price: currentPrice, position, indicators });
                if (coachResult.tip) setCurrentTip(coachResult.tip);
                if (coachResult.ruleHit) addRuleHit(coachResult.ruleHit);
             }
        };
        director.onTip = (tip) => setCurrentTip(tip);
        
        if (!isLoadingCandles && replayCandles.length > 0) {
            director.start();
        }

        return () => director.stop();
    }, [director, activeDrill.phases, isLoadingCandles, replayCandles.length, episode]);


    if (isLoadingCandles) {
        return <div className="flex flex-col items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Market Data...</span></div>;
    }

    return (
        <div className="p-6 h-full flex flex-col">
            {dialogue && (
                <CharacterDialogueModal 
                    character={dialogue.character}
                    message={dialogue.message}
                    onClose={() => setDialogue(null)}
                />
            )}
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
                <h1 className="text-3xl font-bold text-white">{sessionContext.title}</h1>
                <p className="text-gray-400">{phase?.title || 'Loading...'}</p>
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