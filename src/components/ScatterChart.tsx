import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScatterChartProps } from '../types';
import { formatCurrency, getEfficiencyColor } from '../utils/formatters';

export default function CapitalScatterChart({ 
  data, 
  xAxis = 'stablecoinMcap', 
  yAxis = 'dexVolume24h',
  sizeMetric = 'tvl',
  colorMetric = 'stablecoinTurnover'
}: ScatterChartProps) {
  
  const chartData = useMemo(() => {
    return data.map(item => ({
      x: Number(item[xAxis]),
      y: Number(item[yAxis]),
      z: Number(item[sizeMetric]),
      color: Number(item[colorMetric]),
      chainName: item.chain,
      ...item
    })).filter(item => item.x > 0 && item.y > 0);
  }, [data, xAxis, yAxis, sizeMetric, colorMetric]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-text-primary font-semibold">{data.chainName}</p>
          <p className="text-text-secondary">Stablecoin Mcap: {formatCurrency(Number(data.stablecoinMcap))}</p>
          <p className="text-text-secondary">DEX Volume: {formatCurrency(Number(data.dexVolume24h))}</p>
          <p className="text-text-secondary">TVL: {formatCurrency(Number(data.tvl))}</p>
          <p className="text-text-secondary">
            Efficiency: <span style={{ color: getEfficiencyColor(Number(data.stablecoinTurnover)) }}>
              {Number(data.stablecoinTurnover).toFixed(3)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const maxSize = Math.max(...chartData.map(d => Number(d.z)));
  const minSize = Math.min(...chartData.map(d => Number(d.z)));

  return (
    <div className="bg-card p-6 rounded-lg border border-gray-700">
      <div className="mb-4">
        <h3 className="text-text-primary text-lg font-semibold">Capital Efficiency Analysis</h3>
        <p className="text-text-secondary text-sm">
          Bubble size = TVL • Color = Stablecoin Turnover • Hover for details
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="x"
              type="number"
              scale="log"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              dataKey="y"
              type="number"
              scale="log"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={chartData}>
              {chartData.map((entry, index) => {
                const normalizedSize = 20 + (Number(entry.z) - minSize) / (maxSize - minSize) * 60;
                return (
                  <Cell 
                    key={`cell-${index}`}
                    fill={getEfficiencyColor(Number(entry.color))}
                    fillOpacity={0.7}
                    r={normalizedSize}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <span>X: Stablecoin Market Cap (log)</span>
        <span>Y: DEX Volume 24h (log)</span>
      </div>
    </div>
  );
}