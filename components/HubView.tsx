import React, { useState, useEffect } from 'react';
import { GameScreen, Profile } from '../types';
import { mockApi } from '../services/mockApi';
import { LoadingIcon, StoreIcon, ContactsIcon, GamepadIcon } from './Icons';

interface HubViewProps {
    onNavigate: (screen: GameScreen) => void;
}

const NavCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-gray-800/50 p-6 rounded-lg border-2 border-gray-700 hover:border-cyan-400 transition-all duration-300 cursor-pointer flex items-center gap-6"
    >
        <div className="p-4 bg-gray-700/50 rounded-lg text-cyan-400 group-hover:bg-cyan-400/20">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);

export const HubView: React.FC<HubViewProps> = ({ onNavigate }) => {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await mockApi.getProfile();
            setProfile(data);
        };
        fetchProfile();
    }, []);

    if (!profile) {
        return <div className="flex items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Loading Profile...</span></div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Welcome, {profile.handle}</h1>
                    <p className="text-lg text-gray-400">The Neon City awaits. What's your next move?</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Cred Balance</p>
                    <p className="text-3xl font-bold text-green-400">{profile.cred.toLocaleString()}</p>
                </div>
            </header>

            <main className="grid grid-cols-1 gap-6">
                <NavCard 
                    title="Start Episode"
                    description="Face a new challenge in the market arena."
                    icon={<GamepadIcon size={8} />}
                    onClick={() => onNavigate('episodeSelect')}
                />
                <NavCard 
                    title="Visit Market"
                    description="Spend your Cred on new tools and cosmetics."
                    icon={<StoreIcon size={8} />}
                    onClick={() => onNavigate('market')}
                />
                <NavCard 
                    title="View Contacts"
                    description="Check in with your network of mentors and rivals."
                    icon={<ContactsIcon size={8} />}
                    onClick={() => onNavigate('contacts')}
                />
            </main>
        </div>
    );
};
