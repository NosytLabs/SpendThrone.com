import { Connection } from '@solana/web3.js';
import { getRpcUrl } from '../constants/endpoints';

type Endpoint = {
  url: string;
  name: string;
  priority: number;
  timeout: number;
  healthy?: boolean;
  lastHealthCheck?: number;
};

type PoolConfig = {
  endpoints: Endpoint[];
  healthCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
};

export class ConnectionPool {
  private endpoints: Endpoint[];
  private connections: Map<string, Connection> = new Map();
  private currentEndpoint: Endpoint | null = null;
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  private config: PoolConfig;

  constructor(config: PoolConfig) {
    this.config = config;
    this.endpoints = [...config.endpoints].sort((a, b) => a.priority - b.priority);
    // Initialize with the highest priority endpoint
    if (this.endpoints.length > 0) {
        this.currentEndpoint = this.endpoints[0];
    }
    this.initializeConnections();
    this.selectBestEndpoint(); // Fire and forget update
    this.startHealthChecks();
  }

  private initializeConnections(): void {
    this.endpoints.forEach(ep => {
      const conn = new Connection(ep.url, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 5000, // Reduced from ep.timeout
      });
      this.connections.set(ep.url, conn);
    });
  }

  private async healthCheck(ep: Endpoint): Promise<boolean> {
    const conn = this.connections.get(ep.url);
    if (!conn) return false;
    const start = performance.now();
    try {
      // Use getVersion or getGenesisHash which are lighter than getSlot sometimes, 
      // but getSlot is standard. We'll stick to getSlot but with a race timeout.
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
      const slotPromise = conn.getSlot('processed');
      
      await Promise.race([slotPromise, timeoutPromise]);
      
      const latency = performance.now() - start;
      // Consider healthy if latency is under 2000ms (was ep.timeout)
      ep.healthy = latency < 2000;
    } catch {
      ep.healthy = false;
    }
    ep.lastHealthCheck = Date.now();
    return !!ep.healthy;
  }

  private async selectBestEndpoint(): Promise<void> {
    // Check all endpoints in parallel to find a healthy one fast
    await Promise.all(this.endpoints.map(ep => this.healthCheck(ep)));
    
    const healthy = this.endpoints.find(ep => ep.healthy);
    if (healthy) {
        this.currentEndpoint = healthy;
    } else {
        // If none healthy, keep current or fallback to first
        if (!this.currentEndpoint) {
            this.currentEndpoint = this.endpoints[0] || null;
        }
    }
  }

  private startHealthChecks(): void {
    if (this.healthCheckTimer) return;
    this.healthCheckTimer = setInterval(async () => {
      await Promise.all(this.endpoints.map(e => this.healthCheck(e)));
      const prev = this.currentEndpoint?.url;
      await this.selectBestEndpoint();
      const next = this.currentEndpoint?.url;
      if (prev !== next) {
        // noop: consumers will read url via getHealthyRpcUrl
      }
    }, this.config.healthCheckInterval);
  }

  getConnection(): Connection {
    const url = this.currentEndpoint?.url || getRpcUrl();
    const conn = this.connections.get(url);
    if (conn) return conn;
    const fallback = new Connection(url, { commitment: 'confirmed' });
    this.connections.set(url, fallback);
    return fallback;
  }

  getUrl(): string {
    return this.currentEndpoint?.url || getRpcUrl();
  }

  stop(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }
}

export function createDefaultConnectionPool(): ConnectionPool {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const helius = env.VITE_HELIUS_RPC_URL;
  const solana = env.VITE_SOLANA_RPC_URL;
  const network = String(env.VITE_SOLANA_NETWORK || '').toLowerCase();
  const endpoints: Endpoint[] = [];

  // Validate Helius endpoint - exclude placeholder keys
  const heliusValid = (() => {
    if (!helius) return false;
    const lower = String(helius).toLowerCase();
    const looksPlaceholder = lower.includes('your') && lower.includes('key');
    return !looksPlaceholder;
  })();

  const defaultRpcUrl = network === 'devnet' ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com';

  if (heliusValid) {
    endpoints.push({ url: helius!, name: 'Helius', priority: 1, timeout: 30000 });
    if (helius !== defaultRpcUrl) {
      endpoints.push({ url: defaultRpcUrl, name: 'Default', priority: 3, timeout: 30000 });
    }
  } else if (solana && solana !== defaultRpcUrl) {
    endpoints.push({ url: solana, name: 'Custom RPC', priority: 2, timeout: 30000 });
    endpoints.push({ url: defaultRpcUrl, name: 'Default', priority: 3, timeout: 30000 });
  } else {
    endpoints.push({ url: defaultRpcUrl, name: 'Default', priority: 3, timeout: 30000 });
    // Add fallback public RPCs
    if (network !== 'devnet') {
        // DRPC is often reliable for free tier
        endpoints.push({ url: 'https://solana.drpc.org', name: 'DRPC', priority: 1, timeout: 30000 });
        // PublicNode has proven most reliable (200 OK) while others (Ankr, Extrnode, Mainnet-Beta) often return 403/401
        endpoints.push({ url: 'https://solana-rpc.publicnode.com', name: 'PublicNode', priority: 2, timeout: 30000 });
        // Ankr often returns 403 on free tier but sometimes works
        endpoints.push({ url: 'https://rpc.ankr.com/solana', name: 'Ankr', priority: 3, timeout: 30000 });
    }
  }

  return new ConnectionPool({ endpoints, healthCheckInterval: 30000, maxRetries: 3, retryDelay: 2000 });
}

let __pool: ConnectionPool | null = null;

export function getHealthyRpcUrl(): string {
  if (!__pool) __pool = createDefaultConnectionPool();
  return __pool.getUrl();
}

export function getPooledConnection(): Connection {
  if (!__pool) __pool = createDefaultConnectionPool();
  return __pool.getConnection();
}