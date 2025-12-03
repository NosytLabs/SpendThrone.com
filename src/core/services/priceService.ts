import { SYMBOL_TO_MINT } from '../../core/constants/tokens';
import { JUPITER_PRICE_BASE, getRpcUrl, isHeliusAvailable, COINGECKO_PRICE_API } from '../../core/constants/endpoints';
import { debugWarn, debugLog } from '../../shared/utils/logger';
import { apiClient } from './apiClient';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
  source: 'jupiter' | 'coingecko' | 'helius' | 'fallback';
}

export interface CoinGeckoPriceResponse {
  solana?: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
  };
}

class PriceService {
  private priceCache: Map<string, { price: number; timestamp: number }>;
  private priceDataCache: Map<string, { data: PriceData; timestamp: number }>;
  private cacheExpiry: number;
  private heliusRpcUrl: string;
  private apiKey: string;
  private symbolToMint: Record<string, string>;
  private pendingRequests: Map<string, Promise<number>>;

  constructor() {
    this.priceCache = new Map();
    this.priceDataCache = new Map();
    this.cacheExpiry = 30000; // 30 seconds
    this.heliusRpcUrl = getRpcUrl();
    this.apiKey =
      import.meta.env.VITE_JUPITER_API_KEY ||
      (import.meta as unknown as { env?: { REACT_APP_JUPITER_API_KEY?: string } })?.env?.REACT_APP_JUPITER_API_KEY ||
      '';
    this.symbolToMint = SYMBOL_TO_MINT;
    this.pendingRequests = new Map();
  }

  private isApiKeyValid(): boolean {
    const key = String(this.apiKey || '').trim();
    if (!key) return false;
    const lower = key.toLowerCase();
    const looksPlaceholder = lower.includes('your') && lower.includes('key');
    return !looksPlaceholder;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.isApiKeyValid()) {
      headers['x-api-key'] = this.apiKey;
    }
    return headers;
  }

  private normalizeId(idOrMint: string): string {
    const key = String(idOrMint).toUpperCase();
    return this.symbolToMint[key] || idOrMint;
  }

  /**
   * Get comprehensive SOL price data (price, change, volume, market cap)
   */
  async getSolPrice(): Promise<PriceData> {
    const cacheKey = 'sol_price_data';
    const cached = this.priceDataCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Try CoinGecko first for rich data
    try {
      const coingeckoResponse = await apiClient.get<CoinGeckoPriceResponse>(`${COINGECKO_PRICE_API}?ids=solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
      if (coingeckoResponse?.solana?.usd) {
        const priceData: PriceData = {
          symbol: 'SOL',
          price: coingeckoResponse.solana.usd,
          change24h: coingeckoResponse.solana.usd_24h_change || 0,
          volume24h: coingeckoResponse.solana.usd_24h_vol || 0,
          marketCap: coingeckoResponse.solana.usd_market_cap || 0,
          lastUpdated: Date.now(),
          source: 'coingecko',
        };
        
        this.priceDataCache.set(cacheKey, { data: priceData, timestamp: Date.now() });
        // Also update simple price cache
        this.priceCache.set(`${this.symbolToMint['SOL']}_USD`, { price: priceData.price, timestamp: Date.now() });
        
        return priceData;
      }
    } catch (error) {
      debugLog('CoinGecko API failed, trying fallbacks');
    }

    // Fallback to simple price fetch (Helius/Jupiter)
    const price = await this.getTokenPrice('SOL');
    
    const fallbackData: PriceData = {
      symbol: 'SOL',
      price: price || 150.00, // Ultimate fallback
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now(),
      source: price > 0 ? (isHeliusAvailable() ? 'helius' : 'jupiter') : 'fallback',
    };

    this.priceDataCache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
    return fallbackData;
  }

  async getTokenPrice(tokenIdOrMint: string): Promise<number> {
    const normalizedId = this.normalizeId(tokenIdOrMint);
    const cacheKey = `${normalizedId}_USD`;

    const cached = this.priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.price;
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) ?? 0;
    }

    const pricePromise = this.fetchAndCachePrice(normalizedId);
    this.pendingRequests.set(cacheKey, pricePromise);

    try {
      return await pricePromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchAndCachePrice(normalizedId: string): Promise<number> {
    let price = 0;

    if (isHeliusAvailable()) {
      try {
        const heliusPrice = await this.getHeliusTokenPrice(normalizedId);
        if (heliusPrice) {
          price = heliusPrice;
        }
      } catch (heliusError) {
        debugWarn('Helius price fetch failed:', heliusError);
      }
    }

    if (!price && this.isApiKeyValid()) {
      try {
        price = await this.getJupiterPrice(normalizedId);
      } catch (jupiterError) {
        debugWarn('Jupiter price fetch failed as fallback:', jupiterError);
      }
    }

    if (price > 0) {
      this.priceCache.set(`${normalizedId}_USD`, { price, timestamp: Date.now() });
    }

    return price;
  }

  private async getJupiterPrice(id: string): Promise<number> {
    const url = `${JUPITER_PRICE_BASE}?ids=${id}`;
    const headers = this.getHeaders();
    type JupiterResponse = { data?: Record<string, { price?: number }> };
    const data = await apiClient.get<JupiterResponse>(url, { headers });
    return Number(data.data?.[id]?.price) || 0;
  }

  private async getHeliusTokenPrice(tokenMint: string): Promise<number | null> {
    if (!isHeliusAvailable()) return null;

    const body = {
        jsonrpc: '2.0',
        id: 'helius-price',
        method: 'getAsset',
        params: { 
          id: tokenMint,
          displayOptions: {
            showFungibleTokens: true
          }
        },
    };

    try {
        type HeliusAssetResponse = { result?: { token_info?: { price_info?: { price_per_token?: number } } } };
        const data = await apiClient.post<HeliusAssetResponse, typeof body>(this.heliusRpcUrl, body);
        return data.result?.token_info?.price_info?.price_per_token || null;
    } catch (error) {
        debugWarn(`Helius API unavailable, falling back`, error);
        return null;
    }
  }

  async getMultipleTokenPrices(tokenIdsOrMints: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    const pricePromises = tokenIdsOrMints.map(id => this.getTokenPrice(id));
    const results = await Promise.all(pricePromises);

    tokenIdsOrMints.forEach((id, index) => {
      prices[this.normalizeId(id)] = results[index] || 0;
    });

    return prices;
  }
}

export const priceService = new PriceService();
export default priceService;
