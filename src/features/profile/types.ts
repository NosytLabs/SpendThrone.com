/**
 * User Profile System
 * 
 * Profiles are stored off-chain (localStorage for now, Supabase later)
 * Only deposits/tributes are stored on-chain via Solana
 */

export interface UserProfile {
    walletAddress: string;
    username?: string;

    // Social links
    twitter?: string;
    discord?: string;
    website?: string;
    github?: string;

    // Display
    avatarUrl?: string;
    bio?: string;

    // Metadata
    createdAt: number;
    updatedAt: number;
}

export interface CreateProfileInput {
    walletAddress: string;
    username?: string;
    twitter?: string;
    discord?: string;
    website?: string;
    github?: string;
    avatarUrl?: string;
    bio?: string;
}

export interface UpdateProfileInput {
    username?: string;
    twitter?: string;
    discord?: string;
    website?: string;
    github?: string;
    avatarUrl?: string;
    bio?: string;
}
