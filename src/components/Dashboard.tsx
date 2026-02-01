import { useState, useMemo } from 'react';
import { ChainMetrics } from '../types';
import { useChainMetrics } from '../hooks/useChainMetrics';
import { formatCurrency, formatDecimal, formatTimestamp } from '../utils/formatters';
import MetricCard from './MetricCard';
import DataTable from './DataTable';
import ScatterChart from './ScatterChart';
import BarChart from './BarChart';
import FilterBar from './FilterBar';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

export default function Dashboard() {
  const { chainMetrics, isLoading, error, lastUpdated, refresh } = useChainMetrics();
  const [sortColumn, setSortColumn] = useState<keyof ChainMetrics>('stablecoinTurnover');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'all' | 'top10tvl' | 'top10vol' | 'top10efficient'>('all');

  const handleSort = (column: keyof ChainMetrics) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...chainMetrics];
    
    switch (viewMode) {
      case 'top10tvl':
        filtered = filtered.sort((a, b) => b.tvl - a.tvl).slice(0, 10);
        break;
      case 'top10vol':
        filtered = filtered.sort((a, b) => b.dexVolume24h - a.dexVolume24h).slice(0, 10);
        break;
      case 'top10efficient':
        filtered = filtered.sort((a, b) => b.stablecoinTurnover - a.stablecoinTurnover).slice(0, 10);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [chainMetrics, viewMode]);

  const summaryMetrics = useMemo(() => {
    if (chainMetrics.length === 0) {
      return {
        totalTVL: 0,
        totalVolume: 0,
        averageTurnover: 0,
        topChain: null
      };
    }

    const totalTVL = chainMetrics.reduce((sum, chain) => sum + chain.tvl, 0);
    const totalVolume = chainMetrics.reduce((sum, chain) => sum + chain.dexVolume24h, 0);
    const averageTurnover = chainMetrics.reduce((sum, chain) => sum + chain.stablecoinTurnover, 0) / chainMetrics.length;
    const topChain = chainMetrics.sort((a, b) => b.stablecoinTurnover - a.stablecoinTurnover)[0];

    return {
      totalTVL,
      totalVolume,
      averageTurnover,
      topChain
    };
  }, [chainMetrics]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Capital Efficiency Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Real-time analysis of capital efficiency across blockchain networks
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total TVL"
            value={formatCurrency(summaryMetrics.totalTVL)}
            subtext={`Across ${chainMetrics.length} chains`}
          />
          <MetricCard
            label="Total DEX Volume"
            value={formatCurrency(summaryMetrics.totalVolume)}
            subtext="24h trading volume"
          />
          <MetricCard
            label="Average Efficiency"
            value={formatDecimal(summaryMetrics.averageTurnover, 3)}
            subtext="Avg stablecoin turnover"
          />
          <MetricCard
            label="Last Updated"
            value={lastUpdated ? formatTimestamp(lastUpdated) : 'Never'}
            subtext="Data freshness"
          />
        </div>

        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={refresh}
          lastUpdated={lastUpdated}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <ScatterChart
            data={filteredData}
            xAxis="stablecoinMcap"
            yAxis="dexVolume24h"
            sizeMetric="tvl"
            colorMetric="stablecoinTurnover"
          />
          <BarChart
            data={filteredData}
            metric="stablecoinTurnover"
            limit={10}
            title="Stablecoin Turnover Ranking"
          />
        </div>

        <div className="mb-8">
          <DataTable
            data={filteredData}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        <footer className="text-center py-8 border-t border-gray-700">
          <p className="text-text-secondary text-sm">
            Data provided by{' '}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-blue-400 transition-colors"
            >
              DeFiLlama API
            </a>
          </p>
          <p className="text-text-secondary text-xs mt-2">
            Capital efficiency metrics updated every 5 minutes • Built for educational purposes
          </p>
        </footer>
      </div>
    </div>
  );
}