import React from 'react';
import { Episode, Strategy } from '../../types';

interface RegimeTagProps {
    regime: Episode['regime'] | Strategy['regime'];
}

export const RegimeTag: React.FC<RegimeTagProps> = ({ regime }) => {
    const regimeStyles: Record<Episode['regime'], string> = {
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
