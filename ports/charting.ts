// Candle and indicator types match the real chart app
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h';

export interface Candle {
  timestamp: number; // ms epoch
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Minimal indicator set used by the canvas
export type CalculatedIndicators = {
  ema200?: { timestamp: number; value: number }[];
  vwap?: { timestamp: number; value: number }[];
  dailyLevels?: {
    drawStartTime: number | null;
    drawEndTime: number | null;
    yHigh?: number | null;
    yLow?: number | null;
    yVPOC?: number | null;
    yVAH?: number | null;
    yVAL?: number | null;
    ySettle?: number | null;
    lastWeekHigh?: number | null;
    lastWeekLow?: number | null;
  };
  settlement?: { startTime: number; endTime: number; value: number }[];
  adr?: { startTime: number; endTime: number; resTop: number; resBottom: number; supTop: number; supBottom: number }[];
  levelRays?: { startTime: number; originTime: number; breachedTime?: number; value: number; role: 'support' | 'resistance' }[];
};

export type AllCandleData = Record<Timeframe, Candle[]>;

export interface ChartDataPort {
  getAllCandles(symbol: string, anchorDate: Date): Promise<AllCandleData>;
}

export interface IndicatorsPort {
  getIndicators(all: AllCandleData, tf: Timeframe): Promise<CalculatedIndicators>;
}

export interface ReplayPort {
  load(candles: Candle[], targetDate: Date): void;           // mirrors LOAD_DATA
  updateTrade(patch: Partial<{ stopLoss: number; takeProfit: number }>): void; // mirrors UPDATE_TRADE
}