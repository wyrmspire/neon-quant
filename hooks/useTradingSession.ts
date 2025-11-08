import { useState, useCallback } from 'react';
import { Trade } from '../types';

export const useTradingSession = () => {
    const [position, setPosition] = useState<Trade | null>(null);
    const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
    const [ruleHits, setRuleHits] = useState<Record<string, number>>({});
    const [journalNotes, setJournalNotes] = useState("");
    const [score, setScore] = useState(0);

    const handleTradeAction = useCallback((action: 'buy' | 'sell' | 'flatten', currentPrice: number, currentTime: number) => {
        if (action === 'buy' && !position) {
            setPosition({ entryPrice: currentPrice, direction: 'long', size: 1, entryTime: currentTime });
        } else if (action === 'sell' && !position) {
            setPosition({ entryPrice: currentPrice, direction: 'short', size: 1, entryTime: currentTime });
        } else if (action === 'flatten' && position) {
            const pnl = (currentPrice - position.entryPrice) * (position.direction === 'long' ? 1 : -1);
            const closedTrade: Trade = { ...position, exitPrice: currentPrice, exitTime: currentTime, pnl };
            setClosedTrades(prev => [...prev, closedTrade]);
            setPosition(null);
        }
    }, [position]);

    const calculateUnrealizedPnl = useCallback((currentPrice: number) => {
        if (!position) return "0.00";
        const pnl = (currentPrice - position.entryPrice) * (position.direction === 'long' ? 1 : -1);
        return pnl.toFixed(2);
    }, [position]);

    const calculateRealizedPnl = useCallback(() => {
        return closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0).toFixed(2);
    }, [closedTrades]);

    const addRuleHit = useCallback((rule: string) => {
         setRuleHits(prev => ({ ...prev, [rule]: (prev[rule] || 0) + 1 }));
    }, []);

    return {
        position,
        closedTrades,
        ruleHits,
        journalNotes,
        score,
        setJournalNotes,
        setScore,
        handleTradeAction,
        calculateUnrealizedPnl,
        calculateRealizedPnl,
        addRuleHit,
    };
};
