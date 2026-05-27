export interface RateResponse {
  rate: number;
  lastUpdated: string; // ISO date string
  source: 'fred' | 'cache' | 'fallback' | 'user';
  error?: string;
}

const FALLBACK_RATE = 6.5; // 6.5% fallback if API completely fails and cache is empty
const CACHE_KEY = 'mortgage_rate_cache';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

interface CachedRate {
  rate: number;
  timestamp: number;
  dateStr: string;
}

/**
 * Fetches the latest 30-Year Fixed Rate Mortgage Average from FRED.
 * Since this runs on the client, it will need to either use a proxy/API route or the FRED API directly 
 * if CORS allows (FRED API requires an API key and usually doesn't allow client-side CORS directly).
 * 
 * For this production app, we assume we will hit an internal Next.js API route 
 * (`/api/rates`) to keep the FRED API key secret.
 */
export async function fetchMortgageRate(): Promise<RateResponse> {
  // Check local cache first
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed: CachedRate = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
          return {
            rate: parsed.rate,
            lastUpdated: parsed.dateStr,
            source: 'cache',
          };
        }
      } catch {
        // invalid cache, ignore
      }
    }
  }

  // Fetch from internal API route
  try {
    const response = await fetch('/api/rates');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update cache
    if (typeof window !== 'undefined' && data.rate) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        rate: data.rate,
        timestamp: Date.now(),
        dateStr: data.lastUpdated,
      }));
    }

    return {
      rate: data.rate,
      lastUpdated: data.lastUpdated,
      source: 'fred',
    };
  } catch (error) {
    console.error('Mortgage rate fetch error:', error);
    
    // Return stale cache if available
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed: CachedRate = JSON.parse(cached);
          return {
            rate: parsed.rate,
            lastUpdated: parsed.dateStr,
            source: 'cache',
            error: 'Failed to fetch latest rate, using cached value.',
          };
        } catch {}
      }
    }

    // Ultimate fallback
    return {
      rate: FALLBACK_RATE,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Rate service unavailable, using standard fallback rate.',
    };
  }
}
