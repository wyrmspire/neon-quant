import React from 'react';
import { Trade } from '../../types';

interface TradeDashboardProps {
    timeLeft: number;
    position: Trade | null;
    unrealizedPnl: string;
    realizedPnl: string;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

export const TradeDashboard: React.FC<TradeDashboardProps> = ({ timeLeft, position, unrealizedPnl, realizedPnl }) => {
    const unrealizedPnlValue = parseFloat(unrealizedPnl);
    const realizedPnlValue = parseFloat(realizedPnl);
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2">Dashboard</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-400">Time Left</p>
                    <p className="text-2xl font-mono font-bold text-cyan-300">{formatTime(timeLeft)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Position</p>
                    <p className={`text-2xl font-bold ${position ? (position.direction === 'long' ? 'text-green-400' : 'text-red-400') : 'text-gray-200'}`}>
                        {position ? `${position.direction.toUpperCase()} @ ${position.entryPrice.toFixed(2)}` : 'FLAT'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Unrealized P&L</p>
                    <p className={`text-2xl font-mono font-bold ${unrealizedPnlValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {unrealizedPnl}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Realized P&L</p>
                    <p className={`text-2xl font-mono font-bold ${realizedPnlValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {realizedPnl}
                    </p>
                </div>
            </div>
        </div>
    );
};
