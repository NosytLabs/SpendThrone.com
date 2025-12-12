<!-- srcbook:{"language":"typescript","tsconfig.json":"{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ES2022\",\n    \"moduleResolution\": \"node\",\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"strict\": true,\n    \"resolveJsonModule\": true,\n    \"allowSyntheticDefaultImports\": true,\n    \"forceConsistentCasingInFileNames\": true\n  }\n}"} -->

# SpendThrone System Decomposition

###### package.json

```json
{
  "type": "module",
  "dependencies": {}
}
```

# SpendThrone System Decomposition

Using the **Decomposition** mental model, we break down SpendThrone into its independent functional units.

## 1. The Client Layer (Optimistic)
- **Responsibility**: User interaction, wallet connection, optimistic feedback.
- **Key Components**:
    - `PaymentForm`: Handles user input and validation.
    - `usePayment`: Orchestrates the transaction flow.
    - `useLeaderboard`: Displays the state (optimistically updated).
- **Interface**:
    - `payTribute(amount, token)` -> Returns `signature`
    - `fetchLeaderboard()` -> Returns `LeaderboardData[]`

## 2. The Blockchain Layer (Truth)
- **Responsibility**: Settlement, value transfer, immutable record.
- **Key Components**:
    - **Treasury Wallet**: Receives funds.
    - **Jupiter Protocol**: Swaps tokens to USDC.
    - **Memo Program**: Stores referral metadata (`Ref: <pubkey>`).
- **Interface**:
    - `Solana Mainnet`: The ultimate source of truth.

## 3. The Intelligence Layer (Serverless)
- **Responsibility**: Indexing, valuation, aggregation.
- **Key Components**:
    - `api/webhooks/helius.ts`: The "Brain".
    - `Helius`: The eyes (sends transaction events).
    - `Jupiter Price API`: The valuer (provides USD rates).
- **Interface**:
    - `POST /webhooks/helius`: Receives `TransactionEvent[]`.
    - `GET /price/v2`: Returns `PriceData`.

## 4. The Persistence Layer (State)
- **Responsibility**: Long-term storage, querying.
- **Key Components**:
    - **Supabase (PostgreSQL)**
    - `leaderboard`: The aggregated state.
    - `transactions`: The raw ledger.
    - `referrals`: The social graph.


###### divine_favor.ts

```typescript
// We can simulate the "Divine Favor" calculation logic mentioned in schema.sql
// to verify our understanding of the hidden mechanics.

interface UserStats {
  referralCount: number;
  referralVolumeSol: number;
}

function calculateDivineFavor(stats: UserStats): number {
  const POINTS_PER_REFERRAL = 100;
  const POINTS_PER_SOL_VOLUME = 1000;

  return (stats.referralCount * POINTS_PER_REFERRAL) + 
         (stats.referralVolumeSol * POINTS_PER_SOL_VOLUME);
}

// Example Scenario
const userA: UserStats = {
  referralCount: 5,      // Referred 5 people
  referralVolumeSol: 10  // Those 5 people spent 10 SOL total
};

const favor = calculateDivineFavor(userA);
console.log(`Divine Favor Score: ${favor}`);

```
