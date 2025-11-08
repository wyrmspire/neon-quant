import { CoachPort, GameState } from '../ports/game';

class MockCoachService implements CoachPort {
    private lastTipTime = 0;
    private tipCooldown = 15000; // 15 seconds

    evaluateTick(state: GameState): { tip?: string; ruleHit?: string } {
        const now = Date.now();
        if (now - this.lastTipTime < this.tipCooldown) {
            return {};
        }

        const vwap = state.indicators.vwap?.[state.indicators.vwap.length - 1]?.value;

        if (state.position?.direction === 'long' && vwap && state.price < vwap) {
            this.lastTipTime = now;
            return { tip: "You're long below VWAP. Be cautious, the short-term trend may be against you.", ruleHit: 'long_below_vwap' };
        }
        
        if (state.position?.direction === 'short' && vwap && state.price > vwap) {
            this.lastTipTime = now;
            return { tip: "You're short above VWAP. Ensure this aligns with your strategy.", ruleHit: 'short_above_vwap' };
        }

        return {};
    }
}

export const mockCoach = new MockCoachService();
