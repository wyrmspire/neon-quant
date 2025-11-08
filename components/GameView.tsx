import React, { useState } from 'react';
import { GameScreen, Episode, Session, Drill } from '../types';
import { HubView } from './HubView';
import { EpisodeSelectScreen } from './EpisodeSelectScreen';
import { TradingArena } from './trading/TradingArena';
import { MarketScreen } from './MarketScreen';
import { ContactsScreen } from './ContactsScreen';
import { DojoScreen } from './DojoScreen';
import { DebriefScreen } from './DebriefScreen';
import { StrategyPlaybookScreen } from './StrategyPlaybookScreen';
import { useData } from '../context/DataContext';

interface GameViewProps {
    screen: GameScreen;
    setScreen: (screen: GameScreen) => void;
}

export const GameView: React.FC<GameViewProps> = ({ screen, setScreen }) => {
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
    const [debriefData, setDebriefData] = useState<{ session: Session; episode: Episode } | null>(null);
    const { grantEpisodeReward } = useData();

    const handleEpisodeSelect = (episode: Episode) => {
        setSelectedEpisode(episode);
        setSelectedDrill(null); // Ensure no drill is selected
        setScreen('trading');
    };
    
    const handleDrillSelect = (drill: Drill) => {
        setSelectedDrill(drill);
        setSelectedEpisode(null); // Ensure no episode is selected
        setScreen('trading');
    }

    const handleSessionComplete = async (session: Session) => {
        // Only grant rewards for episodes, not drills
        if (selectedEpisode) {
            await grantEpisodeReward(selectedEpisode.reward);
            setDebriefData({ session, episode: selectedEpisode });
            setScreen('debrief');
        } else {
            // For drills, just go back to the hub or dojo screen
            setScreen('dojo');
        }
        
        // Clear selections for the next run
        setSelectedEpisode(null);
        setSelectedDrill(null);
    };

    const handleAcknowledgeDebrief = () => {
        setDebriefData(null);
        setScreen('hub');
    };

    const renderScreen = () => {
        switch (screen) {
            case 'hub':
                return <HubView onNavigate={setScreen} />;
            case 'episodeSelect':
                return <EpisodeSelectScreen onSelect={handleEpisodeSelect} />;
            case 'strategybook':
                return <StrategyPlaybookScreen onNavigate={setScreen} />;
            case 'trading':
                if (selectedEpisode) {
                    return <TradingArena episode={selectedEpisode} onComplete={handleSessionComplete} />;
                }
                if (selectedDrill) {
                    return <TradingArena drill={selectedDrill} onComplete={handleSessionComplete} />;
                }
                setScreen('hub'); // Fallback if nothing is selected
                return null;
            case 'market':
                return <MarketScreen onNavigate={setScreen} />;
            case 'contacts':
                return <ContactsScreen onNavigate={setScreen} />;
            case 'dojo':
                return <DojoScreen onNavigate={setScreen} onSelectDrill={handleDrillSelect} />;
            case 'debrief':
                if (debriefData) {
                     return <DebriefScreen session={debriefData.session} episode={debriefData.episode} onAcknowledge={handleAcknowledgeDebrief} />;
                }
                 setScreen('hub'); // Fallback if debrief data is missing
                 return null;
            default:
                return <HubView onNavigate={setScreen} />;
        }
    };

    return <div className="h-full view-container">{renderScreen()}</div>;
};