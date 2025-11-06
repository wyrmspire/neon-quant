import { Drill } from '../director';

export const ReplayDrill: Drill = {
  id: 'replay-drill-01',
  symbol: 'MES',
  timeframe: '5m',
  anchorDate: '2025-04-01T12:00:00.000Z',
  phases: [
    { id: 'brief', title: 'Briefing', onEnter: [{ id: 'showTip', text: 'Scope: trade only pullbacks to VWAP.', when: 'enter' }] },
    { id: 'play', title: 'Trade Window', durationSec: 180, onEnter: [ // Shortened for testing
        { id: 'spawnCheckpoint', rule: 'no_chase: entry within 2 candles of signal' },
        { id: 'spawnCheckpoint', rule: 'rr_min: risk:reward ≥ 1:1.5' },
        { id: 'showTip', text: 'Drag SL/TP handles to manage risk.', when: 'enter' },
      ]
    },
    { id: 'review', title: 'Replay Review', onEnter: [{ id: 'showTip', text: 'Journal your trade; note emotion + rule hits.', when: 'enter' }] },
    { id: 'score', title: 'Scoring' }
  ],
  scoring: {
    rules: [
      { id: 'no_chase', weight: 0.3, desc: 'Did not chase entries' },
      { id: 'rr_min', weight: 0.4, desc: 'Maintained R:R ≥ 1:1.5' },
      { id: 'stop_respect', weight: 0.3, desc: 'Never widened stop' },
    ],
    rubric: ({ pnl, ruleHits }) =>
      Math.round(
        50 + Math.tanh(pnl / 5) * 25 +
        (ruleHits.no_chase ?? 0) * 10 +
        (ruleHits.rr_min ?? 0) * 10 +
        (ruleHits.stop_respect ?? 0) * 5
      ),
  },
};
