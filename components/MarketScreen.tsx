import React, { useState, useEffect } from 'react';
import { GameScreen, Item, Profile } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeftIcon, LoadingIcon, CheckCircleIcon } from './Icons';

interface MarketScreenProps {
    onNavigate: (screen: GameScreen) => void;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({ onNavigate }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const itemsData = await mockApi.getStoreItems();
        const profileData = await mockApi.getProfile();
        setItems(itemsData);
        setProfile(profileData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handlePurchase = async (itemId: string) => {
        const { profile: updatedProfile } = await mockApi.purchaseItem(itemId);
        setProfile(updatedProfile);
    };

    if (loading || !profile) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Market...</span></div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <button onClick={() => onNavigate('hub')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    <ArrowLeftIcon />
                    Back to Hub
                </button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Market</h1>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Your Cred</p>
                    <p className="text-2xl font-bold text-green-400">{profile.cred.toLocaleString()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => {
                    const canAfford = profile.cred >= item.price;
                    const isOwned = profile.inventory.includes(item.id);
                    return (
                        <div key={item.id} className={`bg-gray-800/50 rounded-lg p-5 flex flex-col justify-between border-2 ${isOwned ? 'border-green-500/50' : 'border-gray-700'}`}>
                            <div>
                                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                                <p className="text-gray-400 mt-1 mb-4 h-16">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-semibold text-cyan-300">{item.price} Cred</p>
                                {isOwned ? (
                                    <span className="flex items-center gap-2 px-4 py-2 font-semibold text-green-300 bg-green-500/10 rounded-md">
                                        <CheckCircleIcon /> Owned
                                    </span>
                                ) : (
                                     <button
                                        onClick={() => handlePurchase(item.id)}
                                        disabled={!canAfford}
                                        className="px-4 py-2 font-semibold bg-cyan-500 text-gray-900 rounded-md hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Buy
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
