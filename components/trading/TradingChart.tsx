import React from 'react';
import { Candle } from '../../ports/charting';

const Candlestick: React.FC<{ candle: Candle, index: number, totalCandles: number, y: (price: number) => number, width: number }> = ({ candle, index, totalCandles, y, width }) => {
    const isBullish = candle.close >= candle.open;
    const color = isBullish ? '#4ade80' : '#f87171'; // green-400, red-400

    const bodyTop = y(Math.max(candle.open, candle.close));
    const bodyBottom = y(Math.min(candle.open, candle.close));
    const bodyHeight = bodyBottom - bodyTop;

    const wickHigh = y(candle.high);
    const wickLow = y(candle.low);
    
    const x = (index / totalCandles) * 100 + (width / 2);

    return (
        <g>
            {/* Wick */}
            <line x1={`${x}%`} y1={`${wickHigh}%`} x2={`${x}%`} y2={`${wickLow}%`} stroke={color} strokeWidth="1" />
            {/* Body */}
            <rect 
                x={`${(index / totalCandles) * 100}%`} 
                y={`${bodyTop}%`} 
                width={`${width}%`} 
                height={`${bodyHeight}%`} 
                fill={color} 
            />
        </g>
    );
};


export const TradingChart = React.memo<{ candles: Candle[] }>(({ candles }) => {
    const chartHeight = 200;

    if (candles.length < 2) {
        return <div style={{ height: `${chartHeight}px` }} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">Not enough data to display chart.</div>;
    }

    const maxPrice = Math.max(...candles.map(c => c.high));
    const minPrice = Math.min(...candles.map(c => c.low));
    const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;
    
    // Y-coordinate function (price to percentage)
    const getY = (price: number) => 100 - ((price - minPrice) / priceRange) * 100;

    const candleWidthPercentage = 100 / (candles.length * 1.5); // Add some spacing

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: `${chartHeight}px`, width: '100%' }}>
                {candles.map((candle, index) => (
                    <Candlestick 
                        key={candle.timestamp}
                        candle={candle}
                        index={index}
                        totalCandles={candles.length}
                        y={getY}
                        width={candleWidthPercentage}
                    />
                ))}
            </svg>
        </div>
    );
});