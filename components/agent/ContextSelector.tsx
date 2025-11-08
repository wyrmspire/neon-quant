import React from 'react';
import { CreationType } from '../../types';
import { AgentIcon, GamepadIcon, PlaybookIcon, CharacterIcon, StoreIcon, DojoIcon, ImageIcon, CampaignIcon } from '../Icons';
import { useData } from '../../context/DataContext';

interface ContextSelectorProps {
    selectedType: CreationType;
    onSelectType: (type: CreationType) => void;
    selectedCampaignId: string | null;
    onSelectCampaignId: (id: string | null) => void;
}

const creationOptions: { type: CreationType; label: string; icon: React.ReactNode }[] = [
    { type: 'chat', label: 'Chat', icon: <AgentIcon /> },
    { type: 'campaign', label: 'New Campaign', icon: <CampaignIcon /> },
    { type: 'storyNode', label: 'Story Node', icon: <CampaignIcon /> },
    { type: 'episode', label: 'Episode', icon: <GamepadIcon /> },
    { type: 'strategy', label: 'Strategy', icon: <PlaybookIcon /> },
    { type: 'character', label: 'Character', icon: <CharacterIcon /> },
    { type: 'item', label: 'Store Item', icon: <StoreIcon /> },
    { type: 'drill', label: 'Dojo Drill', icon: <DojoIcon /> },
    { type: 'visualAsset', label: 'Visual Asset', icon: <ImageIcon /> },
];

export const ContextSelector: React.FC<ContextSelectorProps> = ({ selectedType, onSelectType, selectedCampaignId, onSelectCampaignId }) => {
    const { campaigns } = useData();

    React.useEffect(() => {
        // Auto-select first campaign if switching to storyNode type
        if (selectedType === 'storyNode' && !selectedCampaignId && campaigns.length > 0) {
            onSelectCampaignId(campaigns[0].id);
        }
    }, [selectedType, selectedCampaignId, campaigns, onSelectCampaignId]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {creationOptions.map(({ type, label, icon }) => (
                <button
                    key={type}
                    onClick={() => onSelectType(type)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                        selectedType === type
                            ? 'bg-cyan-500 text-gray-900'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {icon}
                    <span>{label}</span>
                </button>
            ))}

            {selectedType === 'storyNode' && (
                 <select 
                    value={selectedCampaignId || ''}
                    onChange={(e) => onSelectCampaignId(e.target.value)}
                    className="px-3 py-2 text-sm font-semibold bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            )}
        </div>
    );
};