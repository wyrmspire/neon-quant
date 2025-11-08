export type GameMode = 'agent' | 'game';
export type GameScreen = 'episodeSelect' | 'trading' | 'debrief' | 'hub' | 'market' | 'contacts';
export type CreationType = 'episode' | 'strategy' | 'character' | 'item' | 'chat';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'cosmetic' | 'tool';
}

export interface Profile {
  handle: string;
  tier: "novice" | "intermediate" | "pro";
  unlockedEpisodes: string[];
  cred: number;
  inventory: string[]; // array of item IDs
  settings: { dailyLossLimit: number; autoLock: boolean; }
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  regime: "trend" | "range" | "news" | "volcrush";
  seed: string;
  objectives: string[];
  characterBeats: { t: number; characterId: string; dialogue: string; choice?: string[] }[];
  imageUrl?: string;
  reward: number; // Cred reward for completion
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  regime: "trend" | "range" | "news" | "volcrush";
  entryConditions: string[];
  exitConditions: string[];
  riskManagement: string[];
}

export interface Session {
  mode: "episode" | "dailyRun" | "dojo" | "simLive" | "realLive";
  episodeId?: string;
  startTs: number; endTs?: number;
  plan: { setups: string[]; risk: number; notes: string; };
  mood: { energy: number; focus: number; calm: number; };
  metrics?: { pnl: number; maxDD: number; sharpe?: number; skillScore?: number; };
  breaches?: { code: string; t: number; }[];
}

export interface Trade {
  instrument: string; side: "long" | "short";
  entryTs: number; exitTs?: number;
  size: number; entry: number; exit?: number;
  tags: string[]; ruleValid: boolean;
  rMultiple?: number;
}

export interface CoachFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  assignedDrills: string[];
}

export interface Drill {
  name: string;
  detectionRule: string;
  scenarioSeed: string;
  successCriteria: { metric: string; op: "lt" | "gt"; value: number; };
}

export interface AiCharacter {
  id:string;
  name: string;
  personality: string;
  imageUrl: string;
  bio: string;
}

export interface AgentLog {
  type: 'user' | 'agent' | 'system' | 'error';
  message: string;
  data?: any;
}