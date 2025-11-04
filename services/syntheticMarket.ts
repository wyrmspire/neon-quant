/**
 * A simple service to generate synthetic market price data based on a seed.
 * This makes our trading scenarios deterministic and replayable.
 */
class SyntheticMarket {
    private readonly BASE_PRICE = 100;
    private readonly NOISE_FACTOR = 0.5;

    /**
     * Generates a price series based on a descriptive seed.
     * @param seed A string like "REGIME:MODIFIER", e.g., "TREND:UP_STRONG", "RANGE:TIGHT"
     * @param length The number of data points (seconds) to generate.
     * @returns An array of numbers representing the price at each second.
     */
    public generatePriceData(seed: string, length: number): number[] {
        const [regime, modifier] = (seed || 'RANGE:NORMAL').split(':');
        const prices: number[] = [this.BASE_PRICE];

        for (let i = 1; i < length; i++) {
            const prevPrice = prices[i - 1];
            let newPrice: number;

            switch (regime.toUpperCase()) {
                case 'TREND':
                    newPrice = this.generateTrendPrice(prevPrice, modifier);
                    break;
                case 'RANGE':
                    newPrice = this.generateRangePrice(prevPrice, i, length, modifier);
                    break;
                case 'NEWS':
                    newPrice = this.generateNewsPrice(prevPrice, i, length, modifier);
                    break;
                case 'VOLCRUSH':
                    newPrice = this.generateVolCrushPrice(prevPrice, i, length, modifier);
                    break;
                default:
                    newPrice = prevPrice + (Math.random() - 0.5) * this.NOISE_FACTOR;
            }
            prices.push(newPrice);
        }
        return prices;
    }

    private generateTrendPrice(prevPrice: number, modifier: string): number {
        const drift = modifier === 'DOWN' ? -0.15 : 0.15;
        const noise = (Math.random() - 0.5) * this.NOISE_FACTOR;
        return prevPrice + drift + noise;
    }

    private generateRangePrice(prevPrice: number, index: number, length: number, modifier: string): number {
        const range = modifier === 'TIGHT' ? 2 : 5;
        const speed = 0.1;
        // Use a sine wave to create an oscillating pattern
        const sineWave = Math.sin(index * speed) * range;
        const noise = (Math.random() - 0.5) * this.NOISE_FACTOR;
        return this.BASE_PRICE + sineWave + noise;
    }

    private generateNewsPrice(prevPrice: number, index: number, length: number, modifier: string): number {
        const eventTime = Math.floor(length / 3);
        const spikeMagnitude = 10;
        let noise = (Math.random() - 0.5) * (this.NOISE_FACTOR / 2); // Calm before the storm

        if (index === eventTime) {
            // The news event spike
            return prevPrice + spikeMagnitude;
        }
        if (index > eventTime) {
            // Increased volatility after the event
            noise = (Math.random() - 0.5) * (this.NOISE_FACTOR * 3);
        }

        return prevPrice + noise;
    }
    
    private generateVolCrushPrice(prevPrice: number, index: number, length: number, modifier: string): number {
        const volatilityDecay = 1 - (index / length); // Volatility decreases over time
        const noise = (Math.random() - 0.5) * (this.NOISE_FACTOR * 5) * volatilityDecay;
        return prevPrice + noise;
    }
}

export const syntheticMarket = new SyntheticMarket();