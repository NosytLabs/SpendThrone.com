export const apiConfig = {
  jupiter: {
    price: 'https://api.jup.ag/price/v2',
    quote: 'https://api.jup.ag/swap/v1/quote',
    swap: 'https://api.jup.ag/swap/v1/swap'
  },
  coingecko: {
    price: 'https://api.coingecko.com/api/v3/simple/price',
    market: 'https://api.coingecko.com/api/v3/coins/markets'
  },
  leaderboard: '/api/leaderboard',
  fallback: {
    solPrice: 150.00,
    btcPrice: 42000.00,
    ethPrice: 2500.00
  }
};