import React, { useEffect, useState } from 'react';
import { CampaignNode } from '../../types';
import { useData } from '../../context/DataContext';
import { LoadingIcon } from '../Icons';

interface NodeDetailPanelProps {
    node: CampaignNode;
    onClose: () => void;
    onRegenerate: (node: CampaignNode) => void;
    isAgentWorking: boolean;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose, onRegenerate, isAgentWorking }) => {
    const { visualAssets } = useData();
    const [displayedContent, setDisplayedContent] = useState('');
    const image = visualAssets.find(va => va.id === node.visualAssetId);

    useEffect(() => {
        // Typewriter effect for the content
        setDisplayedContent(''); // Reset on node change
        let index = 0;
        const intervalId = setInterval(() => {
            if (index < node.content.length) {
                setDisplayedContent(prev => prev + node.content[index]);
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 20); // Adjust typing speed

        return () => clearInterval(intervalId);
    }, [node]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 border-2 border-cyan-400/50 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col relative">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-white text-3xl leading-none z-10">&times;</button>
                
                <div className="w-full h-1/2 bg-gray-900 rounded-t-lg">
                    {/* Placeholder for an image */}
                    <img 
                        src={image ? image.dataUrl : `https://picsum.photos/seed/${node.id}/1200/600`} 
                        alt={node.title}
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-cyan-300 mb-4">{node.title}</h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        {displayedContent}
                        <span className="inline-block w-2 h-5 bg-cyan-300 ml-1 animate-ping-caret"></span>
                    </p>
                </div>
                 <div className="p-4 border-t border-gray-700 flex justify-end gap-4">
                    <button disabled className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:cursor-not-allowed">Edit (WIP)</button>
                    <button 
                        onClick={() => onRegenerate(node)}
                        disabled={isAgentWorking}
                        className="px-4 py-2 text-sm font-semibold text-gray-900 bg-purple-500 rounded-md hover:bg-purple-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAgentWorking && <LoadingIcon size={4} />}
                        Regenerate
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes ping-caret {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-ping-caret { animation: ping-caret 1s step-end infinite; }
            `}</style>
        </div>
    );
};