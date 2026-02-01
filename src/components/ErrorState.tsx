interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠</div>
        <h2 className="text-text-primary text-xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-text-secondary mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
        <p className="text-text-secondary text-sm mt-4">
          If the problem persists, DeFiLlama API may be experiencing issues.
        </p>
      </div>
    </div>
  );
}