export interface ChainTVL {
  gecko_id: string | null;
  tvl: number;
  tokenSymbol: string;
  cmcId: string | null;
  name: string;
  chainId: number | null;
}

export interface StablecoinChain {
  name: string;
  totalCirculatingUSD: {
    peggedUSD: number;
    peggedEUR?: number;
    peggedVAR?: number;
  };
}

export interface DexProtocol {
  name: string;
  displayName: string;
  module: string;
  category: string;
  chains: string[];
  total24h: number | null;
  total7d: number | null;
  total30d: number | null;
  totalAllTime: number | null;
  change_1d: number | null;
  change_7d: number | null;
  change_1m: number | null;
}

export interface DexOverview {
  totalDataChart: [number, number][];
  totalDataChartBreakdown: object;
  protocols: DexProtocol[];
  allChains: string[];
  total24h: number;
  total7d: number;
  change_1d: number;
  change_7d: number;
  chain: string | null;
}

export interface FeeProtocol {
  name: string;
  displayName: string;
  chains: string[];
  total24h: number | null;
  total7d: number | null;
  total30d: number | null;
  totalAllTime: number | null;
}

export interface FeesOverview {
  protocols: FeeProtocol[];
  allChains: string[];
  total24h: number;
  total7d: number;
  chain: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  timestamp: number;
}

export interface ChainMetrics {
  chain: string;
  tvl: number;
  stablecoinMcap: number;
  dexVolume24h: number;
  fees24h: number;
  stablecoinTurnover: number;
  tvlTurnover: number;
  feeYield: number;
  volumePerTvl: number;
  stablecoinUtilization: number;
}

export interface DashboardState {
  chainMetrics: ChainMetrics[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  sortColumn: keyof ChainMetrics;
  sortDirection: "asc" | "desc";
  filterMinTvl: number;
  selectedChains: string[];
  viewMode: "all" | "top10tvl" | "top10vol" | "top10efficient";
  scatterXAxis: keyof ChainMetrics;
  scatterYAxis: keyof ChainMetrics;
  useLogScale: boolean;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export interface DataTableProps {
  data: ChainMetrics[];
  sortColumn: keyof ChainMetrics;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof ChainMetrics) => void;
}

export interface ScatterChartProps {
  data: ChainMetrics[];
  xAxis: keyof ChainMetrics;
  yAxis: keyof ChainMetrics;
  sizeMetric: keyof ChainMetrics;
  colorMetric: keyof ChainMetrics;
}

export interface BarChartProps {
  data: ChainMetrics[];
  metric: keyof ChainMetrics;
  limit: number;
  title: string;
}

export interface TableColumn {
  key: keyof ChainMetrics;
  label: string;
  format: "text" | "currency" | "decimal2" | "percent";
  width: string;
  tooltip?: string;
}

export const VALIDATION_RULES = {
  MIN_TVL: 10_000_000,
  MIN_DEX_VOLUME: 100_000,
  MAX_STABLECOIN_TURNOVER: 100,
  MAX_TVL: 500_000_000_000,
  MAX_STABLECOIN_TVL_RATIO: 10,
} as const;

export const TABLE_COLUMNS: TableColumn[] = [
  { key: "chain", label: "Chain", format: "text", width: "15%" },
  { key: "tvl", label: "TVL", format: "currency", width: "12%" },
  { key: "stablecoinMcap", label: "Stable Mcap", format: "currency", width: "12%" },
  { key: "dexVolume24h", label: "DEX Vol 24h", format: "currency", width: "12%" },
  { 
    key: "stablecoinTurnover", 
    label: "SC Turnover", 
    format: "decimal2", 
    width: "12%",
    tooltip: "DEX Volume / Stablecoin Mcap. Higher = more active trading per dollar of stablecoins"
  },
  {
    key: "tvlTurnover",
    label: "TVL Turnover",
    format: "decimal2",
    width: "12%",
    tooltip: "DEX Volume / TVL. How many times TVL turns over daily"
  },
  {
    key: "feeYield",
    label: "Fee APY",
    format: "percent",
    width: "12%",
    tooltip: "Annualized fees as % of TVL"
  },
  {
    key: "stablecoinUtilization",
    label: "Stable/TVL",
    format: "percent",
    width: "13%",
    tooltip: "What % of TVL is stablecoins"
  },
];