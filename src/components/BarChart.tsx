import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChartProps } from '../types';
import { formatValue, getEfficiencyColor } from '../utils/formatters';

export default function EfficiencyBarChart({ data, metric, limit = 15, title }: BarChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => Number(b[metric]) - Number(a[metric]))
      .slice(0, limit)
      .map(item => ({
        chain: item.chain,
        value: Number(item[metric]),
        fullData: item
      }));
  }, [data, metric, limit]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-text-primary font-semibold">{data.chain}</p>
          <p className="text-text-secondary">
            {title}: <span className="font-bold">{formatValue(data.value, 'decimal2')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number) => {
    if (metric === 'stablecoinTurnover') {
      return getEfficiencyColor(value);
    }
    return '#3B82F6';
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-gray-700">
      <div className="mb-4">
        <h3 className="text-text-primary text-lg font-semibold">{title}</h3>
        <p className="text-text-secondary text-sm">
          Top {limit} chains ranked by {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              tickFormatter={(value) => formatValue(value, 'decimal2')}
              stroke="#9CA3AF"
              fontSize={11}
            />
            <YAxis
              dataKey="chain"
              type="category"
              width={70}
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(Number(entry.value))}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}