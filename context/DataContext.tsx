import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { mockApi } from '../services/mockApi';
import { AppData, CreationType, DataContextType, Episode, Strategy, AiCharacter, Item, Drill, VisualAsset, AssetType } from '../types';

const defaultState: AppData = {
    profile: null,
    episodes: [],
    characters: [],
    strategies: [],
    items: [],
    drills: [],
    visualAssets: [],
    themes: [],
    agentLessons: [],
};

export const DataContext = createContext<DataContextType>({
    ...defaultState,
    isLoading: true,
    fetchData: async () => {},
    purchaseItem: async () => ({success: false}),
    grantEpisodeReward: async () => {},
    addCreatedItem: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appData, setAppData] = useState<AppData>(defaultState);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                profile, episodes, characters, strategies, items, drills, visualAssets, themes, agentLessons
            ] = await Promise.all([
                mockApi.getProfile(),
                mockApi.getEpisodes(),
                mockApi.getCharacters(),
                mockApi.getStrategies(),
                mockApi.getStoreItems(),
                mockApi.getDrills(),
                mockApi.getVisualAssets('avatar'), // Assuming only avatar for now
                mockApi.getThemes(),
                mockApi.getAgentLessons(),
            ]);
            setAppData({ profile, episodes, characters, strategies, items, drills, visualAssets, themes, agentLessons });
        } catch (error) {
            console.error("Failed to fetch initial app data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const purchaseItem = useCallback(async (itemId: string) => {
        const result = await mockApi.purchaseItem(itemId);
        if (result.success) {
            setAppData(prev => ({ ...prev, profile: result.profile }));
        }
        return result;
    }, []);
    
    const grantEpisodeReward = useCallback(async (reward: number) => {
        const updatedProfile = await mockApi.grantEpisodeReward(reward);
        setAppData(prev => ({ ...prev, profile: updatedProfile }));
    }, []);

    const addCreatedItem = useCallback(<T extends AssetType>(item: T, type: CreationType) => {
        switch (type) {
            case 'episode':
                setAppData(prev => ({ ...prev, episodes: [...prev.episodes, item as Episode] }));
                break;
            case 'strategy':
                setAppData(prev => ({ ...prev, strategies: [...prev.strategies, item as Strategy] }));
                break;
            case 'character':
                setAppData(prev => ({ ...prev, characters: [...prev.characters, item as AiCharacter] }));
                break;
            case 'item':
                setAppData(prev => ({ ...prev, items: [...prev.items, item as Item] }));
                break;
            case 'drill':
                 setAppData(prev => ({ ...prev, drills: [...prev.drills, item as Drill] }));
                break;
            case 'visualAsset':
                setAppData(prev => ({ ...prev, visualAssets: [...prev.visualAssets, item as VisualAsset] }));
                break;
        }
    }, []);

    const value = useMemo(() => ({
        ...appData,
        isLoading,
        fetchData,
        purchaseItem,
        grantEpisodeReward,
        addCreatedItem,
    }), [appData, isLoading, fetchData, purchaseItem, grantEpisodeReward, addCreatedItem]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};