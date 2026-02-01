export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatDecimal(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEfficiencyColor(turnover: number): string {
  if (turnover >= 0.3) return "#22c55e";  // green-500
  if (turnover >= 0.15) return "#84cc16"; // lime-500
  if (turnover >= 0.08) return "#eab308"; // yellow-500
  if (turnover >= 0.04) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

export function formatValue(value: number, format: "text" | "currency" | "decimal2" | "percent"): string {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "decimal2":
      return formatDecimal(value, 2);
    case "percent":
      return formatPercent(value);
    case "text":
    default:
      return value.toString();
  }
}