import type { UserProfile, CreateProfileInput, UpdateProfileInput } from './types';

const STORAGE_KEY = 'spendthrone_profiles';

/**
 * ProfileService
 * 
 * Handles CRUD operations for user profiles
 * Currently uses localStorage (can be swapped for Supabase/Firebase later)
 */
class ProfileService {
    private getAllProfiles(): Record<string, UserProfile> {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    private saveAllProfiles(profiles: Record<string, UserProfile>): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }

    /**
     * Get profile by wallet address
     */
    getProfile(walletAddress: string): UserProfile | null {
        const profiles = this.getAllProfiles();
        return profiles[walletAddress.toLowerCase()] || null;
    }

    /**
     * Create new profile
     */
    createProfile(input: CreateProfileInput): UserProfile {
        const profiles = this.getAllProfiles();
        const walletKey = input.walletAddress.toLowerCase();

        if (profiles[walletKey]) {
            throw new Error('Profile already exists for this wallet');
        }

        const now = Date.now();
        const profile: UserProfile = {
            walletAddress: input.walletAddress,
            username: input.username,
            twitter: input.twitter,
            discord: input.discord,
            website: input.website,
            github: input.github,
            avatarUrl: input.avatarUrl,
            bio: input.bio,
            createdAt: now,
            updatedAt: now,
        };

        profiles[walletKey] = profile;
        this.saveAllProfiles(profiles);

        return profile;
    }

    /**
     * Update existing profile
     */
    updateProfile(walletAddress: string, input: UpdateProfileInput): UserProfile {
        const profiles = this.getAllProfiles();
        const walletKey = walletAddress.toLowerCase();
        const existing = profiles[walletKey];

        if (!existing) {
            // Auto-create if doesn't exist
            return this.createProfile({ walletAddress, ...input });
        }

        const updated: UserProfile = {
            ...existing,
            ...input,
            updatedAt: Date.now(),
        };

        profiles[walletKey] = updated;
        this.saveAllProfiles(profiles);

        return updated;
    }

    /**
     * Delete profile
     */
    deleteProfile(walletAddress: string): boolean {
        const profiles = this.getAllProfiles();
        const walletKey = walletAddress.toLowerCase();

        if (!profiles[walletKey]) {
            return false;
        }

        delete profiles[walletKey];
        this.saveAllProfiles(profiles);
        return true;
    }

    /**
     * Check if username is available
     */
    isUsernameAvailable(username: string, currentWallet?: string): boolean {
        const profiles = this.getAllProfiles();
        const normalizedUsername = username.toLowerCase().trim();

        for (const [wallet, profile] of Object.entries(profiles)) {
            if (profile.username?.toLowerCase() === normalizedUsername) {
                // Allow current user to keep their username
                if (currentWallet && wallet === currentWallet.toLowerCase()) {
                    return true;
                }
                return false;
            }
        }

        return true;
    }

    /**
     * Get profile by username
     */
    getProfileByUsername(username: string): UserProfile | null {
        const profiles = this.getAllProfiles();
        const normalizedUsername = username.toLowerCase().trim();

        for (const profile of Object.values(profiles)) {
            if (profile.username?.toLowerCase() === normalizedUsername) {
                return profile;
            }
        }

        return null;
    }

    /**
     * Get all profiles (for leaderboard display names)
     */
    getAllProfilesMap(): Map<string, UserProfile> {
        const profiles = this.getAllProfiles();
        const map = new Map<string, UserProfile>();

        for (const [wallet, profile] of Object.entries(profiles)) {
            map.set(wallet, profile);
        }

        return map;
    }
}

// Export singleton instance
export const profileService = new ProfileService();
