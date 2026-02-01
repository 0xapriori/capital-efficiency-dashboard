import { useState, useEffect, useCallback } from 'react';
import { ChainMetrics } from '../types';
import { 
  fetchChainTVL, 
  fetchStablecoinChains, 
  fetchDexOverview, 
  fetchFeesOverview,
  fetchChainDexVolumes,
  fetchChainFees
} from '../api/defillama';
import { calculateMetrics, sanitizeMetrics, aggregateDexVolumeByChain, aggregateFeesbyChain } from '../utils/calculations';
import { normalizeChainName } from '../utils/chainMapping';

interface UseChainMetricsResult {
  chainMetrics: ChainMetrics[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

export function useChainMetrics(): UseChainMetricsResult {
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tvlResult, stablecoinResult, dexResult, feesResult] = await Promise.all([
        fetchChainTVL(),
        fetchStablecoinChains(),
        fetchDexOverview(),
        fetchFeesOverview()
      ]);

      if (tvlResult.error || !tvlResult.data) {
        throw new Error(`TVL fetch failed: ${tvlResult.error}`);
      }

      if (stablecoinResult.error || !stablecoinResult.data) {
        throw new Error(`Stablecoin fetch failed: ${stablecoinResult.error}`);
      }

      const tvlData = tvlResult.data;
      const stablecoinData = stablecoinResult.data;

      const majorChains = tvlData
        .filter(chain => chain.tvl > 100_000_000)
        .slice(0, 20)
        .map(chain => chain.name);

      let dexVolumeData = new Map<string, number>();
      let feesData = new Map<string, number>();

      if (dexResult.data) {
        const aggregatedVolumes = aggregateDexVolumeByChain(dexResult.data.protocols);
        for (const [chain, volume] of aggregatedVolumes.entries()) {
          dexVolumeData.set(chain, volume);
        }
      }

      if (feesResult.data) {
        const aggregatedFees = aggregateFeesbyChain(feesResult.data.protocols);
        for (const [chain, fees] of aggregatedFees.entries()) {
          feesData.set(chain, fees);
        }
      }

      const chainSpecificVolumes = await fetchChainDexVolumes(majorChains);
      const chainSpecificFees = await fetchChainFees(majorChains);

      for (const [chain, volume] of chainSpecificVolumes.entries()) {
        const normalizedChain = normalizeChainName(chain);
        if (volume > 0) {
          dexVolumeData.set(normalizedChain, volume);
        }
      }

      for (const [chain, fees] of chainSpecificFees.entries()) {
        const normalizedChain = normalizeChainName(chain);
        if (fees > 0) {
          feesData.set(normalizedChain, fees);
        }
      }

      const rawMetrics = calculateMetrics(tvlData, stablecoinData, dexVolumeData, feesData);
      const sanitizedMetrics = sanitizeMetrics(rawMetrics);

      setChainMetrics(sanitizedMetrics);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching chain metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    chainMetrics,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}