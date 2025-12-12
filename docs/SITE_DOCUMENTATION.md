# 🏰 SpendThrone Site Documentation

> **Version:** 1.3.1  
> **Last Updated:** 2025-12-04  
> **Status:** Active Development  
> **Repository:** `SpendThrone.com`

---

## 1. User Flow 🗺️

### 1.1 Core Journey: "The Ascent to Status"
The primary user journey is designed to funnel users from curiosity to "paying tribute" (conversion) and then to "signaling" (retention).

**Step 1: Discovery (Landing)**
*   **Entry**: User lands on `Home (/)`.
*   **Hook**: "Claim the Throne" hero section + "King of the Hill" display.
*   **Decision Point**:
    *   *Curious?* → Navigates to `History` or `About`.
    *   *Confused?* → Navigates to `Getting Started` or `Help`.
    *   *Competitive?* → Navigates to `Leaderboard`.
    *   *Ready?* → Connects Wallet.

**Step 2: Education & Onboarding**
*   **Goal**: Validate the "Pay-to-Win" philosophy and setup technical prerequisites.
*   **Path A (Philosophy)**: User reads `About` -> Learns about "Veblen Goods" and "Handicap Principle".
*   **Path B (Technical)**: User visits `Getting Started` -> Installs Phantom -> Buys SOL -> Connects.

**Step 3: Conversion (Tribute)**
*   **Action**: User clicks "Pay Tribute" (Home) or "Climb Higher" (Leaderboard).
*   **Interaction**: `PaymentModal` opens.
*   **Transaction**: User confirms SOL/USDC transaction via Wallet.
*   **Feedback**: Success animation + Confetti + Toast notification.

**Step 4: Retention (Signaling)**
*   **Outcome**: User checks `Leaderboard` to see new rank.
*   **Reward**: User visits `Profile` to see unlocked Tiers, Badges, and Stats.
*   **Social**: User clicks "Share Profile" to post on Twitter/Discord.
*   **Loop**: User monitors rank; if overtaken, returns to Step 3.

### 1.2 Personas
| Persona | Motivation | Primary Workflow |
| :--- | :--- | :--- |
| **The Whale** | Dominance, Ego | `Home` → `Leaderboard` → `Pay Max` → `Profile` (Share) |
| **The Climber** | ROI, Recognition | `Leaderboard` (Analyze gaps) → `Pay Min to Overtake` → `Profile` (Track Progress) |
| **The Newbie** | Curiosity, confusion | `Home` → `Getting Started` → `Help` → `About` |
| **The Spectator** | Entertainment | `History` → `Leaderboard` (Watch battles) → `Discord` |
| **The Skeptic** | Irony/Satire | `About` → `History` (Read content) |

---

## 2. Page Content Requirements 📄

### 🏠 Home (`/`)
*   **Core Content**: Hero Headline, Current King Display, Top 3 Preview.
*   **CTAs**: "Pay Tribute" (Primary), "View Rankings" (Secondary).
*   **Interactive**: Live "King of the Hill" card updates.

### 🏆 Leaderboard (`/leaderboard`)
*   **Core Content**: Full ranking table (Rank, Wallet, Value, Tier).
*   **Features**: Search, Tier Filters (Emperor, King, Noble), "Overtake" calculators.
*   **CTAs**: "Climb Higher" (per row).
*   **States**: Loading (Skeleton), Error (Retry), Empty.

### 👤 Profile (`/profile/:address`)
*   **Core Content**: User Identity (Avatar, Name, Tier), Stats Grid (Total Contributed, Rank, Streak).
*   **Tabs**:
    *   *Overview*: Profile Info, Rank Progress Bar.
    *   *Achievements*: Unlocked badges (Common to Mythic).
    *   *History*: Transaction log with rank changes.
    *   *Analytics*: Contribution Trend graph, Statistics.
*   **Features**: Edit Profile (Modal), Share Profile (Clipboard), User Preferences.

### 📜 History (`/history`)
*   **Core Content**: Chronological timeline of status symbols (Ancient -> Future).
*   **Structure**: Era-based sections (Ancient, Medieval, Modern, Digital).
*   **Features**: Search, Category Filters (Luxury, Tech, Events), Source Index.
*   **CTAs**: "Claim Your Place in History" (Bottom conversion funnel).
*   **Components**: `TimelineItem` with rich text and citations.

### ℹ️ About (`/about`)
*   **Core Content**: "The Hypothesis" (Social Experiment), "The Royal Decree" (No Refunds), "The Science" (Veblen Goods).
*   **Visuals**: Two Pillars (Treasury, Divine Favor).
*   **Citations**: Links to academic concepts (Veblen, Zahavi).

### 🚀 Getting Started (`/getting-started`)
*   **Core Content**: 3-Step Guide (1. Get Wallet, 2. Buy SOL, 3. Pay Tribute).
*   **Interactive**: Accordion-style step details.

### ❓ Help (`/help`)
*   **Core Content**: FAQ (Withdrawals, Ranks, Tokens), Community Links (Twitter, Discord).
*   **Support**: Technical issue reporting info with status links.

### 👑 Tiers (`/tiers`)
*   **Core Content**: Explanation of the hierarchy (Rank 1 vs Rank 2-10 vs Masses).
*   **Visuals**: 3D/Animated cards for Emperor (Gold), King (Silver), Noble (Bronze).

### ⚠️ Referral (`/referral`)
*   **Core Content**: "Pyramid of Favor" visualization.
*   **Features**: Wallet-based referral link generator, Stats dashboard.

---

## 3. Layout Specifications 📐

### 3.1 Grid System
*   **Container**: `max-w-7xl` (1280px) centered.
*   **Breakpoints**:
    *   `sm`: 640px (Mobile)
    *   `md`: 768px (Tablet)
    *   `lg`: 1024px (Desktop)
    *   `xl`: 1280px (Wide)
*   **Columns**: 12-column grid for footer/dashboard, Single column for mobile flows.

### 3.2 Component Library (`src/components/ui`)
The application uses a comprehensive custom component library designed for the "Midnight Royal" theme.

#### Core Components
*   **Buttons** (`Button.tsx`, `EnhancedButton.tsx`):
    *   Variants: `primary`, `secondary`, `outline`, `ghost`, `royal`.
    *   Sizes: `sm`, `md`, `lg`.
*   **Cards** (`Card.tsx`):
    *   Variants: `default`, `elevated`, `outlined`, `glass`, `royal`.
    *   Interactive states with hover effects.
*   **Inputs** (`Input.tsx`):
    *   Custom styled inputs with focus rings and error states.
*   **Feedback**:
    *   `EnhancedToast.tsx`: Custom toast notifications with animations.
    *   `LoadingSpinner.tsx`: Lottie-based loading indicators.

---

## 4. Technical Architecture 🏗️

For detailed technical implementation, including:
*   **Crypto Architecture** (Solana, Jupiter, Wallets)
*   **Backend Integration** (Supabase, RPC)
*   **Feature Implementation** (Leaderboard logic, Payment flows)
*   **Project Structure**

Please refer to the **[Technical Architecture Guide](./TECHNICAL_ARCHITECTURE.md)**.
