// =================================================================
// CORE APP STATE & NAVIGATION
// =================================================================

export type AppMode = 'campaign' | 'agent' | 'game' | 'vizlab';

export type GameScreen = 'hub' | 'episodeSelect' | 'strategybook' | 'trading' | 'market' | 'contacts' | 'dojo' | 'debrief';

export type VizLabTool =
  | 'avatarStudio'
  | 'themeStudio'
  | 'gradientDepth'
  | 'popAnimation'
  | 'streamingText'
  | 'fadeEffects'
  | 'pulsingLights'
  | 'dataGlitch'
  | 'holoCard'
  | 'marketPulse'
  | 'chartGrid'
  | 'neonButton'
  | 'scanline'
  | 'terminalLogger'
  | 'loaders'
  | 'parallaxHover'
  | 'dataNodes';

export interface AppStateSetters {
    setMode: (mode: AppMode) => void;
    setGameScreen: (screen: GameScreen) => void;
    setVizLabTool: (tool: VizLabTool) => void;
}

// =================================================================
// GAME CONTENT & PLAYER DATA
// =================================================================

export type MarketRegime = "trend" | "range" | "news" | "volcrush";

export interface Episode {
    id: string;
    title: string;
    description: string;
    regime: MarketRegime;
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
    bio: string;
    imageUrl: string;
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
    id: string;
    name: string;
    description: string;
    regime: MarketRegime;
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

export interface Drill {
    id: string;
    name: string;
    description: string;
    detectionRule: string;
    scenarioSeed: string;
    successCriteria: {
        metric: string;
        op: 'lt' | 'gt';
        value: number;
        label: string;
    };
    suggestedThemeId?: string;
}

export interface Trade {
    entryPrice: number;
    direction: 'long' | 'short';
    size: number;
    entryTime: number;
    exitPrice?: number;
    exitTime?: number;
    pnl?: number;
}

export interface Session {
    episodeId: string; // Could also be a drillId
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

export interface JournalEntry {
    id: string;
    timestamp: string;
    drillId: string;
    pnl: number;
    score: number;
    notes: string;
    ruleHits: Record<string, number>;
}

// =================================================================
// AGENT & VIZLAB TYPES
// =================================================================

export interface VisualAsset {
    id: string;
    name: string;
    type: 'avatar' | 'background' | 'ui_element';
    prompt: string;
    dataUrl: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    styles: {
        button: { classes: string };
        card: { classes: string };
    };
}

export interface AgentLesson {
    id: string;
    context: string;
    correction: string;
}

export type AgentAction = 'thinking' | 'generating_data' | 'generating_image' | 'saving_to_db' | 'responding';

export interface AgentLog {
    type: 'user' | 'agent' | 'system' | 'error';
    message: string;
    data?: any;
    action?: AgentAction; // For multi-step agent actions
}

export type CreationType = 'chat' | 'episode' | 'strategy' | 'character' | 'item' | 'drill' | 'visualAsset' | 'campaign' | 'storyNode';

// =================================================================
// CAMPAIGN & STORY GRAPH
// =================================================================

export interface CampaignNode {
    id: string;
    type: 'story' | 'episode' | 'drill' | 'choice';
    title: string;
    content: string;
    position: { x: number; y: number };
    visualAssetId?: string;
}

export interface CampaignLink {
    id: string;
    sourceId: string;
    targetId: string;
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    nodes: CampaignNode[];
    links: CampaignLink[];
}


// =================================================================
// DATA CONTEXT
// =================================================================

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
    campaigns: Campaign[];
}

export type AssetType = Episode | Strategy | AiCharacter | Item | Drill | VisualAsset | Campaign;

export interface DataContextType extends AppData {
    isLoading: boolean;
    fetchData: () => Promise<void>;
    purchaseItem: (itemId: string) => Promise<{success: boolean}>;
    grantEpisodeReward: (reward: number) => Promise<void>;
    addCreatedItem: <T extends AssetType>(item: T, type: CreationType) => void;
    updateCampaign: (campaign: Campaign) => void;
}