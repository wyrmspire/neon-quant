import React, { useState } from 'react';
import { VisualAsset } from '../types';
import { agentOrchestrator } from '../services/agentOrchestrator';
import { LoadingIcon } from './Icons';
import { useData } from '../context/DataContext';

export const AvatarStudio: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAsset, setGeneratedAsset] = useState<VisualAsset | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { visualAssets, addCreatedItem } = useData();
    const gallery = visualAssets.filter(asset => asset.type === 'avatar');

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setGeneratedAsset(null);
        setError(null);
        try {
            const fullPrompt = `A square character portrait for a trading game. Neon-cyberpunk, graphic novel aesthetic. Centered bust shot. Style is vibrant and energetic. Character: ${prompt}`;
            const newAsset = await agentOrchestrator.createVisualAsset(prompt, fullPrompt, 'avatar');
            addCreatedItem(newAsset, 'visualAsset');
            setGeneratedAsset(newAsset);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during image generation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClear = () => {
        setGeneratedAsset(null);
        setPrompt('');
        setError(null);
    };

    return (
        <div className="p-8 h-full flex flex-col">
             <header className="text-center mb-8 flex-shrink-0">
                <h1 className="text-4xl font-bold tracking-tight text-white">Avatar Studio</h1>
                <p className="text-lg text-gray-400 mt-1">Generate and manage character portraits for your game.</p>
            </header>
            
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* Left Pane: Generator */}
                <div className="md:col-span-1 bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4">Generator</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Image Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A grizzled veteran trader with a cybernetic eye"
                                className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                rows={4}
                                disabled={isLoading}
                            />
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                            {isLoading ? <LoadingIcon size={5} /> : 'Generate & Save'}
                        </button>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-700 pt-6 flex-1 flex flex-col justify-center items-center">
                        {generatedAsset ? (
                            <div className="w-full text-center animate-fade-in">
                                <h3 className="font-semibold text-lg text-white mb-2">Generated: {generatedAsset.name}</h3>
                                <img src={generatedAsset.dataUrl} alt={generatedAsset.name} className="w-full aspect-square rounded-lg object-cover border-2 border-cyan-400" />
                                <button onClick={handleClear} className="w-full mt-4 py-2 bg-gray-600 font-bold rounded-md hover:bg-gray-500">Clear</button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Generated image will appear here.</p>
                            </div>
                        )}
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                </div>

                {/* Right Pane: Gallery */}
                <div className="md:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 overflow-y-auto">
                    <h2 className="text-xl font-bold text-white mb-4">Avatar Library</h2>
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map(asset => (
                                <div key={asset.id} className="group relative">
                                    <img src={asset.dataUrl} alt={asset.name} className="w-full aspect-square rounded-lg object-cover" />
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 rounded-lg">
                                        <p className="text-white text-xs font-bold">{asset.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-lg">Your saved avatars will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};