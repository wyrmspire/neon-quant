import React, { useState, useRef, useEffect } from 'react';
// Fix: Import VisualAsset to use for type annotation.
import { AgentLog, CreationType, Theme, AgentLesson, VisualAsset } from '../../types';
import { mockApi } from '../../services/mockApi';
import { geminiService } from '../../services/geminiService';
import { useData } from '../../context/DataContext';
import { AgentLogPanel } from './AgentLogPanel';
import { AgentInput } from './AgentInput';
import { AssetLibraryPanel } from './AssetLibraryPanel';

export const AgentView: React.FC = () => {
    // =================================================================
    // STATE MANAGEMENT
    // =================================================================
    const [logs, setLogs] = useState<AgentLog[]>([
        { type: 'agent', message: "I am Neon Quant, your game design agent. Select a tool from the dropdown to create game assets, or choose 'General Chat' to discuss the project." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [creationType, setCreationType] = useState<CreationType>('chat');
    
    // State for AI context (RAG) - fetched fresh before each call but stored here for display/debug
    const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
    const [agentLessons, setAgentLessons] = useState<AgentLesson[]>([]);

    const { addCreatedItem } = useData();
    const logsEndRef = useRef<HTMLDivElement>(null);

    // =================================================================
    // EFFECTS
    // =================================================================
    useEffect(() => {
        // Automatically scroll to the latest log message
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // =================================================================
    // MAIN HANDLER LOGIC
    // =================================================================
    const handleSend = async (input: string) => {
        if (!input.trim() || isLoading) return;

        const userLog: AgentLog = { type: 'user', message: input };
        setLogs(prev => [...prev, userLog]);
        setIsLoading(true);

        try {
            // Refresh knowledge base before each generation for the most up-to-date context
            const themes = await mockApi.getThemes();
            const lessons = await mockApi.getAgentLessons();
            setAvailableThemes(themes);
            setAgentLessons(lessons);

            // The main switch for handling different creation types
            switch (creationType) {
                case 'chat':
                    setLogs(prev => [...prev, { type: 'system', message: 'Thinking...' }]);
                    const chatHistory = logs.slice(-5); // Use last 5 logs for context
                    const chatResponse = await geminiService.generateChatResponse(input, chatHistory);
                    setLogs(prev => [...prev.slice(0, -1), { type: 'agent', message: chatResponse }]);
                    break;

                case 'episode':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating scenario with Gemini...' }]);
                    const generatedData = await geminiService.generateScenario(input, themes, lessons);
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating cover image for scenario...' }]);
                    const imageUrl = await geminiService.generateImage(generatedData.title, '16:9');

                    const newEpisodeData = { ...generatedData, imageUrl };
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new scenario to mock database...' }]);
                    const newEpisode = await mockApi.createEpisode(newEpisodeData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new episode: "${newEpisode.title}".`, data: newEpisode }]);
                    addCreatedItem(newEpisode, 'episode');
                    break;

                case 'strategy':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating trading strategy with Gemini...' }]);
                    const generatedStrategyData = await geminiService.generateStrategy(input, themes, lessons);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new strategy to mock database...' }]);
                    const newStrategy = await mockApi.createStrategy(generatedStrategyData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new strategy: "${newStrategy.name}".`, data: newStrategy }]);
                    addCreatedItem(newStrategy, 'strategy');
                    break;
                
                case 'character':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating character profile with Gemini...' }]);
                    const { imagePrompt, ...generatedCharData } = await geminiService.generateCharacter(input, themes, lessons);

                    setLogs(prev => [...prev, { type: 'system', message: `Generating portrait based on prompt: "${imagePrompt}"...` }]);
                    const charImageUrl = await geminiService.generateImage(imagePrompt, '1:1');
                    
                    const newCharacterData = { ...generatedCharData, imageUrl: charImageUrl };
                    
                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new character to mock database...' }]);
                    const newCharacter = await mockApi.createCharacter(newCharacterData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new character: "${newCharacter.name}".`, data: newCharacter }]);
                    addCreatedItem(newCharacter, 'character');
                    break;

                case 'item':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating game item with Gemini...' }]);
                    const generatedItemData = await geminiService.generateItem(input, themes, lessons);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new item to mock database...' }]);
                    const newItem = await mockApi.createItem(generatedItemData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new item: "${newItem.name}".`, data: newItem }]);
                    addCreatedItem(newItem, 'item');
                    break;
                
                case 'drill':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating training drill with Gemini...' }]);
                    const generatedDrillData = await geminiService.generateDrill(input, themes, lessons);

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving new drill to mock database...' }]);
                    const newDrill = await mockApi.createDrill(generatedDrillData);

                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new drill: "${newDrill.name}".`, data: newDrill }]);
                    addCreatedItem(newDrill, 'drill');
                    break;
                
                case 'visualAsset':
                    setLogs(prev => [...prev, { type: 'system', message: 'Generating visual asset details with Gemini...' }]);
                    const { name, imagePrompt: assetImagePrompt } = await geminiService.generateVisualAssetDetails(input);
                    
                    setLogs(prev => [...prev, { type: 'system', message: `Generating image for "${name}"...` }]);
                    const assetImageUrl = await geminiService.generateImage(assetImagePrompt, '1:1');
                    
                    // Fix: Explicitly type newAssetData to ensure 'type' is not inferred as a generic string.
                    const newAssetData: Omit<VisualAsset, 'id'> = { type: 'avatar', name, prompt: input, dataUrl: assetImageUrl };

                    setLogs(prev => [...prev, { type: 'system', message: 'Saving visual asset to mock database...' }]);
                    const newAsset = await mockApi.createVisualAsset(newAssetData);
                    
                    setLogs(prev => [...prev, { type: 'agent', message: `I've created a new visual asset: "${newAsset.name}".`, data: newAsset }]);
                    addCreatedItem(newAsset, 'visualAsset');
                    break;
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setLogs(prev => [...prev.filter(l => l.type !== 'system'), { type: 'error', message: `Failed to create content. ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // =================================================================
    // MAIN RENDER
    // =================================================================
    return (
        <div className="view-container grid grid-cols-1 md:grid-cols-3 h-full max-h-[calc(100vh-65px)]">
            {/* Left Pane: Chat and Input */}
            <div className="md:col-span-2 flex flex-col h-full bg-gray-900">
                <AgentLogPanel 
                    logs={logs} 
                    logsEndRef={logsEndRef} 
                    availableThemes={availableThemes}
                />
                <AgentInput 
                    onSend={handleSend}
                    isLoading={isLoading}
                    creationType={creationType}
                    onCreationTypeChange={setCreationType}
                />
            </div>
            {/* Right Pane: Asset Libraries */}
            <AssetLibraryPanel />
        </div>
    );
};
