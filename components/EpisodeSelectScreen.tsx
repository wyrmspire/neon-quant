
import React, { useState, useEffect } from 'react';
import { Episode } from '../types';
import { mockApi } from '../services/mockApi';
import { LoadingIcon } from './Icons';

interface EpisodeSelectScreenProps {
    onSelect: (episode: Episode) => void;
}

const RegimeTag: React.FC<{ regime: Episode['regime'] }> = ({ regime }) => {
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

export const EpisodeSelectScreen: React.FC<EpisodeSelectScreenProps> = ({ onSelect }) => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            const data = await mockApi.getEpisodes();
            setEpisodes(data);
            setLoading(false);
        };
        fetchEpisodes();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Episodes...</span></div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Select Episode</h1>
            <p className="text-lg text-gray-400 mb-8">Choose your challenge. Each episode tests a different skill set under unique market conditions.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodes.map(episode => (
                    <div
                        key={episode.id}
                        onClick={() => onSelect(episode)}
                        className="group bg-gray-800 rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-400/20"
                    >
                        <div className="h-48 w-full overflow-hidden">
                          <img src={episode.imageUrl} alt={episode.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-white">{episode.title}</h2>
                                <RegimeTag regime={episode.regime} />
                            </div>
                            <p className="text-gray-400 mb-4 h-16">{episode.description}</p>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-2">Objectives:</h3>
                                <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                                    {episode.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
   