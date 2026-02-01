import { ApiResponse } from '../types';

export async function fetchWithRetry<T>(
  url: string,
  retries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { data, error: null, timestamp: Date.now() };
    } catch (err) {
      if (i === retries - 1) {
        return { 
          data: null, 
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: Date.now()
        };
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return { data: null, error: "Max retries exceeded", timestamp: Date.now() };
}

export function handlePartialFailure(results: ApiResponse<any>[]): {
  data: any[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const data: any[] = [];
  
  results.forEach((result, index) => {
    if (result.error) {
      warnings.push(`API ${index} failed: ${result.error}`);
    } else if (result.data) {
      data.push(result.data);
    }
  });
  
  return { data, warnings };
}