import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Campaign, CampaignNode } from '../types';
import { LoadingIcon } from './Icons';
import { StoryGraph } from './campaign/StoryGraph';
import { NodeDetailPanel } from './campaign/NodeDetailPanel';
import { agentOrchestrator } from '../services/agentOrchestrator';
import { mockApi } from '../services/mockApi';

export const CampaignView: React.FC = () => {
    const { campaigns, isLoading, addCreatedItem, updateCampaign } = useData();
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedNode, setSelectedNode] = useState<CampaignNode | null>(null);
    const [isAgentWorking, setIsAgentWorking] = useState(false);

    React.useEffect(() => {
        if (!selectedCampaign && campaigns.length > 0) {
            setSelectedCampaign(campaigns[0]);
        }
    }, [campaigns, selectedCampaign]);
    
    const handleNewCampaign = async () => {
        const prompt = window.prompt("Enter a brief description for your new campaign:", "A rookie trader uncovers a corporate conspiracy.");
        if (prompt) {
            setIsAgentWorking(true);
            try {
                // We call the orchestrator directly for this UI-specific action
                await agentOrchestrator.createCampaign(prompt, addCreatedItem);
            } catch (error) {
                console.error("Failed to create campaign:", error);
                alert("Sorry, the agent failed to create a new campaign.");
            } finally {
                setIsAgentWorking(false);
            }
        }
    };

    const handleAddNode = async () => {
        if (!selectedCampaign) return;
        const prompt = window.prompt("Describe the new story node you want to add:", "The player gets a cryptic tip from Silas.");
        if (prompt) {
            setIsAgentWorking(true);
            try {
                const updatedCampaign = await agentOrchestrator.addStoryNodeToCampaign(prompt, selectedCampaign);
                // Update local and global state
                setSelectedCampaign(updatedCampaign);
                updateCampaign(updatedCampaign);
            } catch (error) {
                console.error("Failed to add node:", error);
                alert("Sorry, the agent failed to add a new node.");
            } finally {
                setIsAgentWorking(false);
            }
        }
    };

    const handleRegenerateNode = async (nodeToRegen: CampaignNode) => {
        if (!selectedCampaign) return;
        setIsAgentWorking(true);
        try {
            const updatedCampaign = await agentOrchestrator.regenerateNodeContent(nodeToRegen, selectedCampaign);
            // Update local and global state
            setSelectedCampaign(updatedCampaign);
            updateCampaign(updatedCampaign);
            // Update the selected node to show the new content
            setSelectedNode(updatedCampaign.nodes.find(n => n.id === nodeToRegen.id) || null);
        } catch (error) {
            console.error("Failed to regenerate node:", error);
            alert("Sorry, the agent failed to regenerate the node content.");
        } finally {
            setIsAgentWorking(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><LoadingIcon size={12} /></div>;
    }

    return (
        <div className="view-container flex h-full max-h-[calc(100vh-65px)]">
            {selectedNode && (
                <NodeDetailPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    onRegenerate={handleRegenerateNode}
                    isAgentWorking={isAgentWorking}
                />
            )}
            <aside className="w-80 bg-gray-800/50 border-r border-gray-700 p-4 flex-shrink-0 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 px-2">Campaigns</h2>
                <div className="flex-1 overflow-y-auto">
                    <nav className="space-y-2">
                        {campaigns.map(campaign => (
                            <button
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`w-full text-left p-3 rounded-md transition-colors ${
                                    selectedCampaign?.id === campaign.id
                                        ? 'bg-cyan-500/20 text-cyan-200'
                                        : 'hover:bg-gray-700/50 text-gray-300'
                                }`}
                            >
                                <h3 className="font-semibold">{campaign.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{campaign.description}</p>
                            </button>
                        ))}
                    </nav>
                </div>
                 <button
                    onClick={handleNewCampaign}
                    disabled={isAgentWorking}
                    className="mt-4 w-full py-2 bg-green-600 font-bold rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isAgentWorking && <LoadingIcon size={4} />}
                    New Campaign
                </button>
            </aside>
            <main className="flex-1 overflow-hidden bg-gray-900/50 relative">
                {selectedCampaign ? (
                    <StoryGraph 
                        campaign={selectedCampaign}
                        onNodeSelect={setSelectedNode}
                        onAddNode={handleAddNode}
                        isAgentWorking={isAgentWorking}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">Select a campaign to begin.</p>
                    </div>
                )}
            </main>
        </div>
    );
};