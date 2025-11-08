
import React from 'react';
import { AiCharacter } from '../types';

interface CharacterDialogueModalProps {
    beat: {
        character: AiCharacter;
        dialogue: string;
    };
    onClose: () => void;
}

export const CharacterDialogueModal: React.FC<CharacterDialogueModalProps> = ({ beat, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg text-center p-8 transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center">
                    <img 
                        src={beat.character.imageUrl} 
                        alt={beat.character.name} 
                        className="w-24 h-24 rounded-full border-4 border-gray-600 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-cyan-300 mb-2">{beat.character.name}</h2>
                    <p className="text-lg text-gray-200 italic mb-6">"{beat.dialogue}"</p>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
   