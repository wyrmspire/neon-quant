import { ReplayPort, Candle } from '../ports/charting';

type Dispatch = (action: any) => void;

export const makeMockReplay = (dispatch: Dispatch): ReplayPort => ({
  load(candles: Candle[], targetDate: Date) {
    dispatch({ type: 'LOAD_DATA', payload: { candles, targetDate } });
  },
  updateTrade(patch) {
    dispatch({ type: 'UPDATE_TRADE', payload: patch });
  },
});