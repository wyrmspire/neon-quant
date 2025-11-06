import React from 'react';
import { Candle } from '../../ports/charting';

export const TradingChart = React.memo<{ candles: Candle[] }>(({ candles }) => {
    const chartHeight = 200;
    const data = candles.map(c => c.close); // Render close price

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
});
