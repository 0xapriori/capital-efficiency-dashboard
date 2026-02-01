import { 
  ChainTVL, 
  StablecoinChain, 
  DexOverview, 
  FeesOverview, 
  ApiResponse 
} from '../types';
import { fetchWithRetry } from './client';

const API_BASE = "https://api.llama.fi";
const STABLECOINS_BASE = "https://stablecoins.llama.fi";

export async function fetchChainTVL(): Promise<ApiResponse<ChainTVL[]>> {
  return fetchWithRetry<ChainTVL[]>(`${API_BASE}/v2/chains`);
}

export async function fetchStablecoinChains(): Promise<ApiResponse<StablecoinChain[]>> {
  return fetchWithRetry<StablecoinChain[]>(`${STABLECOINS_BASE}/stablecoinchains`);
}

export async function fetchDexOverview(): Promise<ApiResponse<DexOverview>> {
  return fetchWithRetry<DexOverview>(
    `${API_BASE}/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`
  );
}

export async function fetchFeesOverview(): Promise<ApiResponse<FeesOverview>> {
  return fetchWithRetry<FeesOverview>(
    `${API_BASE}/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`
  );
}

export async function fetchChainDexVolumes(chains: string[]): Promise<Map<string, number>> {
  const volumeMap = new Map<string, number>();
  
  const batchSize = 5;
  for (let i = 0; i < chains.length; i += batchSize) {
    const batch = chains.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (chain) => {
        const result = await fetchWithRetry<DexOverview>(
          `${API_BASE}/overview/dexs/${encodeURIComponent(chain)}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`
        );
        return { chain, volume: result.data?.total24h || 0 };
      })
    );
    
    results.forEach(({ chain, volume }) => {
      volumeMap.set(chain, volume);
    });
    
    if (i + batchSize < chains.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return volumeMap;
}

export async function fetchChainFees(chains: string[]): Promise<Map<string, number>> {
  const feesMap = new Map<string, number>();
  
  const batchSize = 5;
  for (let i = 0; i < chains.length; i += batchSize) {
    const batch = chains.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (chain) => {
        const result = await fetchWithRetry<FeesOverview>(
          `${API_BASE}/overview/fees/${encodeURIComponent(chain)}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`
        );
        return { chain, fees: result.data?.total24h || 0 };
      })
    );
    
    results.forEach(({ chain, fees }) => {
      feesMap.set(chain, fees);
    });
    
    if (i + batchSize < chains.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return feesMap;
}