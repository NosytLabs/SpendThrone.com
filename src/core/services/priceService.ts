import { SYMBOL_TO_MINT } from '../../core/constants/tokens';
import { JUPITER_PRICE_BASE, getRpcUrl, isHeliusAvailable } from '../../core/constants/endpoints';
import { debugWarn } from '../../shared/utils/logger';
import { apiService } from '@/core/api-service';

class PriceService {
  private priceCache: Map<string, { price: number; timestamp: number }>;
  private cacheExpiry: number;
  private heliusRpcUrl: string;
  private apiKey: string;
  private symbolToMint: Record<string, string>;
  private pendingRequests: Map<string, Promise<number>>;

  constructor() {
    this.priceCache = new Map();
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
    const data = await apiService.get<JupiterResponse>(url, { headers });
    return data.data?.[id]?.price || 0;
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
        const data = await apiService.post<HeliusAssetResponse, typeof body>(this.heliusRpcUrl, body);
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