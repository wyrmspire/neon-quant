import React, { useState } from 'react';
import { EpisodeSelectScreen } from './EpisodeSelectScreen';
import { TradingArena } from './TradingArena';
import { HubView } from './HubView';
import { MarketScreen } from './MarketScreen';
import { ContactsScreen } from './ContactsScreen';
import { GameScreen, Episode } from '../types';

export const GameView: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<GameScreen>('hub');
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

    const handleEpisodeSelect = (episode: Episode) => {
        setSelectedEpisode(episode);
        setCurrentScreen('trading');
    };
    
    const handleExitEpisode = (reward?: number) => {
        setSelectedEpisode(null);
        setCurrentScreen('hub'); // Return to Hub after an episode
    };

    const navigateTo = (screen: GameScreen) => {
        setCurrentScreen(screen);
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case 'hub':
                return <HubView onNavigate={navigateTo} />;
            case 'market':
                return <MarketScreen onNavigate={navigateTo} />;
            case 'contacts':
                return <ContactsScreen onNavigate={navigateTo} />;
            case 'episodeSelect':
                return <EpisodeSelectScreen onSelect={handleEpisodeSelect} />;
            case 'trading':
                return selectedEpisode ? <TradingArena episode={selectedEpisode} onExit={handleExitEpisode} /> : <HubView onNavigate={navigateTo} />;
            case 'debrief':
                // Debrief screen component would go here
                return <div>Debrief Screen</div>;
            default:
                return <HubView onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="h-full bg-gray-900 text-white">
            {renderScreen()}
        </div>
    );
};