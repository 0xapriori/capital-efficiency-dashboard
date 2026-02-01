export default function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-text-secondary mt-4 text-lg">Loading capital efficiency data...</p>
        <p className="text-text-secondary text-sm mt-2">Fetching data from DeFiLlama API</p>
      </div>
    </div>
  );
}