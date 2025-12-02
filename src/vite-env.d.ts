/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HELIUS_RPC_URL: string
  readonly VITE_JUPITER_API_KEY: string
  readonly VITE_TREASURY_USDC_ACCOUNT: string
  readonly VITE_TREASURY_ADDRESS: string
  readonly VITE_TREASURY_WALLET: string
  readonly REACT_APP_HELIUS_RPC_URL: string
  readonly REACT_APP_JUPITER_API_KEY: string
  readonly REACT_APP_TREASURY_USDC_ACCOUNT: string
  readonly REACT_APP_TREASURY_WALLET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}