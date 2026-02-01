import { useMemo } from 'react';
import { DataTableProps, TABLE_COLUMNS, ChainMetrics } from '../types';
import { formatValue, getEfficiencyColor } from '../utils/formatters';

export default function DataTable({ data, sortColumn, sortDirection, onSort }: DataTableProps) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: keyof ChainMetrics) => {
    onSort(column);
  };

  const getSortIcon = (column: keyof ChainMetrics) => {
    if (column !== sortColumn) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getRowStyle = (metrics: ChainMetrics) => {
    if (metrics.stablecoinTurnover >= 0.2) return 'bg-green-900/20 border-green-700/30';
    if (metrics.stablecoinTurnover >= 0.1) return 'bg-yellow-900/20 border-yellow-700/30';
    return '';
  };

  return (
    <div className="bg-card rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-text-primary text-lg font-semibold">Chain Efficiency Metrics</h3>
        <p className="text-text-secondary text-sm mt-1">
          Click column headers to sort • Higher turnover = more efficient capital
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-slate-800/50">
              {TABLE_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-text-secondary text-sm font-medium cursor-pointer hover:text-text-primary transition-colors group"
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                  title={column.tooltip}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <span className="text-xs opacity-50 group-hover:opacity-100">
                      {getSortIcon(column.key)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((metrics) => (
              <tr
                key={metrics.chain}
                className={`border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors ${getRowStyle(metrics)}`}
              >
                <td className="px-4 py-3 text-text-primary font-medium">
                  {metrics.chain}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.tvl, 'currency')}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.stablecoinMcap, 'currency')}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.dexVolume24h, 'currency')}
                </td>
                <td className="px-4 py-3 font-mono">
                  <span 
                    className="font-bold"
                    style={{ color: getEfficiencyColor(metrics.stablecoinTurnover) }}
                  >
                    {formatValue(metrics.stablecoinTurnover, 'decimal2')}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.tvlTurnover, 'decimal2')}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.feeYield, 'percent')}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono">
                  {formatValue(metrics.stablecoinUtilization, 'percent')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          No data available
        </div>
      )}
    </div>
  );
}