import React, { useState } from 'react';
import { GameScreen, Episode, Session, CoachFeedback } from '../types';
import { HubView } from './HubView';
import { EpisodeSelectScreen } from './EpisodeSelectScreen';
import { TradingArena } from './trading/TradingArena';
import { MarketScreen } from './MarketScreen';
import { ContactsScreen } from './ContactsScreen';
import { DojoScreen } from './DojoScreen';
import { DebriefScreen } from './DebriefScreen';
import { StrategyPlaybookScreen } from './StrategyPlaybookScreen';
import { mockApi } from '../services/mockApi';
import { geminiService } from '../services/geminiService';
import { LoadingIcon } from './Icons';
import { useData } from '../context/DataContext';

interface GameViewProps {
    screen: GameScreen;
    setScreen: (screen: GameScreen) => void;
}

export const GameView: React.FC<GameViewProps> = ({ screen, setScreen }) => {
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [lastSession, setLastSession] = useState<Session | null>(null);
    const [lastFeedback, setLastFeedback] = useState<CoachFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { grantEpisodeReward } = useData();

    const handleEpisodeSelect = (episode: Episode) => {
        setSelectedEpisode(episode);
        setScreen('trading');
    };

    const handleEpisodeComplete = async (session: Session) => {
        if (!selectedEpisode) return;

        setIsLoading(true);
        setLastSession(session);
        
        try {
            // 1. Generate feedback from AI Coach
            const feedbackData = await geminiService.generateCoachFeedback(session, selectedEpisode);
            const savedFeedback = await mockApi.saveCoachFeedback(feedbackData);
            setLastFeedback(savedFeedback);
            
            // 2. Grant reward via context
            await grantEpisodeReward(selectedEpisode.reward);
        } catch (error) {
            console.error("Failed during episode completion:", error);
            // Handle error state if necessary
        } finally {
            // 3. Navigate to debrief
            setSelectedEpisode(null);
            setIsLoading(false);
            setScreen('debrief');
        }
    };

    const renderScreen = () => {
        if(isLoading) {
             return <div className="flex flex-col items-center justify-center h-full text-cyan-400"><LoadingIcon size={12} /> <span className="ml-4 text-xl">Generating AI Coach Debrief...</span></div>;
        }

        switch (screen) {
            case 'hub':
                return <HubView onNavigate={setScreen} />;
            case 'episodeSelect':
                return <EpisodeSelectScreen onSelect={handleEpisodeSelect} />;
            case 'strategybook':
                return <StrategyPlaybookScreen onNavigate={setScreen} />;
            case 'trading':
                if (selectedEpisode) {
                    return <TradingArena episode={selectedEpisode} onComplete={handleEpisodeComplete} />;
                }
                setScreen('hub'); // Fallback if no episode is selected
                return null;
            case 'market':
                return <MarketScreen onNavigate={setScreen} />;
            case 'contacts':
                return <ContactsScreen onNavigate={setScreen} />;
            case 'dojo':
                return <DojoScreen onNavigate={setScreen} />;
            case 'debrief':
                if(lastSession && lastFeedback) {
                     return <DebriefScreen session={lastSession} feedback={lastFeedback} onAcknowledge={() => setScreen('hub')} />;
                }
                 setScreen('hub'); // Fallback if debrief data is missing
                 return null;
            default:
                return <HubView onNavigate={setScreen} />;
        }
    };

    return <div className="h-full view-container">{renderScreen()}</div>;
};
