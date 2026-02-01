import { MetricCardProps } from '../types';

export default function MetricCard({ label, value, subtext, trend, trendValue }: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{label}</p>
          <p className="text-text-primary text-2xl font-bold mt-1">{value}</p>
          {subtext && (
            <p className="text-text-secondary text-xs mt-1">{subtext}</p>
          )}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <span className="text-sm">{getTrendIcon()}</span>
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}