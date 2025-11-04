

import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import path for types.
import { AgentLog, Episode, Strategy, AiCharacter, Item, CreationType, Drill, VisualAsset } from '../types';
import { mockApi } from '../services/mockApi';
import { geminiService } from '../services/geminiService';
import { SendIcon, LoadingIcon, SystemIcon, UserIcon, AgentIcon as AgentAvatarIcon, ErrorIcon, ImageIcon } from './Icons';

export const AgentView: React.FC = () => {
    const [logs, setLogs] = useState<AgentLog[]>([
        { type: 'agent', message: "I am Neon Quant, your game design agent. Select a tool from the dropdown to create game assets, or choose 'General Chat' to discuss the project." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [creationType, setCreationType] = useState<CreationType>('chat');
    const [createdEpisodes, setCreatedEpisodes] = useState<Episode[]>([]);
    const [createdStrategies, setCreatedStrategies] = useState<Strategy[]>([]);
    const [createdCharacters, setCreatedCharacters] = useState<AiCharacter[]>([]);
    const [createdItems, setCreatedItems] = useState<Item[]>([]);
    const [createdDrills, setCreatedDrills] = useState<Drill[]>([]);
    const [createdVisualAssets, setCreatedVisualAssets] = useState<VisualAsset[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setCreatedEpisodes(await mockApi.getEpisodes());
            setCreatedStrategies(await mockApi.getStrategies());
            setCreatedCharacters(await mockApi.getCharacters());
            setCreatedItems(await mockApi.getStoreItems());
            setCreatedDrills(await mockApi.getDrills());
            setCreatedVisualAssets(await mockApi.getVisualAssets('avatar'));
        };
        fetchData();
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userLog: AgentLog = { type: 'user', message: input };
        const currentInput = input;
        setLogs(prev => [...prev, userLog]);
        setInput('');
        setIsLoading(true);

        try {
            switch (creationType) {
                case 'chat':
                    setLogs(prev => [...prev, { type: 'system', message: 'Thinking...' }]);
                    const chatHistory = logs.slice(-5); // Use last 5 logs for context
                    const chatResponse = await geminiService.generateChatResponse(currentInput, chatHistory);
                    setLogs(prev => [...prev.slice(0, -1), { type: 'agent', message: chatResponse }]);
                    break;

                case 'episode':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating scenario with Gemini...' }]);
                    const generatedData = await geminiService.generateScenario(currentInput);
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating cover image for scenario...' }]);
                    const imageUrl = await geminiService.generateImage(generatedData.title, '16:9');

                    const newEpisodeData = { ...generatedData, imageUrl };
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new scenario to mock database...' }]);
                    const newEpisode = await mockApi.createEpisode(newEpisodeData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new episode: "${newEpisode.title}".`, data: newEpisode }]);
                    setCreatedEpisodes(prev => [...prev, newEpisode]);
                    break;

                case 'strategy':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating trading strategy with Gemini...' }]);
                    const generatedStrategyData = await geminiService.generateStrategy(currentInput);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new strategy to mock database...' }]);
                    const newStrategy = await mockApi.createStrategy(generatedStrategyData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new strategy: "${newStrategy.name}".`, data: newStrategy }]);
                    setCreatedStrategies(prev => [...prev, newStrategy]);
                    break;
                
                case 'character':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating character profile with Gemini...' }]);
                    const { imagePrompt, ...generatedCharData } = await geminiService.generateCharacter(currentInput);

                    setLogs(prev => [...prev, { type: 'system', message: `Generating portrait based on prompt: "${imagePrompt}"...` }]);
                    const charImageUrl = await geminiService.generateImage(imagePrompt, '1:1');
                    
                    const newCharacterData = { ...generatedCharData, imageUrl: charImageUrl };
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new character to mock database...' }]);
                    const newCharacter = await mockApi.createCharacter(newCharacterData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new character: "${newCharacter.name}".`, data: newCharacter }]);
                    setCreatedCharacters(prev => [...prev, newCharacter]);
                    break;

                case 'item':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating game item with Gemini...' }]);
                    const generatedItemData = await geminiService.generateItem(currentInput);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new item to mock database...' }]);
                    const newItem = await mockApi.createItem(generatedItemData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new item: "${newItem.name}".`, data: newItem }]);
                    setCreatedItems(prev => [...prev, newItem]);
                    break;
                
                case 'drill':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating training drill with Gemini...' }]);
                    const generatedDrillData = await geminiService.generateDrill(currentInput);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new drill to mock database...' }]);
                    const newDrill = await mockApi.createDrill(generatedDrillData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new drill: "${newDrill.name}".`, data: newDrill }]);
                    setCreatedDrills(prev => [...prev, newDrill]);
                    break;
                
                case 'visualAsset':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating visual asset details with Gemini...' }]);
                    const { name, imagePrompt: assetImagePrompt } = await geminiService.generateVisualAssetDetails(currentInput);
                    
                    setLogs(prev => [...prev, { type: 'system', message: `Generating image for "${name}"...` }]);
                    const assetImageUrl = await geminiService.generateImage(assetImagePrompt, '1:1');
                    
                    const newAssetData: Omit<VisualAsset, 'id'> = { type: 'avatar', name, prompt: currentInput, dataUrl: assetImageUrl };

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving visual asset to mock database...' }]);
                    const newAsset = await mockApi.createVisualAsset(newAssetData);
                    
                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new visual asset: "${newAsset.name}".`, data: newAsset }]);
                    setCreatedVisualAssets(prev => [...prev, newAsset]);
                    break;

            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setLogs(prev => [...prev, { type: 'error', message: `Failed to create content. ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const LogItem: React.FC<{ log: AgentLog }> = ({ log }) => {
        const icons = {
            user: <UserIcon />,
            agent: <AgentAvatarIcon />,
            system: <SystemIcon />,
            error: <ErrorIcon />,
        };
        const colors = {
            user: 'bg-gray-700',
            agent: 'bg-gray-800',
            system: 'bg-gray-800 border-l-2 border-cyan-400',
            error: 'bg-red-900/50 border-l-2 border-red-500',
        }

        return (
            <div className={`p-4 rounded-lg flex gap-4 ${colors[log.type]}`}>
                <div className="flex-shrink-0 w-6 h-6 text-cyan-400">{icons[log.type]}</div>
                <div>
                    <p className="text-gray-200 whitespace-pre-wrap">{log.message}</p>
                    {log.data && (log.type === 'agent') && (
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-md border border-gray-600">
                           <h4 className="font-semibold text-cyan-300">Generated Content Details:</h4>
                           {log.data.dataUrl && <img src={log.data.dataUrl} className="w-24 h-24 object-cover rounded-md my-2" />}
                           <pre className="text-xs text-gray-400 whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-full max-h-[calc(100vh-65px)]">
            <div className="md:col-span-2 flex flex-col h-full bg-gray-900">
                <div className="p-4 border-b border-gray-700 bg-gray-800/20">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-400">Agent Tool:</span>
                        <select 
                            value={creationType} 
                            onChange={(e) => setCreationType(e.target.value as CreationType)}
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
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {logs.map((log, index) => <LogItem key={index} log={log} />)}
                         <div ref={logsEndRef} />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={
                                {
                                    chat: "Ask me anything about the game's architecture...",
                                    episode: "e.g., A scenario about surviving a market flash crash",
                                    strategy: "e.g., A simple scalping strategy for a ranging market",
                                    character: "e.g., A grizzled ex-floor trader who acts as a mentor",
                                    item: "e.g., A cosmetic item like a retro CRT monitor for the desk",
                                    drill: "e.g., A drill to practice patience and not chasing price",
                                    visualAsset: "e.g., A punk trader with pink hair and a dataglove",
                                }[creationType]
                            }
                            className="w-full py-3 pl-4 pr-12 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-cyan-400 disabled:text-gray-600">
                            {isLoading ? <LoadingIcon /> : <SendIcon />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="md:col-span-1 h-full bg-gray-800/50 border-l border-gray-700 overflow-y-auto p-4 space-y-4">
                 <div>
                    <h2 className="text-lg font-bold text-white mb-3">Available Episodes</h2>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {createdEpisodes.map(ep => (
                            <div key={ep.id} className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold text-cyan-300">{ep.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{ep.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-3">Visual Asset Library</h2>
                     <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2">
                        {createdVisualAssets.map(asset => (
                            <div key={asset.id} className="relative group">
                                <img src={asset.dataUrl} alt={asset.name} className="w-full aspect-square object-cover rounded-md"/>
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                    <p className="text-white text-xs font-bold leading-tight">{asset.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-3">Created Strategies</h2>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {createdStrategies.map(strat => (
                            <div key={strat.id} className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold text-purple-300">{strat.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-bold text-white mb-3">Game Characters</h2>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {createdCharacters.map(char => (
                            <div key={char.id} className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold text-green-300">{char.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-bold text-white mb-3">Practice Drills</h2>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {createdDrills.map(drill => (
                            <div key={drill.id} className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold text-orange-300">{drill.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-bold text-white mb-3">Market Items</h2>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {createdItems.map(item => (
                             <div key={item.id} className="p-3 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold text-yellow-300">{item.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};