import React, { useState, useEffect } from 'react';
import { GameScreen, AiCharacter } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeftIcon, LoadingIcon } from './Icons';

interface ContactsScreenProps {
    onNavigate: (screen: GameScreen) => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ onNavigate }) => {
    const [characters, setCharacters] = useState<AiCharacter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            const data = await mockApi.getCharacters();
            setCharacters(data);
            setLoading(false);
        };
        fetchCharacters();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Contacts...</span></div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex items-start justify-between mb-8">
                <button onClick={() => onNavigate('hub')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    <ArrowLeftIcon />
                    Back to Hub
                </button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white text-center">Contacts</h1>
                     <p className="text-lg text-gray-400 mt-1 text-center">Your network of allies, rivals, and informants.</p>
                </div>
                <div className="w-32"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {characters.map(char => (
                    <div key={char.id} className="bg-gray-800/50 p-6 rounded-lg border-2 border-gray-700 flex flex-col items-center text-center">
                        <img 
                            src={char.imageUrl} 
                            alt={char.name}
                            className="w-32 h-32 rounded-full border-4 border-gray-600 mb-4"
                        />
                        <h2 className="text-2xl font-bold text-white">{char.name}</h2>
                        <h3 className="text-sm font-semibold text-cyan-300 mb-3">{char.personality.split(',')[0]}</h3>
                        <p className="text-gray-400">{char.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
