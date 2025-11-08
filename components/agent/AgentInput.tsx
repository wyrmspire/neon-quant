import React, { useState } from 'react';
import { CreationType, Campaign } from '../../types';
import { LoadingIcon, SendIcon } from '../Icons';
import { ContextSelector } from './ContextSelector';
import { useData } from '../../context/DataContext';

interface AgentInputProps {
    onSend: (prompt: string, creationType: CreationType, context?: { campaign?: Campaign }) => void;
    isProcessing: boolean;
}

export const AgentInput: React.FC<AgentInputProps> = ({ onSend, isProcessing }) => {
    const [prompt, setPrompt] = useState('');
    const [creationType, setCreationType] = useState<CreationType>('chat');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const { campaigns } = useData();

    const handleSend = () => {
        if (prompt.trim() && !isProcessing) {
            const context = {
                campaign: campaigns.find(c => c.id === selectedCampaignId)
            };
            onSend(prompt, creationType, context);
            setPrompt('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex flex-col gap-2">
                <ContextSelector 
                    selectedType={creationType} 
                    onSelectType={setCreationType}
                    selectedCampaignId={selectedCampaignId}
                    onSelectCampaignId={setSelectedCampaignId}
                />
                <div className="flex items-start gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            creationType === 'chat' 
                                ? 'Ask me about the project or tell me what to do...' 
                                : `Describe the ${creationType} you want to create...`
                        }
                        className="flex-1 p-3 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        rows={2}
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !prompt.trim()}
                        className="h-[52px] w-[52px] flex items-center justify-center bg-cyan-500 text-gray-900 rounded-lg transition-colors hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        {isProcessing ? <LoadingIcon size={6} /> : <SendIcon size={6} />}
                    </button>
                </div>
            </div>
        </div>
    );
};