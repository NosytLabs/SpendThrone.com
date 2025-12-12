import { LeaderboardEntry } from "@/shared/utils/types";
import { getTierByUsd } from "@/shared/utils/tierSystem";

// Cache the mock data to ensure consistency across the app session
const STORAGE_KEY = "spendthrone_mock_leaderboard";

const loadFromStorage = (): LeaderboardEntry[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data: LeaderboardEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

let cachedMockData: LeaderboardEntry[] | null = loadFromStorage();

/**
 * Generate mock leaderboard data for development/testing
 */
export const generateMockLeaderboard = (
  count = 20,
  forceNew = false
): LeaderboardEntry[] => {
  if (cachedMockData && !forceNew && cachedMockData.length >= count) {
    return cachedMockData.slice(0, count);
  }

  // If we have cached data but it's not enough, we extend it
  const existingData = cachedMockData || [];
  const needed = count - existingData.length;

  if (needed <= 0 && !forceNew) {
    return existingData.slice(0, count);
  }

  const mockData: LeaderboardEntry[] = forceNew ? [] : [...existingData];

  const names = [
    "King Midas",
    "Queen Cleopatra",
    "Emperor Nero",
    "Tsar Peter",
    "Sultan Suleiman",
    "Pharaoh Ramses",
    "Caesar Augustus",
    "Alexander Great",
    "Genghis Khan",
    "Napoleon Bonaparte",
    "Louis XIV",
    "Henry VIII",
    "Catherine Great",
    "Frederick Great",
    "Elizabeth I",
    "Charlemagne",
    "Justinian",
    "Constantine",
    "Harun al-Rashid",
    "Saladin",
  ];

  const walletPrefixes = [
    "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "5KXxMwKEYEQdZGhVJMLLRmh6vBHzPZA8Dk1L6DjKgK2H",
    "3HG2sYgqEf9JkZKJqoBnFhj4eTmKkN8rPmQqVfWcXrYz",
    "8FfGpTtK2nLmQqRsTvUwXyZzAbCdEfGhIjKlMnOpQrSt",
  ];

  const messages = [
    "All hail the throne!",
    "Bow before royalty!",
    "The crown fits perfectly",
    "Long live the king!",
    "Royal spender extraordinaire",
    "Treasury awaits my tribute",
    "Gold flows through my veins",
    "The throne recognizes greatness",
    "Spend like a monarch",
    "Crown jewels of spending",
  ];

  const itemsToGenerate = count - mockData.length;

  for (let i = 0; i < itemsToGenerate; i++) {
    const currentIndex = mockData.length; // Current actual index for this new item
    const randomName = names[currentIndex % names.length];
    const randomPrefix =
      walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)];
    // Use a deterministic suffix based on index for consistency if we were to regenerate,
    // but random is fine since we cache.
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const walletAddress = randomPrefix + randomSuffix;
    const usdValue = Math.floor(Math.random() * 900000) + 100000; // $100K to $1M
    const tier = getTierByUsd(usdValue);
    const transactionCount = Math.floor(Math.random() * 50) + 1;
    const message = messages[Math.floor(Math.random() * messages.length)];

    // Generate a random timestamp within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const timeAgo = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    mockData.push({
      rank: currentIndex + 1,
      walletAddress,
      displayName: randomName,
      totalUsdValue: usdValue,
      tier,
      transactionCount,
      timeAgo,
      message,
      link: `https://solscan.io/account/${walletAddress}`,
    });
  }

  // Sort by value desc
  const sorted = mockData.sort((a, b) => b.totalUsdValue - a.totalUsdValue);

  // Update ranks after sort
  const ranked = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  cachedMockData = ranked;
  saveToStorage(ranked);

  return ranked;
};
