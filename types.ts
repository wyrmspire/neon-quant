// Fix: Corrected import path for zod.
import { z } from 'zod';
export type AppMode = 'agent' | 'game' | 'vizlab';

export type GameScreen = 'hub' | 'episodeSelect' | 'market' | 'contacts' | 'trading' | 'dojo' | 'debrief' | 'strategybook';

export type VizLabTool = 'avatarStudio' | 'gradientDepth' | 'popAnimation' | 'streamingText' | 'fadeEffects' | 'pulsingLights';

export type Regime = "trend" | "range" | "news" | "volcrush";

export interface CharacterBeat {
    t: number;
    characterId: string;
    dialogue: string;
}

export interface Episode {
    id: string;
    title: string;
    description: string;
    regime: Regime;
    seed: string;
    objectives: string[];
    characterBeats: CharacterBeat[];
    imageUrl: string;
    reward: number;
}

export interface AiCharacter {
    id: string;
    name: string;
    personality: string;
    imageUrl: string;
    bio: string;
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
}

export interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'cosmetic' | 'tool';
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
