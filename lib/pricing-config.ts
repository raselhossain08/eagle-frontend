// Shared pricing configuration for consistency across the application
export const PRICING_CONFIG = {
  infinity: {
    monthly: {
      price: 127,
      originalPrice: 187,
      discount: "32%",
      savings: 60
    },
    annual: {
      price: 1270,
      originalPrice: 2244,
      discount: "43%",
      savings: 974
    }
  },
  diamond: {
    monthly: {
      price: 76,
      originalPrice: 97,
      discount: "21%",
      savings: 21
    },
    annual: {
      price: 760,
      originalPrice: 1164,
      discount: "35%",
      savings: 404
    }
  }
} as const;

// Helper functions for price formatting
export const formatPrice = (price: number) => `$${price}`;
export const formatPriceWithPeriod = (price: number, period: 'monthly' | 'annual' = 'monthly') => 
  `$${price}/${period === 'monthly' ? 'month' : 'year'}`;

// Get pricing info for a specific plan and billing cycle
export const getPricingInfo = (plan: 'infinity' | 'diamond', billing: 'monthly' | 'annual' = 'monthly') => {
  return PRICING_CONFIG[plan][billing];
};
