export const OPPORTUNITY_COSTS = [
    { price: 1, label: "a pack of gum" },
    { price: 5, label: "a mediocre latte" },
    { price: 10, label: "a month of Spotify" },
    { price: 20, label: "40 Chicken Nuggets" },
    { price: 50, label: "a decent steak dinner" },
    { price: 100, label: "groceries for a week" },
    { price: 250, label: "AirPods Pro" },
    { price: 500, label: "a round-trip flight to Miami" },
    { price: 1000, label: "a used 2004 Honda Civic" },
    { price: 2500, label: "a high-end gaming PC" },
    { price: 5000, label: "an entry-level Rolex" },
    { price: 10000, label: "a year of rent in a Midwestern city" },
    { price: 50000, label: "a down payment on a house" },
    { price: 100000, label: "a college education (one degree)" },
    { price: 1000000, label: "your freedom" }
];

export const getOpportunityCost = (usdAmount: number): string => {
    // Find the most expensive item that is less than or equal to the amount
    // Or just calculate multiples of a funny item if it's small
    
    // Case 1: Direct comparison to a big ticket item
    const match = [...OPPORTUNITY_COSTS].reverse().find(item => usdAmount >= item.price);
    
    if (match && usdAmount < match.price * 1.5) {
        return match.label;
    }

    // Case 2: Multiples of smaller items (funnier for mid-range)
    // Default to Chicken Nuggets ($0.50 each approx) if no specific match feels right
    const nuggetCount = Math.floor(usdAmount / 0.5);
    return `${nuggetCount.toLocaleString()} Chicken Nuggets`;
};
