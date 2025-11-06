import { useEffect, useState } from 'react';
import type { AllCandleData, CalculatedIndicators, Timeframe } from '../ports/charting';
import { MockIndicators } from '../services/mockCharting';

export function useGameIndicators(all: AllCandleData, timeframe: Timeframe) {
  const [indicators, setIndicators] = useState<CalculatedIndicators>({});
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let on = true;
    if (!all[timeframe] || all[timeframe].length === 0) {
        setIndicators({});
        return;
    };
    
    MockIndicators.getIndicators(all, timeframe)
      .then(res => { if (on) setIndicators(res); })
      .catch(e => { if (on) setError(String(e)); });
    return () => { on = false; };
  }, [all, timeframe]);

  return { indicators, error };
}