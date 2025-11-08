import React from 'react';
import { Campaign, CampaignNode } from '../../types';
import { LoadingIcon } from '../Icons';

interface StoryGraphProps {
    campaign: Campaign;
    onNodeSelect: (node: CampaignNode) => void;
    onAddNode: () => void;
    isAgentWorking: boolean;
}

const Node: React.FC<{ node: CampaignNode, onSelect: () => void }> = ({ node, onSelect }) => {
    const nodeColors = {
        story: 'border-cyan-400 bg-cyan-900/50 hover:bg-cyan-800/50',
        episode: 'border-green-400 bg-green-900/50 hover:bg-green-800/50',
        drill: 'border-orange-400 bg-orange-900/50 hover:bg-orange-800/50',
        choice: 'border-purple-400 bg-purple-900/50 hover:bg-purple-800/50',
    };

    return (
        <div
            className={`absolute w-48 p-4 rounded-lg border-2 cursor-pointer transition-colors ${nodeColors[node.type]}`}
            style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
            onClick={onSelect}
        >
            <h3 className="font-bold text-white truncate">{node.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{node.content}</p>
        </div>
    );
};

export const StoryGraph: React.FC<StoryGraphProps> = ({ campaign, onNodeSelect, onAddNode, isAgentWorking }) => {

    const getNodeById = (id: string) => campaign.nodes.find(n => n.id === id);

    return (
        <div className="w-full h-full relative overflow-auto">
            <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg border border-gray-700 flex gap-2">
                <button 
                    onClick={onAddNode}
                    disabled={isAgentWorking}
                    className="px-4 py-2 text-sm font-semibold text-gray-900 bg-cyan-500 rounded-md hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                     {isAgentWorking && <LoadingIcon size={4} />}
                    Add Story Node
                </button>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '1000px', minHeight: '800px'}}>
                {campaign.links.map(link => {
                    const sourceNode = getNodeById(link.sourceId);
                    const targetNode = getNodeById(link.targetId);
                    if (!sourceNode || !targetNode) return null;

                    const sourceX = sourceNode.position.x + 192; // 192 = width of node
                    const sourceY = sourceNode.position.y + 48; // 48 = half height of node
                    const targetX = targetNode.position.x;
                    const targetY = targetNode.position.y + 48;

                    return (
                        <path
                            key={link.id}
                            d={`M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`}
                            stroke="rgba(0, 255, 255, 0.3)"
                            strokeWidth="2"
                            fill="none"
                        />
                    );
                })}
            </svg>
            <div className="relative" style={{ minWidth: '1000px', minHeight: '800px'}}>
                 {campaign.nodes.map(node => (
                    <Node key={node.id} node={node} onSelect={() => onNodeSelect(node)} />
                ))}
            </div>
        </div>
    );
};