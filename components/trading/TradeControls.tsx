import React from 'react';
import { Trade } from '../../types';
import { PhaseId } from '../../game/director';

interface TradeControlsProps {
    position: Trade | null;
    phaseId: PhaseId | undefined;
    onTradeAction: (action: 'buy' | 'sell' | 'flatten') => void;
}

export const TradeControls: React.FC<TradeControlsProps> = ({ position, phaseId, onTradeAction }) => {
    const isTradingActive = phaseId === 'play';
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Trade Controls</h3>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => onTradeAction('buy')} 
                    disabled={!!position || !isTradingActive} 
                    className="w-full py-3 bg-green-600 font-bold rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    BUY
                </button>
                <button 
                    onClick={() => onTradeAction('sell')} 
                    disabled={!!position || !isTradingActive} 
                    className="w-full py-3 bg-red-600 font-bold rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    SELL
                </button>
                <button 
                    onClick={() => onTradeAction('flatten')} 
                    disabled={!position || !isTradingActive} 
                    className="w-full py-2 bg-gray-500 font-bold rounded-md hover:bg-gray-400 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    FLATTEN
                </button>
            </div>
        </div>
    );
};
