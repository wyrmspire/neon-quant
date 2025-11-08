import React from 'react';
import { InfoIcon } from '../Icons';

interface CoachsCornerProps {
    tip: string | null;
}

export const CoachsCorner: React.FC<CoachsCornerProps> = ({ tip }) => {
    // If there is no tip, don't render anything.
    // This prevents a phantom component from appearing if it's being
    // rendered unexpectedly with null or empty props.
    if (!tip) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg flex-1">
            <h3 className="text-lg font-semibold text-white mb-3">Coach's Tip</h3>
            <div className="flex items-start gap-2 text-cyan-300">
                <InfoIcon size={5} />
                <span className="italic">{tip}</span>
            </div>
        </div>
    );
};
