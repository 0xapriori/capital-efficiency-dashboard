import { ChainTVL, StablecoinChain, ChainMetrics, VALIDATION_RULES } from '../types';
import { normalizeChainName } from './chainMapping';

export function calculateMetrics(
  tvlData: ChainTVL[],
  stablecoinData: StablecoinChain[],
  dexVolumeData: Map<string, number>,
  feesData: Map<string, number>
): ChainMetrics[] {
  const metrics: ChainMetrics[] = [];
  
  for (const chain of tvlData) {
    const normalizedName = normalizeChainName(chain.name);
    
    const stablecoin = stablecoinData.find(
      s => normalizeChainName(s.name) === normalizedName
    );
    
    const tvl = chain.tvl || 0;
    const stablecoinMcap = stablecoin?.totalCirculatingUSD?.peggedUSD || 0;
    const dexVolume24h = dexVolumeData.get(normalizedName) || 0;
    const fees24h = feesData.get(normalizedName) || 0;
    
    if (tvl < VALIDATION_RULES.MIN_TVL || dexVolume24h === 0) continue;
    
    const chainMetrics: ChainMetrics = {
      chain: chain.name,
      tvl,
      stablecoinMcap,
      dexVolume24h,
      fees24h,
      stablecoinTurnover: stablecoinMcap > 0 ? dexVolume24h / stablecoinMcap : 0,
      tvlTurnover: dexVolume24h / tvl,
      feeYield: tvl > 0 ? (fees24h / tvl) * 365 * 100 : 0,
      volumePerTvl: dexVolume24h / tvl,
      stablecoinUtilization: tvl > 0 ? (stablecoinMcap / tvl) * 100 : 0
    };
    
    if (validateChainData(chainMetrics)) {
      metrics.push(chainMetrics);
    }
  }
  
  return metrics;
}

export function validateChainData(metrics: ChainMetrics): boolean {
  if (metrics.tvl < VALIDATION_RULES.MIN_TVL) return false;
  if (metrics.dexVolume24h < VALIDATION_RULES.MIN_DEX_VOLUME) return false;
  if (metrics.stablecoinTurnover > VALIDATION_RULES.MAX_STABLECOIN_TURNOVER) return false;
  if (metrics.tvl > VALIDATION_RULES.MAX_TVL) return false;
  if (metrics.stablecoinMcap > metrics.tvl * VALIDATION_RULES.MAX_STABLECOIN_TVL_RATIO) return false;
  
  return !isNaN(metrics.tvl) && 
         !isNaN(metrics.stablecoinTurnover) && 
         !isNaN(metrics.tvlTurnover) &&
         isFinite(metrics.tvl) && 
         isFinite(metrics.stablecoinTurnover) && 
         isFinite(metrics.tvlTurnover);
}

export function sanitizeMetrics(metrics: ChainMetrics[]): ChainMetrics[] {
  return metrics.filter(m => {
    if (m.tvl <= 0 || !isFinite(m.tvl)) return false;
    if (m.stablecoinTurnover < 0 || m.stablecoinTurnover > 1000) return false;
    if (m.feeYield < 0 || m.feeYield > 10000) return false;
    return true;
  });
}

export function aggregateDexVolumeByChain(protocols: any[]): Map<string, number> {
  const volumeByChain = new Map<string, number>();
  
  for (const protocol of protocols) {
    if (!protocol.total24h || !protocol.chains) continue;
    
    if (protocol.chains.length === 1) {
      const chain = normalizeChainName(protocol.chains[0]);
      const current = volumeByChain.get(chain) || 0;
      volumeByChain.set(chain, current + protocol.total24h);
    }
  }
  
  return volumeByChain;
}

export function aggregateFeesbyChain(protocols: any[]): Map<string, number> {
  const feesByChain = new Map<string, number>();
  
  for (const protocol of protocols) {
    if (!protocol.total24h || !protocol.chains) continue;
    
    if (protocol.chains.length === 1) {
      const chain = normalizeChainName(protocol.chains[0]);
      const current = feesByChain.get(chain) || 0;
      feesByChain.set(chain, current + protocol.total24h);
    }
  }
  
  return feesByChain;
}