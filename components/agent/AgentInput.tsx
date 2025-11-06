import React, { useState } from 'react';
import { CreationType } from '../../types';
import { SendIcon, LoadingIcon } from '../Icons';

interface AgentInputProps {
    onSend: (input: string) => void;
    isLoading: boolean;
    creationType: CreationType;
    onCreationTypeChange: (type: CreationType) => void;
}

export const AgentInput: React.FC<AgentInputProps> = ({ onSend, isLoading, creationType, onCreationTypeChange }) => {
    const [input, setInput] = useState('');

    const handleSendClick = () => {
        onSend(input);
        setInput('');
    };

    const placeholders: Record<CreationType, string> = {
        chat: "Ask me anything about the game's architecture...",
        episode: "e.g., A scenario about surviving a market flash crash",
        strategy: "e.g., A simple scalping strategy for a ranging market",
        character: "e.g., A grizzled ex-floor trader who acts as a mentor",
        item: "e.g., A cosmetic item like a retro CRT monitor for the desk",
        drill: "e.g., A drill to practice patience and not chasing price",
        visualAsset: "e.g., A punk trader with pink hair and a dataglove",
    };

    return (
        <>
            <div className="p-4 border-t border-b border-gray-700 bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <label htmlFor="agent-tool-select" className="text-sm font-semibold text-gray-400">Agent Tool:</label>
                    <select
                        id="agent-tool-select"
                        value={creationType}
                        onChange={(e) => onCreationTypeChange(e.target.value as CreationType)}
                        className="px-4 py-2 text-sm font-medium bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="chat">General Chat</option>
                        <option value="episode">Create Episode</option>
                        <option value="strategy">Create Strategy</option>
                        <option value="character">Create Character</option>
                        <option value="item">Create Item</option>
                        <option value="drill">Create Drill</option>
                        <option value="visualAsset">Create Visual Asset</option>
                    </select>
                </div>
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                        placeholder={placeholders[creationType]}
                        className="w-full py-3 pl-4 pr-12 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendClick} disabled={isLoading || !input.trim()} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-cyan-400 disabled:text-gray-600">
                        {isLoading ? <LoadingIcon /> : <SendIcon />}
                    </button>
                </div>
            </div>
        </>
    );
};
