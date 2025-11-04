
import React, { useState, useEffect } from 'react';
// Fix: Corrected import paths for types and services.
import { GameScreen, Drill } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeftIcon, LoadingIcon } from './Icons';

interface DojoScreenProps {
    onNavigate: (screen: GameScreen) => void;
}

export const DojoScreen: React.FC<DojoScreenProps> = ({ onNavigate }) => {
    const [drills, setDrills] = useState<Drill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrills = async () => {
            setLoading(true);
            const data = await mockApi.getDrills();
            setDrills(data);
            setLoading(false);
        };
        fetchDrills();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Drills...</span></div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex items-start justify-between mb-8">
                <button onClick={() => onNavigate('hub')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    <ArrowLeftIcon />
                    Back to Hub
                </button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white text-center">Dojo</h1>
                    <p className="text-lg text-gray-400 mt-1 text-center">Sharpen your edge with targeted training exercises.</p>
                </div>
                <div className="w-32"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drills.map(drill => (
                    <div key={drill.id} className="bg-gray-800/50 p-6 rounded-lg border-2 border-gray-700 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">{drill.name}</h2>
                            <p className="text-gray-400 mb-4 h-20">{drill.description}</p>
                            <div className="text-sm bg-gray-900/50 p-3 rounded-md border border-gray-600">
                                <p className="font-semibold text-gray-300">Success Condition:</p>
                                <p className="text-cyan-300 font-mono">{drill.successCriteria.label}</p>
                            </div>
                        </div>
                        <button
                            // onClick={() => handleStartDrill(drill)} // Not implemented
                            disabled
                            className="w-full mt-4 py-2 font-semibold bg-cyan-500 text-gray-900 rounded-md hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Start Drill (WIP)
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
