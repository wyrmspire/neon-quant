export type AppMode = 'agent' | 'game' | 'vizlab';

export type GameScreen = 'hub' | 'episodeSelect' | 'market' | 'contacts' | 'trading' | 'dojo' | 'debrief' | 'strategybook';

export type VizLabTool = 'avatarStudio' | 'gradientDepth' | 'popAnimation' | 'streamingText' | 'fadeEffects' | 'pulsingLights' | 'themeStudio';

export type Regime = "trend" | "range" | "news" | "volcrush";

export interface Episode {
    id: string;
    title: string;
    description: string;
    regime: Regime;
    seed: string;
    objectives: string[];
    imageUrl: string;
    reward: number;
    suggestedThemeId?: string;
}

export interface AiCharacter {
    id: string;
    name: string;
    personality: string;
    imageUrl: string;
    bio: string;
    suggestedThemeId?: string;
}

export interface Profile {
    handle: string;
    tier: string;
    unlockedEpisodes: string[];
    cred: number;
    inventory: string[];
    settings: {
        dailyLossLimit: number;
        autoLock: boolean;
    };
}

export interface Strategy {
    id:string;
    name: string;
    description: string;
    regime: Regime;
    entryConditions: string[];
    exitConditions: string[];
    riskManagement: string[];
    suggestedThemeId?: string;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'cosmetic' | 'tool';
    suggestedThemeId?: string;
}

export interface SuccessCriteria {
    metric: string;
    op: 'lt' | 'gt';
    value: number;
    label: string;
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    detectionRule: string;
    scenarioSeed: string;
    successCriteria: SuccessCriteria;
    suggestedThemeId?: string;
}

export interface AgentLog {
    type: 'user' | 'agent' | 'system' | 'error';
    message: string;
    data?: any;
}

export type CreationType = 'chat' | 'episode' | 'strategy' | 'character' | 'item' | 'drill' | 'visualAsset';

// For Trading Arena state
export interface Trade {
    entryPrice: number;
    exitPrice?: number;
    direction: 'long' | 'short';
    size: number;
    entryTime: number;
    exitTime?: number;
    pnl?: number;
}

export interface Session {
    episodeId: string;
    closedTrades: Trade[];
    finalPnl: number;
}

export interface CoachFeedback {
    sessionId: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    assignedDrillId?: string;
}

export interface VisualAsset {
    id: string;
    type: 'avatar' | 'vfx' | 'gradient';
    name: string;
    prompt: string;
    dataUrl: string; // base64 data URL
}

export interface ComponentStyle {
    classes: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    styles: {
        button: ComponentStyle,
        card: ComponentStyle,
    }
}

export interface JournalEntry {
    id: string;
    drillId: string;
    timestamp: string;
    pnl: number;
    score: number;
    notes: string;
    ruleHits: Record<string, number>;
}

export interface AgentLesson {
    id: string;
    context: string;
    correction: string;
}

// Data Context Types
export interface AppData {
    profile: Profile | null;
    episodes: Episode[];
    characters: AiCharacter[];
    strategies: Strategy[];
    items: Item[];
    drills: Drill[];
    visualAssets: VisualAsset[];
    themes: Theme[];
    agentLessons: AgentLesson[];
}

export type AssetType = Episode | Strategy | AiCharacter | Item | Drill | VisualAsset;

export interface DataContextType extends AppData {
    isLoading: boolean;
    fetchData: () => Promise<void>;
    purchaseItem: (itemId: string) => Promise<{success: boolean}>;
    grantEpisodeReward: (reward: number) => Promise<void>;
    addCreatedItem: <T extends AssetType>(item: T, type: CreationType) => void;
}

export interface AppStateSetters {
    setMode: (mode: AppMode) => void;
    setGameScreen: (screen: GameScreen) => void;
    setVizLabTool: (tool: VizLabTool) => void;
}
