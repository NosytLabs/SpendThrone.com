# 🏰 SpendThrone Site Documentation

> **Version:** 1.3.0  
> **Last Updated:** 2025-12-02  
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
    *   `GradientButton`: Primary actions (Pay Tribute). Gold gradient.
    *   `EnhancedButton`: Secondary actions with hover effects.
    *   `GlassButton`: Tertiary/Navigational with backdrop blur.
*   **Cards** (`Card.tsx`, `EnhancedCard.tsx`):
    *   `RoyalCard`: High emphasis, gold/accent borders.
    *   `GlassCard`: Content containers, backdrop blur, subtle borders.
    *   `GlowCard`: Interactive stats, hover glow effects.
    *   `ShimmerCard`: Achievements, special items with shimmer animation.
*   **Icons** (`RoyalIcon.tsx`):
    *   Wrapper around `lucide-react` icons.
    *   Variants: `crown`, `trophy`, `diamond`, `sword`, `scroll`, etc.
    *   Supports standardized sizing and coloring.

#### Feedback & Loading
*   **Skeletons** (`Skeleton.tsx`, `LeaderboardSkeleton.tsx`):
    *   `Skeleton`: Base component for loading states (rect, circle, text).
    *   `SkeletonCard`: Pre-built card loading state.
    *   `SkeletonTable`: Loading state for leaderboard/tables.
    *   `LeaderboardSkeleton`: Full page loading layout for Leaderboard.
*   **Toasts** (`EnhancedToast.tsx`, `use-toast.ts`):
    *   Custom notification system with "Royal" styling.
    *   Types: `success`, `error`, `info`, `royal` (Gold).
*   **Spinners** (`LoadingSpinner.tsx`):
    *   Lottie-based animations for high-fidelity loading states.

#### Animations (`AnimationUtilities.tsx`)
*   `EntranceAnimation`: Fade-in/Slide-up for page loads.
*   `BounceAnimation`: Micro-interactions on icons.
*   `ConfettiAnimation`: Celebration on payment/copy.
*   `GlowPulse`: Attention-grabbing pulse effect.
*   `ShimmerEffect`: Loading or premium item effect.

### 3.3 Typography & Spacing
*   **Fonts**: `Cinzel` (Headings), `Inter` (Body), `JetBrains Mono` (Data).
*   **Spacing**: Follows `SPACING_SYSTEM.md` (4px base unit).
*   **Theme**: Dark Mode "Midnight Royal".
    *   Bg: `#0f172a` (Slate 900)
    *   Primary: `#eab308` (Gold)
    *   Secondary: `#a855f7` (Purple)
    *   Success: `#22c55e` (Green)
    *   Error: `#ef4444` (Red)

---

## 4. Feature Documentation ⚙️

### 4.1 Dynamic Leaderboard
*   **Spec**: Ranks determined solely by `totalUsdValue` (descending).
*   **Update Freq**: Real-time (Optimistic UI) + Polling (every 30s).
*   **Dependencies**: `useLeaderboard` hook, `apiService`.
*   **Source**: `src/features/leaderboard/`

### 4.2 Payment System
*   **Spec**: Solana (SOL) transfers + Jupiter Swap (SPL Tokens).
*   **Integration**: `@solana/wallet-adapter`, Jupiter Ultra API.
*   **Logic**: `User Balance` += `Tx Amount` * `Price`.
*   **Fallback**: If RPC fails, switches to "Degraded Mode" (Read-only).
*   **Source**: `src/features/payment/`

### 4.3 Profile System
*   **Spec**: Hybrid data model (On-chain data + LocalStorage for settings/recent txs).
*   **Features**:
    *   **Tier Calculation**: Dynamic based on rank (Legendary = Top 10).
    *   **Achievements**: Unlocked based on streaks/amounts (Mock data currently).
    *   **Privacy**: Edit Display Name (Local only currently).
*   **Source**: `src/pages/Profile.tsx`, `src/features/profile/`

### 4.4 History Timeline
*   **Spec**: JSON-driven static content (`historyPageData.ts`).
*   **Features**: Client-side filtering (Era/Type) and Search (Regex-based).
*   **Animation**: `framer-motion` scroll reveals.
*   **Source**: `src/features/history/`

---

## 5. Status History Enhancement 🕰️

### 5.1 Version History (Changelog)
*   **v1.3.0 (Current)**:
    *   **Documentation**: Enhanced Component Library documentation.
    *   **Citations**: Added academic and external sources to About and History pages.
*   **v1.2.0**:
    *   **Documentation**: Comprehensive site docs added.
    *   **UI Polish**: Custom scrollbars, refined borders.
*   **v1.1.0**:
    *   **Content**: Digital Era added (Web2 Status, Absurd Luxury).
    *   **Citations**: External source links added.
*   **v1.0.0**:
    *   **Launch**: Leaderboard, Payment, Tiers, Referral.

### 5.2 Analytics Integration
*   **Metrics**:
    *   `Tribute Conversion Rate`: (Payments / Unique Visitors).
    *   `Time on History`: Engagement with educational content.
    *   `Referral Depth`: Avg users per referral chain.

---

## 6. Content Expansion Strategy 📝

### 6.1 Editorial Guidelines
*   **Tone**: Cynical, Grandiose, Satirical, Educational.
*   **Format**: "Fact + Punchline".
    *   *Bad*: "People bought expensive tulips."
    *   *Good*: "Merchants traded fortunes for flowers that would die in a week. The first meme coin."
*   **Sourcing**: All historical claims must cite a reputable source (Britannica, Museum, Academic).

### 6.2 Information Architecture
*   **Data Source**: `src/core/data/historyPageData.ts`
*   **Schema**:
    ```typescript
    interface HistoryCardData {
        id: string;
        year: string;
        title: string;
        description: string; // Supports HTML bolding
        statusType: 'luxury' | 'technology' | 'events' | 'architecture';
        tags: { label: string; colorClass: string }[];
        links: { label: string; url: string }[];
    }
    ```

---

## 7. Wireframes & UI Layouts 🖼️

### 7.1 Landing Page
```
+--------------------------------------------------+
| [Logo] [Leaderboard] [History] [Profile] [Wallet]| <-- Navigation
+--------------------------------------------------+
|                                                  |
|               CLAIM THE THRONE                   | <-- Hero
|      "Status is a zero-sum game. Play to win."   |
|                                                  |
|            [PAY TRIBUTE] [VIEW RANKINGS]         | <-- Primary CTAs
|                                                  |
+--------------------------------------------------+
|  Current King: 👑 WhaleKing (#1) - $50,000       | <-- King Display
+--------------------------------------------------+
|  [Top 3 Preview Cards: Silver | Gold | Bronze]   | <-- Leaderboard Preview
+--------------------------------------------------+
```

### 7.2 Profile Page
```
+--------------------------------------------------+
| [Name + Tier Badge]        [Share] [Edit] [Home] | <-- Header
| [Wallet Address + Copy]    [Joined Date]         |
+--------------------------------------------------+
| [Total $$$] [Rank #] [Streak] [Achievements #]   | <-- Stats Grid
+--------------------------------------------------+
| [Tabs: Overview | Achievements | History | ...]  | <-- Nav Tabs
+--------------------------------------------------+
| (Overview Tab)                                   |
| +-------------------+  +-----------------------+ |
| | Profile Info      |  | Rank Progress         | |
| | - Wallet: ...     |  | [========......] 60%  | |
| | - Tier: LEGENDARY |  | Next: Emperor         | |
| +-------------------+  +-----------------------+ |
+--------------------------------------------------+
```

---

## 8. User Stories & Acceptance Criteria ✅

### 8.1 Feature: Paying Tribute
*   **User Story**: As a **Competitive User**, I want to **pay SOL**, so that I can **increase my rank**.
*   **Acceptance Criteria**:
    *   [ ] Clicking "Pay Tribute" opens `PaymentModal`.
    *   [ ] Modal displays current SOL price.
    *   [ ] "Confirm" triggers wallet signature.
    *   [ ] Success toast appears on completion.
    *   [ ] Leaderboard updates optimistically.

### 8.2 Feature: Profile Management
*   **User Story**: As a **User**, I want to **view my stats**, so that I can **track my progress**.
*   **Acceptance Criteria**:
    *   [ ] `/profile` redirects to `/profile/:myAddress`.
    *   [ ] Stats (Rank, Total) match Leaderboard data.
    *   [ ] "Share" button copies link to clipboard.
    *   [ ] "Edit" allows changing Display Name (stored locally).

### 8.3 Feature: Referral System (Pyramid of Favor)
*   **User Story**: As a **Influencer**, I want to **share a referral link**, so that I can **earn "Divine Favor" (social points)**.
*   **Acceptance Criteria**:
    *   [ ] `/referral` displays the interactive pyramid visualization.
    *   [ ] "Copy Link" button generates a unique URL with `?ref=WALLET`.
    *   [ ] Dashboard shows correct "Subjects Recruited" count.
    *   [ ] "Divine Favor" points calculate correctly (100 * referrals).

---

## 9. Technical Constraints & Business Requirements 🔒

### 9.1 Technical Constraints
1.  **Solana RPC Limits**: Handles `429 Too Many Requests` via `DegradedModeContext`.
2.  **Client-Side State**: Hybrid of on-chain data and LocalStorage.
3.  **Browser Compatibility**: Animations (`framer-motion`) must degrade gracefully.

### 9.2 Business Requirements
1.  **Satirical Tone**: "Serious but absurd".
2.  **Revenue Model**: % fee from tributes (Future).
3.  **Legal**: "For Entertainment Purposes Only" disclaimers.
