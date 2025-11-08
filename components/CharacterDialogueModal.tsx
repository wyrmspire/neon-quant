import React, { useEffect, useState } from 'react';
import { AiCharacter } from '../types';

interface CharacterDialogueModalProps {
    character: AiCharacter;
    message: string;
    onClose: () => void;
}

export const CharacterDialogueModal: React.FC<CharacterDialogueModalProps> = ({ character, message, onClose }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');

    useEffect(() => {
        // Typewriter effect for the message
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedMessage(prev => prev + message[index]);
            index++;
            if (index === message.length) {
                clearInterval(intervalId);
            }
        }, 30); // Adjust speed of typing here

        return () => clearInterval(intervalId);
    }, [message]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-slide-up">
            <div className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl shadow-2xl w-full max-w-2xl flex items-start gap-4 p-6">
                <img 
                    src={character.imageUrl} 
                    alt={character.name} 
                    className="w-20 h-20 rounded-full border-4 border-gray-600 flex-shrink-0"
                />
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-cyan-300">{character.name} says:</h2>
                    <p className="text-lg text-gray-200 min-h-[56px]">
                        "{displayedMessage}"
                        <span className="animate-ping">_</span>
                    </p>
                </div>
                 <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none flex-shrink-0">&times;</button>
            </div>
            <style>{`
                @keyframes slide-up { 
                    from { opacity: 0; transform: translateY(50px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                
                @keyframes ping {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-ping { animation: ping 1s step-end infinite; }
            `}</style>
        </div>
    );
};
