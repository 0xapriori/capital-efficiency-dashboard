export const CHAIN_NAME_MAP: Record<string, string[]> = {
  "Ethereum": ["Ethereum", "ethereum", "ETH"],
  "Solana": ["Solana", "solana", "SOL"],
  "BSC": ["BSC", "BNB Chain", "Binance Smart Chain", "BNB", "bsc"],
  "Arbitrum": ["Arbitrum", "Arbitrum One", "arbitrum"],
  "Base": ["Base", "base"],
  "Polygon": ["Polygon", "Polygon POS", "polygon", "Matic"],
  "Avalanche": ["Avalanche", "AVAX", "avalanche"],
  "Optimism": ["Optimism", "optimism", "OP Mainnet"],
  "Tron": ["Tron", "TRON", "tron"],
  "Sui": ["Sui", "sui"],
  "Aptos": ["Aptos", "aptos"],
  "TON": ["TON", "ton", "Toncoin"],
  "Fantom": ["Fantom", "fantom", "FTM"],
  "zkSync Era": ["zkSync Era", "zksync", "zkSync"],
  "Mantle": ["Mantle", "mantle"],
  "Scroll": ["Scroll", "scroll"],
  "Blast": ["Blast", "blast"],
  "Linea": ["Linea", "linea"],
  "Mode": ["Mode", "mode"],
  "Sei": ["Sei", "sei"],
};

export function normalizeChainName(chainName: string): string {
  const name = chainName.trim();
  
  for (const [canonical, aliases] of Object.entries(CHAIN_NAME_MAP)) {
    if (aliases.some(alias => alias.toLowerCase() === name.toLowerCase())) {
      return canonical;
    }
  }
  
  return name;
}

export function findChainMatch(chainName: string, targetList: string[]): string | null {
  const normalizedInput = normalizeChainName(chainName);
  
  for (const target of targetList) {
    if (normalizeChainName(target) === normalizedInput) {
      return target;
    }
  }
  
  return null;
}