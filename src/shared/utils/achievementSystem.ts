import { UserData, Achievement } from './types';

// Achievement Definitions
const AVAILABLE_ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 1,
    name: 'Novice Contributor',
    description: 'Made your first tribute to the throne.',
    icon: 'coin',
    rarity: 'common'
  },
  {
    id: 2,
    name: 'Loyal Subject',
    description: 'Completed 5 or more tributes.',
    icon: 'scroll',
    rarity: 'common'
  },
  {
    id: 3,
    name: 'Royal Patron',
    description: 'Contributed over $100 in total value.',
    icon: 'coin',
    rarity: 'rare'
  },
  {
    id: 4,
    name: 'Dedicated Follower',
    description: 'Maintained a 3-day contribution streak.',
    icon: 'calendar',
    rarity: 'rare'
  },
  {
    id: 5,
    name: 'High Roller',
    description: 'Made a single tribute worth over $500.',
    icon: 'gem',
    rarity: 'epic'
  },
  {
    id: 6,
    name: 'Whale',
    description: 'Contributed over $1,000 in total value.',
    icon: 'crown',
    rarity: 'epic'
  },
  {
    id: 7,
    name: 'Legend of the Court',
    description: 'Reached the Top 10 on the Leaderboard.',
    icon: 'trophy',
    rarity: 'legendary'
  },
  {
    id: 8,
    name: 'God-King',
    description: 'Claimed the #1 Rank on the Leaderboard.',
    icon: 'crown',
    rarity: 'legendary'
  }
];

/**
 * Calculates unlocked achievements based on user data.
 * Note: In a real app, 'unlockedAt' would come from the DB. 
 * Here we simulate it based on current stats.
 */
export const calculateAchievements = (userData: UserData): Achievement[] => {
  const unlocked: Achievement[] = [];

  // 1. Novice Contributor (Total Transactions >= 1)
  if (userData.totalTransactions >= 1) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[0],
      unlockedAt: userData.joinedDate // Assume unlocked on join/first tx
    });
  }

  // 2. Loyal Subject (Total Transactions >= 5)
  if (userData.totalTransactions >= 5) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[1],
      unlockedAt: userData.lastActive // Approximation
    });
  }

  // 3. Royal Patron (Total Contributed >= 100)
  if (userData.totalContributed >= 100) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[2],
      unlockedAt: userData.lastActive
    });
  }

  // 4. Dedicated Follower (Streak >= 3)
  if (userData.stats.currentStreak >= 3 || userData.stats.longestStreak >= 3) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[3],
      unlockedAt: userData.lastActive
    });
  }

  // 5. High Roller (Largest Contribution >= 500)
  if (userData.stats.largestContribution >= 500) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[4],
      unlockedAt: userData.lastActive
    });
  }

  // 6. Whale (Total Contributed >= 1000)
  if (userData.totalContributed >= 1000) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[5],
      unlockedAt: userData.lastActive
    });
  }

  // 7. Legend of the Court (Rank <= 10)
  if (userData.rank !== null && userData.rank <= 10) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[6],
      unlockedAt: userData.lastActive
    });
  }

  // 8. God-King (Rank === 1)
  if (userData.rank === 1) {
    unlocked.push({
      ...AVAILABLE_ACHIEVEMENTS[7],
      unlockedAt: userData.lastActive
    });
  }

  return unlocked;
};
