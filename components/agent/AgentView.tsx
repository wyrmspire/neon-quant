import React, { useState, useRef, useEffect } from 'react';
import { AgentInput } from './AgentInput';
import { AgentLogPanel } from './AgentLogPanel';
import { AssetLibraryPanel } from './AssetLibraryPanel';
import { AgentLog, CreationType, Campaign } from '../../types';
import { agentOrchestrator } from '../../services/agentOrchestrator';
import { useData } from '../../context/DataContext';

export const AgentView: React.FC = () => {
    const [logs, setLogs] = useState<AgentLog[]>([
        {
            type: 'system',
            message: 'Agent online. Use the input below to chat or create game content.',
        },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const { themes, agentLessons, addCreatedItem, updateCampaign } = useData();

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [logs]);

    const handleSend = async (prompt: string, creationType: CreationType, context?: { campaign?: Campaign }) => {
        const userLog: AgentLog = { type: 'user', message: prompt };
        setLogs(prev => [...prev, userLog]);
        setIsProcessing(true);

        const logCallback = (log: AgentLog) => {
            setLogs(prev => [...prev, log]);
        };

        try {
            await agentOrchestrator.handlePrompt({
                prompt,
                creationType,
                context,
                themes,
                agentLessons,
                addCreatedItem,
                updateCampaign,
                history: creationType === 'chat' ? logs : [],
                logCallback
            });
        } catch (error) {
            const errorLog: AgentLog = {
                type: 'error',
                message: error instanceof Error ? error.message : 'An unknown error occurred.',
            };
            setLogs(prev => [...prev, errorLog]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="view-container flex h-full max-h-[calc(100vh-65px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 flex-1 h-full">
                <main className="md:col-span-3 flex flex-col h-full bg-gray-900/50">
                    <AgentLogPanel logs={logs} logsEndRef={logsEndRef} availableThemes={themes} />
                    <AgentInput onSend={handleSend} isProcessing={isProcessing} />
                </main>
                <AssetLibraryPanel />
            </div>
        </div>
    );
};