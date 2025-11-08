import { Trade } from "../types";
import { CalculatedIndicators } from "./charting";

export interface GameState {
    price: number;
    position: Trade | null;
    indicators: CalculatedIndicators;
}

export interface CoachPort {
    evaluateTick(state: GameState): { tip?: string, ruleHit?: string };
}

export interface JournalPayload {
    drillId: string;
    pnl: number;
    score: number;
    notes: string;
    ruleHits: Record<string, number>;
}

export interface JournalPort {
    save(payload: JournalPayload): Promise<void>;
}
