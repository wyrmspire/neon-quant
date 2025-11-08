import React from 'react';
import { Phase } from '../../game/director';

interface PhaseOverlayProps {
    phase: Phase | null;
    currentTip: string | null;
    journalNotes: string;
    onJournalNotesChange: (notes: string) => void;
    score: number;
    onAdvance: () => void;
    onFinishReview: () => void;
    onComplete: () => void;
}

export const PhaseOverlay: React.FC<PhaseOverlayProps> = ({
    phase,
    currentTip,
    journalNotes,
    onJournalNotesChange,
    score,
    onAdvance,
    onFinishReview,
    onComplete
}) => {
    if (!phase || phase.id === 'play') {
        return null;
    }

    const renderContent = () => {
        switch (phase.id) {
            case 'brief':
                return (
                    <div className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl p-8 max-w-lg text-center">
                        <h2 className="text-2xl font-bold text-cyan-300 mb-4">{phase.title}</h2>
                        <p className="text-lg text-gray-200 mb-6">{currentTip}</p>
                        <button onClick={onAdvance} className="px-6 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400">Start</button>
                    </div>
                );
            case 'review':
                return (
                    <div className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-cyan-300 mb-4">{phase.title}</h2>
                        <p className="text-gray-300 mb-4">{currentTip}</p>
                        <textarea
                            value={journalNotes}
                            onChange={(e) => onJournalNotesChange(e.target.value)}
                            placeholder="How did you feel? What did you see? Did you follow your plan?"
                            className="w-full h-40 p-2 text-white bg-gray-700 border border-gray-600 rounded-md"
                        />
                        <button onClick={onFinishReview} className="w-full mt-4 px-6 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400">Finish & Score</button>
                    </div>
                );
            case 'score':
                return (
                    <div className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl p-8 max-w-lg text-center">
                        <h2 className="text-2xl font-bold text-cyan-300 mb-4">{phase.title}</h2>
                        <p className="text-sm text-gray-400">Drill Score</p>
                        <p className="text-7xl font-bold text-green-400 mb-6">{score}</p>
                        <button onClick={onComplete} className="px-6 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400">Return to Hub</button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            {renderContent()}
        </div>
    );
};
