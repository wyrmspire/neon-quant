import { useEffect, useState } from 'react';
import type { AllCandleData } from '../ports/charting';
import { MockChartData } from '../services/mockCharting';

export function useGameCandlestickData(symbol: string, anchorDate: Date) {
  const [allCandleData, setAll] = useState<AllCandleData>({ '1m':[], '5m':[], '15m':[], '1h':[], '4h':[] });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let on = true;
    setLoading(true);
    MockChartData.getAllCandles(symbol, anchorDate)
      .then(d => { if (on) setAll(d); })
      .catch(e => { if (on) setError(String(e)); })
      .finally(()=> on && setLoading(false));
    return () => { on = false; };
  }, [symbol, anchorDate]);

  return { allCandleData, isLoading, error };
}