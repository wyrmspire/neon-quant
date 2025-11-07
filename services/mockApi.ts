// Fix: Corrected import path for types and added AgentLesson.
import { Episode, AiCharacter, Profile, Strategy, Item, Drill, CoachFeedback, VisualAsset, Theme, AgentLesson } from '../types';
import { mockDb } from './mockDb';

class MockApiService {
    async getEpisodes(): Promise<Episode[]> {
        const db = mockDb.read();
        return Promise.resolve(db.episodes);
    }

    async getEpisode(id: string): Promise<Episode | undefined> {
        const db = mockDb.read();
        return Promise.resolve(db.episodes.find(e => e.id === id));
    }

    async createEpisode(episode: Omit<Episode, 'id' | 'reward'>): Promise<Episode> {
        const newEpisode: Episode = {
            ...episode,
            id: `ep${Date.now()}`,
            reward: Math.floor(Math.random() * 200) + 300, // Random reward
        };
        mockDb.write(db => {
            db.episodes.push(newEpisode);
        });
        return Promise.resolve(newEpisode);
    }
    
    async getCharacters(): Promise<AiCharacter[]> {
        const db = mockDb.read();
        return Promise.resolve(db.characters);
    }

    async getCharacter(id: string): Promise<AiCharacter | undefined> {
        const db = mockDb.read();
        return Promise.resolve(db.characters.find(c => c.id === id));
    }

    async createCharacter(character: Omit<AiCharacter, 'id'>): Promise<AiCharacter> {
        const newCharacter: AiCharacter = {
            ...character,
            id: `char${Date.now()}`
        };
        mockDb.write(db => {
            db.characters.push(newCharacter);
        });
        return Promise.resolve(newCharacter);
    }

    async getProfile(): Promise<Profile> {
        const db = mockDb.read();
        return Promise.resolve(db.profile);
    }

    async grantEpisodeReward(reward: number): Promise<Profile> {
        let updatedProfile: Profile | null = null;
        mockDb.write(db => {
            db.profile.cred += reward;
            updatedProfile = db.profile;
        });
        return Promise.resolve(JSON.parse(JSON.stringify(updatedProfile!)));
    }

    async getStrategies(): Promise<Strategy[]> {
        const db = mockDb.read();
        return Promise.resolve(db.strategies);
    }

    async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
        const newStrategy: Strategy = {
            ...strategy,
            id: `strat${Date.now()}`
        };
        mockDb.write(db => {
            db.strategies.push(newStrategy);
        });
        return Promise.resolve(newStrategy);
    }

    async getStoreItems(): Promise<Item[]> {
        const db = mockDb.read();
        return Promise.resolve(db.items);
    }

    async createItem(item: Omit<Item, 'id'>): Promise<Item> {
        const newItem: Item = {
            ...item,
            id: `item${Date.now()}`
        };
        mockDb.write(db => {
            db.items.push(newItem);
        });
        return Promise.resolve(newItem);
    }

    async purchaseItem(itemId: string): Promise<{profile: Profile, success: boolean}> {
        let success = false;
        let finalProfile: Profile | null = null;

        mockDb.write(db => {
            const item = db.items.find(i => i.id === itemId);
            if (!item || db.profile.cred < item.price || db.profile.inventory.includes(itemId)) {
                success = false;
            } else {
                db.profile.cred -= item.price;
                db.profile.inventory.push(itemId);
                success = true;
            }
            finalProfile = db.profile;
        });
        
        return { profile: JSON.parse(JSON.stringify(finalProfile!)), success };
    }

    async getDrills(): Promise<Drill[]> {
        const db = mockDb.read();
        return Promise.resolve(db.drills);
    }

    async createDrill(drill: Omit<Drill, 'id'>): Promise<Drill> {
        const newDrill: Drill = {
            ...drill,
            id: `drill${Date.now()}`
        };
        mockDb.write(db => {
            db.drills.push(newDrill);
        });
        return Promise.resolve(newDrill);
    }

    async saveCoachFeedback(feedback: Omit<CoachFeedback, 'sessionId'>): Promise<CoachFeedback> {
        const newFeedback: CoachFeedback = {
            ...feedback,
            sessionId: `sess${Date.now()}`
        };
        mockDb.write(db => {
            db.coachFeedback.push(newFeedback);
        });
        return Promise.resolve(newFeedback);
    }

    async getVisualAssets(type: VisualAsset['type']): Promise<VisualAsset[]> {
        const db = mockDb.read();
        const assets = db.visualAssets.filter(asset => asset.type === type);
        return Promise.resolve(assets);
    }

    async createVisualAsset(assetData: Omit<VisualAsset, 'id'>): Promise<VisualAsset> {
        const newAsset: VisualAsset = {
            ...assetData,
            id: `vis${Date.now()}`
        };
        mockDb.write(db => {
            db.visualAssets.push(newAsset);
        });
        return Promise.resolve(newAsset);
    }

    async getThemes(): Promise<Theme[]> {
        const db = mockDb.read();
        return Promise.resolve(db.themes);
    }

    async createTheme(theme: Omit<Theme, 'id'>): Promise<Theme> {
        const newTheme: Theme = {
            ...theme,
            id: `theme${Date.now()}`
        };
        mockDb.write(db => {
            db.themes.push(newTheme);
        });
        return Promise.resolve(newTheme);
    }

    // Fix: Added missing getAgentLessons method.
    async getAgentLessons(): Promise<AgentLesson[]> {
        const db = mockDb.read();
        return Promise.resolve(db.agentLessons);
    }

    // Fix: Added missing createAgentLesson method.
    async createAgentLesson(lesson: Omit<AgentLesson, 'id'>): Promise<AgentLesson> {
        const newLesson: AgentLesson = {
            ...lesson,
            id: `lesson${Date.now()}`
        };
        mockDb.write(db => {
            db.agentLessons.push(newLesson);
        });
        return Promise.resolve(newLesson);
    }
}

export const mockApi = new MockApiService();