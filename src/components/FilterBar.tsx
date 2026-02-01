
interface FilterBarProps {
  viewMode: "all" | "top10tvl" | "top10vol" | "top10efficient";
  onViewModeChange: (mode: "all" | "top10tvl" | "top10vol" | "top10efficient") => void;
  onRefresh: () => void;
  lastUpdated: number | null;
}

export default function FilterBar({ viewMode, onViewModeChange, onRefresh, lastUpdated }: FilterBarProps) {
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = Date.now();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    return new Date(lastUpdated).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const viewModes = [
    { key: 'all' as const, label: 'All Chains' },
    { key: 'top10tvl' as const, label: 'Top 10 TVL' },
    { key: 'top10vol' as const, label: 'Top 10 Volume' },
    { key: 'top10efficient' as const, label: 'Most Efficient' }
  ];

  return (
    <div className="bg-card p-4 rounded-lg border border-gray-700 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {viewModes.map(mode => (
            <button
              key={mode.key}
              onClick={() => onViewModeChange(mode.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-text-secondary hover:bg-slate-600 hover:text-text-primary'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-text-secondary text-sm">
            Last updated: {formatLastUpdated()}
          </div>
          <button
            onClick={onRefresh}
            className="bg-accent hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}