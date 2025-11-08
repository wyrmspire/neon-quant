import React from 'react';
import { useData } from '../../context/DataContext';
import { Episode, Strategy, AiCharacter, Drill, Item, VisualAsset } from '../../types';

interface AssetListProps<T extends { id: string; name?: string; title?: string }> {
    title: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

const AssetList = <T extends { id: string; name?: string; title?: string }>({ title, items, renderItem }: AssetListProps<T>) => (
    <div>
        <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
            {items.length > 0 ? items.map(renderItem) : <p className="text-sm text-gray-500">None yet.</p>}
        </div>
    </div>
);

export const AssetLibraryPanel: React.FC = () => {
    const { episodes, strategies, characters, drills, items, visualAssets } = useData();

    return (
        <div className="md:col-span-1 h-full bg-gray-800/50 border-l border-gray-700 overflow-y-auto p-4 space-y-4">
            <AssetList
                title="Available Episodes"
                items={episodes}
                renderItem={(ep: Episode) => (
                    <div key={ep.id} className="p-3 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-cyan-300">{ep.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{ep.description}</p>
                    </div>
                )}
            />
            
            <div>
                 <h2 className="text-lg font-bold text-white mb-3">Visual Asset Library</h2>
                 <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2">
                    {visualAssets.map((asset: VisualAsset) => (
                        <div key={asset.id} className="relative group">
                            <img src={asset.dataUrl} alt={asset.name} className="w-full aspect-square object-cover rounded-md"/>
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                <p className="text-white text-xs font-bold leading-tight">{asset.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AssetList
                title="Created Strategies"
                items={strategies}
                renderItem={(strat: Strategy) => (
                    <div key={strat.id} className="p-3 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-purple-300">{strat.name}</h3>
                    </div>
                )}
            />
             <AssetList
                title="Game Characters"
                items={characters}
                renderItem={(char: AiCharacter) => (
                    <div key={char.id} className="p-3 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-green-300">{char.name}</h3>
                    </div>
                )}
            />
             <AssetList
                title="Practice Drills"
                items={drills}
                renderItem={(drill: Drill) => (
                    <div key={drill.id} className="p-3 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-orange-300">{drill.name}</h3>
                    </div>
                )}
            />
             <AssetList
                title="Market Items"
                items={items}
                renderItem={(item: Item) => (
                     <div key={item.id} className="p-3 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-yellow-300">{item.name}</h3>
                    </div>
                )}
            />
        </div>
    );
};
