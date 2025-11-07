import React, { useState, useRef, useEffect } from 'react';
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
    
    // State for AI context (RAG)
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

        setIsLoading(true);
        const userLog: AgentLog = { type: 'user', message: input };
        
        // Use functional update to get the latest state for the history
        setLogs(prev => [...prev, userLog]);

        try {
            // Refresh context for RAG
            const themes = await mockApi.getThemes();
            const lessons = await mockApi.getAgentLessons();
            setAvailableThemes(themes);
            setAgentLessons(lessons);

            // This async function performs the core logic and returns the final agent log
            const createContent = async (): Promise<AgentLog> => {
                // The `logs` variable from the closure is used for providing history to Gemini
                switch (creationType) {
                    case 'chat': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Thinking...' }]);
                        const chatResponse = await geminiService.generateChatResponse(input, logs);
                        return { type: 'agent', message: chatResponse };
                    }
                    case 'episode': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating scenario...' }]);
                        const generatedData = await geminiService.generateScenario(input, themes, lessons);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Generating cover image...' }]);
                        const imageUrl = await geminiService.generateImage(generatedData.title, '16:9');
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newEpisode = await mockApi.createEpisode({ ...generatedData, imageUrl });
                        addCreatedItem(newEpisode, 'episode');
                        return { type: 'agent', message: `Created episode: "${newEpisode.title}".`, data: newEpisode };
                    }
                    case 'strategy': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating strategy...' }]);
                        const data = await geminiService.generateStrategy(input, themes, lessons);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newStrategy = await mockApi.createStrategy(data);
                        addCreatedItem(newStrategy, 'strategy');
                        return { type: 'agent', message: `Created strategy: "${newStrategy.name}".`, data: newStrategy };
                    }
                    case 'character': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating character...' }]);
                        const { imagePrompt, ...charData } = await geminiService.generateCharacter(input, themes, lessons);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Generating portrait...' }]);
                        const imageUrl = await geminiService.generateImage(imagePrompt, '1:1');
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newCharacter = await mockApi.createCharacter({ ...charData, imageUrl });
                        addCreatedItem(newCharacter, 'character');
                        return { type: 'agent', message: `Created character: "${newCharacter.name}".`, data: newCharacter };
                    }
                    case 'item': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating item...' }]);
                        const data = await geminiService.generateItem(input, themes, lessons);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newItem = await mockApi.createItem(data);
                        addCreatedItem(newItem, 'item');
                        return { type: 'agent', message: `Created item: "${newItem.name}".`, data: newItem };
                    }
                    case 'drill': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating drill...' }]);
                        const data = await geminiService.generateDrill(input, themes, lessons);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newDrill = await mockApi.createDrill(data);
                        addCreatedItem(newDrill, 'drill');
                        return { type: 'agent', message: `Created drill: "${newDrill.name}".`, data: newDrill };
                    }
                    case 'visualAsset': {
                        setLogs(prev => [...prev, { type: 'system', message: 'Generating asset details...' }]);
                        const { name, imagePrompt } = await geminiService.generateVisualAssetDetails(input);
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: `Generating image for "${name}"...` }]);
                        const imageUrl = await geminiService.generateImage(imagePrompt, '1:1');
                        const newAssetData: Omit<VisualAsset, 'id'> = { type: 'avatar', name, prompt: input, dataUrl: imageUrl };
                        setLogs(prev => [...prev.slice(0, -1), { type: 'system', message: 'Saving to database...' }]);
                        const newAsset = await mockApi.createVisualAsset(newAssetData);
                        addCreatedItem(newAsset, 'visualAsset');
                        return { type: 'agent', message: `Created asset: "${newAsset.name}".`, data: newAsset };
                    }
                }
            };
            
            const finalLog = await createContent();

            // Replace the final system log with the actual agent response
            setLogs(prev => [...prev.slice(0, -1), finalLog]);

        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            // On error, replace the last log (system or user) with a descriptive error message
            setLogs(prev => [...prev.slice(0, -1), { type: 'error', message: `Failed to create content. ${errorMessage}` }]);
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