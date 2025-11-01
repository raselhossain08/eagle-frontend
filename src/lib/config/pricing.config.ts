// Dynamic pricing configuration - now uses PlanService for real-time pricing
import planService from '../services/core/plan.service';

// Cache for pricing data to avoid repeated API calls
let pricingCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper functions for price formatting
export const formatPrice = (price: number) => `$${price}`;
export const formatPriceWithPeriod = (price: number, period: 'monthly' | 'annual' = 'monthly') => 
  `$${price}/${period === 'monthly' ? 'month' : 'year'}`;

// Get dynamic pricing info for a specific plan and billing cycle
export const getPricingInfo = async (planName: string, billing: 'monthly' | 'annual' = 'monthly') => {
  try {
    // Check cache
    const now = Date.now();
    if (pricingCache && (now - cacheTimestamp) < CACHE_DURATION) {
      const plan = pricingCache.find((p: any) => 
        p.name.toLowerCase() === planName.toLowerCase()
      );
      if (plan) {
        const pricingData = plan.pricing[billing];
        return {
          price: pricingData?.price || 0,
          originalPrice: pricingData?.originalPrice || pricingData?.price || 0,
          discount: pricingData?.discount || "0%",
          savings: (pricingData?.originalPrice || 0) - (pricingData?.price || 0)
        };
      }
    }

    // Fetch fresh data
    const subscriptionPlans = await planService.getSubscriptionPlans();
    pricingCache = subscriptionPlans;
    cacheTimestamp = now;
    
    const plan = subscriptionPlans.find((p: any) => 
      p.name.toLowerCase() === planName.toLowerCase()
    );
    
    if (plan) {
      const pricingData = plan.pricing[billing];
      return {
        price: pricingData?.price || 0,
        originalPrice: pricingData?.originalPrice || pricingData?.price || 0,
        discount: pricingData?.discount || "0%",
        savings: (pricingData?.originalPrice || 0) - (pricingData?.price || 0)
      };
    }
    
    throw new Error(`Plan ${planName} not found`);
  } catch (error) {
    console.error('Error fetching pricing info:', error);
    // Fallback to default values
    return {
      price: 0,
      originalPrice: 0,
      discount: "0%",
      savings: 0
    };
  }
};

// Legacy PRICING_CONFIG for backward compatibility - now deprecated
// @deprecated Use getPricingInfo() instead for dynamic pricing
export const PRICING_CONFIG = {
  infinity: {
    monthly: { price: 127, originalPrice: 187, discount: "32%", savings: 60 },
    annual: { price: 1270, originalPrice: 2244, discount: "43%", savings: 974 }
  },
  diamond: {
    monthly: { price: 76, originalPrice: 97, discount: "21%", savings: 21 },
    annual: { price: 760, originalPrice: 1164, discount: "35%", savings: 404 }
  }
} as const;
