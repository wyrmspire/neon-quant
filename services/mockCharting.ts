import { ChartDataPort, IndicatorsPort, Timeframe, AllCandleData, Candle, CalculatedIndicators } from '../ports/charting';
import { syntheticMarket } from '../services/syntheticMarket';

// helper: aggregate 1m into higher TFs (simple O/H/L/C aggregate)
function aggregate(candles: Candle[], n: number): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i += n) {
    const slice = candles.slice(i, i + n);
    if (!slice.length) continue;
    out.push({
      timestamp: slice[0].timestamp,
      open: slice[0].open,
      high: Math.max(...slice.map(c => c.high)),
      low: Math.min(...slice.map(c => c.low)),
      close: slice[slice.length - 1].close,
      volume: slice.reduce((v, c) => v + c.volume, 0),
    });
  }
  return out;
}

const tfMult: Record<Timeframe, number> = { '1m':1, '5m':5, '15m':15, '1h':60, '4h':240 };

export const MockChartData: ChartDataPort = {
  async getAllCandles(symbol: string, anchorDate: Date): Promise<AllCandleData> {
    // Use episode seed or default; generate deterministic series
    const length = 600; // 600 minutes (~1 trading day mock)
    const prices = syntheticMarket.generatePriceData(symbol || 'RANGE:NORMAL', length); // or pass episode.seed
    const startTs = anchorDate.getTime() - (length * 60_000);

    const oneMin: Candle[] = prices.map((p, i) => {
      const ts = startTs + i * 60_000;
      const o = p, h = p + Math.random()*0.5, l = p - Math.random()*0.5, c = p + (Math.random()-0.5)*0.2;
      return { timestamp: ts, open: o, high: Math.max(o,h,c), low: Math.min(o,l,c), close: c, volume: Math.round(Math.random() * 100) + 1 };
    });

    const all: AllCandleData = { '1m': oneMin, '5m': [], '15m': [], '1h': [], '4h': [] };
    (Object.keys(tfMult) as Timeframe[]).forEach(tf => { all[tf] = tf === '1m' ? oneMin : aggregate(oneMin, tfMult[tf]); });
    return all;
  },
};

export const MockIndicators: IndicatorsPort = {
  async getIndicators(all: AllCandleData, tf: Timeframe): Promise<CalculatedIndicators> {
    const candles = all[tf] ?? [];
    if (candles.length === 0) return {};
    
    // toy ema200 + vwap
    let ema = 0, k = 2/(200+1);
    const ema200 = candles.map((c, i) => { ema = i ? c.close*k + ema*(1-k) : c.close; return { timestamp: c.timestamp, value: ema }; });
    let sumPV = 0, sumV = 0;
    const vwap = candles.map((c) => { const tp = (c.high+c.low+c.close)/3; sumPV += tp*c.volume; sumV += c.volume; return { timestamp: c.timestamp, value: sumPV/Math.max(1,sumV) }; });

    // very light dailyLevels/settlement/adr placeholders
    const dayStart = candles[0]?.timestamp ?? 0;
    const dayEnd = candles[candles.length-1]?.timestamp ?? 0;
    const hi = Math.max(...candles.map(c=>c.high)), lo = Math.min(...candles.map(c=>c.low));
    return {
      ema200, vwap,
      dailyLevels: { drawStartTime: dayStart, drawEndTime: dayEnd, yHigh: hi, yLow: lo, yVPOC: (hi+lo)/2 },
      settlement: [{ startTime: dayStart, endTime: dayEnd, value: (hi+lo)/2 }],
      adr: [{ startTime: dayStart, endTime: dayEnd, resTop: hi, resBottom: (hi+lo)/2, supTop: (hi+lo)/2, supBottom: lo }],
      levelRays: [],
    };
  }
};