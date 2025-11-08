import { Episode, AiCharacter, Profile, Strategy, Item } from '../types';

let episodes: Episode[] = [
    {
        id: 'ep1',
        title: "Night of the CPI",
        description: "A volatile news event is about to drop. Keep your cool and trade the reaction, not the headline.",
        regime: "news",
        seed: "ES_2024-02-13_0830-1100",
        objectives: ["<=1.0R max DD", "Tag every trade", "Take <= 3 trades"],
        characterBeats: [
            { t: 5, characterId: 'mentor', dialogue: "The plan is your shield. Don't go into battle without it." },
            { t: 30, characterId: 'rival', dialogue: "CPI is printing money if you're fast enough. Plans are for dinosaurs." },
            { t: 60, characterId: 'fixer', dialogue: "I hear a whisper... a big firm is trapped on the wrong side. Might be a good time to pile in." },
        ],
        imageUrl: "https://picsum.photos/seed/ep1/600/400",
        reward: 500,
    },
    {
        id: 'ep2',
        title: "The Chop Shop",
        description: "The market is a ranging mess. Your job is to avoid getting chopped up. Scalp the edges or sit on your hands.",
        regime: "range",
        seed: "ES_2024-05-20_1000-1200",
        objectives: ["No trades in the middle 50% of range", "Achieve 1.5R total", "End with positive P&L"],
        characterBeats: [
            { t: 10, characterId: 'mentor', dialogue: "Patience is a weapon in a ranging market. Let the price come to you." },
            { t: 45, characterId: 'rival', dialogue: "Made a quick 2 points while you were meditating. Boring markets are the best." }
        ],
        imageUrl: "https://picsum.photos/seed/ep2/600/400",
        reward: 350,
    }
];

let characters: AiCharacter[] = [
    { id: 'mentor', name: 'Kai', personality: 'A calm, process-oriented veteran trader who values risk management above all else.', imageUrl: 'https://picsum.photos/seed/kai/200/200', bio: 'Kai has seen it all and believes that a solid process is the only thing that separates gamblers from traders.' },
    { id: 'rival', name: 'Zane', personality: 'A cocky, P&L-driven trader who loves to brag and takes big risks.', imageUrl: 'https://picsum.photos/seed/zane/200/200', bio: 'Zane lives for the thrill of the trade and has a flashy apartment to show for it. He thinks rules are for the timid.' },
    { id: 'fixer', name: 'Silas', personality: 'A shadowy figure who offers tempting shortcuts and morally ambiguous tips.', imageUrl: 'https://picsum.photos/seed/silas/200/200', bio: 'No one knows where Silas gets his information, but it always seems to be one step ahead of the market. His help comes at a price.' }
];

let userProfile: Profile = {
    handle: "PlayerOne",
    tier: "novice",
    unlockedEpisodes: ["ep1"],
    cred: 1200,
    inventory: ['item1'],
    settings: { dailyLossLimit: 1000, autoLock: true }
};

let strategies: Strategy[] = [
    {
        id: 'strat1',
        name: 'Beginner Trend Pullback',
        description: 'A simple strategy for beginners to catch pullbacks in an established trend. Wait for the price to pull back, then enter in the direction of the trend.',
        regime: 'trend',
        entryConditions: [
            'Identify a clear uptrend or downtrend.',
            'Wait for price to pull back to a key support/resistance level.',
            'Enter on a confirmation candle in the trend\'s direction.'
        ],
        exitConditions: [
            'Take profit at the next major level.',
            'Exit if the trend structure is broken.'
        ],
        riskManagement: [
            'Place stop-loss behind the pullback structure.',
            'Risk no more than 1R per trade.'
        ]
    }
];

let storeItems: Item[] = [
    { id: 'item1', name: 'Neon Bonsai', description: 'A stylish, glowing bonsai tree for your desk. Purely cosmetic, but it really ties the room together.', price: 750, type: 'cosmetic' },
    { id: 'item2', name: 'Advanced Charting Suite', description: 'Unlocks additional indicators and drawing tools in the Trading Arena.', price: 2500, type: 'tool' },
    { id: 'item3', name: 'Rival Taunt Pack', description: 'Get a new set of taunts from Zane when you outperform him.', price: 300, type: 'cosmetic' },
];

class MockApiService {
    async getEpisodes(): Promise<Episode[]> {
        return Promise.resolve(JSON.parse(JSON.stringify(episodes)));
    }

    async getEpisode(id: string): Promise<Episode | undefined> {
        return Promise.resolve(episodes.find(e => e.id === id));
    }

    async createEpisode(episode: Omit<Episode, 'id' | 'reward'>): Promise<Episode> {
        const newEpisode: Episode = {
            ...episode,
            id: `ep${Date.now()}`,
            reward: Math.floor(Math.random() * 200) + 300, // Random reward
        };
        episodes.push(newEpisode);
        return Promise.resolve(newEpisode);
    }
    
    async getCharacters(): Promise<AiCharacter[]> {
        return Promise.resolve(JSON.parse(JSON.stringify(characters)));
    }

    async getCharacter(id: string): Promise<AiCharacter | undefined> {
        return Promise.resolve(characters.find(c => c.id === id));
    }

    async createCharacter(character: Omit<AiCharacter, 'id'>): Promise<AiCharacter> {
        const newCharacter: AiCharacter = {
            ...character,
            id: `char${Date.now()}`
        };
        characters.push(newCharacter);
        return Promise.resolve(newCharacter);
    }

    async getProfile(): Promise<Profile> {
        return Promise.resolve(JSON.parse(JSON.stringify(userProfile)));
    }

    async grantEpisodeReward(reward: number): Promise<Profile> {
        userProfile.cred += reward;
        return this.getProfile();
    }

    async getStrategies(): Promise<Strategy[]> {
        return Promise.resolve(JSON.parse(JSON.stringify(strategies)));
    }

    async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
        const newStrategy: Strategy = {
            ...strategy,
            id: `strat${Date.now()}`
        };
        strategies.push(newStrategy);
        return Promise.resolve(newStrategy);
    }

    async getStoreItems(): Promise<Item[]> {
        return Promise.resolve(JSON.parse(JSON.stringify(storeItems)));
    }

    async createItem(item: Omit<Item, 'id'>): Promise<Item> {
        const newItem: Item = {
            ...item,
            id: `item${Date.now()}`
        };
        storeItems.push(newItem);
        return Promise.resolve(newItem);
    }

    async purchaseItem(itemId: string): Promise<{profile: Profile, success: boolean}> {
        const item = storeItems.find(i => i.id === itemId);
        if (!item) return { profile: await this.getProfile(), success: false };
        if (userProfile.cred < item.price) return { profile: await this.getProfile(), success: false };
        if (userProfile.inventory.includes(itemId)) return { profile: await this.getProfile(), success: false };

        userProfile.cred -= item.price;
        userProfile.inventory.push(itemId);
        
        return { profile: await this.getProfile(), success: true };
    }
}

export const mockApi = new MockApiService();