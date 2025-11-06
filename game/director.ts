export type PhaseId = 'brief' | 'play' | 'review' | 'score';
export type EventId = 'showTip' | 'spawnCheckpoint' | 'endPlay';

export type GameEvent =
  | { id: 'showTip'; text: string; when: 'enter' | 'ruleBreak' | 'milestone' }
  | { id: 'spawnCheckpoint'; rule: string; payload?: any }
  | { id: 'endPlay'; reason: 'timeout' | 'targetsMet' | 'stoppedOut' };

export type Phase = {
  id: PhaseId;
  title: string;
  durationSec?: number; // for play
  onEnter?: GameEvent[];
  onTick?: GameEvent[]; // polled each second in play
  onExit?: GameEvent[];
};

export type Drill = {
  id: string;
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h';
  anchorDate: string; // ISO
  phases: Phase[];
  scoring: {
    rules: { id: string; weight: number; desc: string }[];
    rubric: (inputs: { pnl: number; ruleHits: Record<string, number> }) => number;
  };
};

// Simple Director Runtime
export class Director {
    private drill: Drill;
    private currentPhaseIndex = -1;
    private timer: number | null = null;
    public onPhaseChange: (phase: Phase) => void = () => {};
    public onTick: (time: number) => void = () => {};
    public onTip: (tip: string) => void = () => {};

    constructor(drill: Drill) {
        this.drill = drill;
    }

    public start() {
        this.advancePhase();
    }

    public stop() {
        if (this.timer) clearInterval(this.timer);
    }
    
    public advancePhase = () => {
        if (this.timer) clearInterval(this.timer);
        this.currentPhaseIndex++;
        const phase = this.drill.phases[this.currentPhaseIndex];
        if (phase) {
            this.onPhaseChange(phase);
            phase.onEnter?.forEach(event => {
                if (event.id === 'showTip' && 'text' in event) this.onTip(event.text);
            });

            if (phase.id === 'play' && phase.durationSec) {
                let timeLeft = phase.durationSec;
                this.onTick(timeLeft);
                this.timer = window.setInterval(() => {
                    timeLeft--;
                    this.onTick(timeLeft);
                    if (timeLeft <= 0) {
                        this.advancePhase();
                    }
                }, 1000);
            }
        }
    };
}
