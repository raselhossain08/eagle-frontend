// Export all API services
export * from './api/subscription';
export * from './api/plan';
export * from './api/contracts';
export * from './api/functions';
export * from './api/user';

// Export core services
export * from './core/api-client';
export * from './core/subscriberProfile.service';

// Re-export types for convenience
export type {
  Subscription,
  SubscriptionType,
  SubscriptionStatus,
  SubscriptionStatusResponse,
  SubscriptionAnalytics,
  CreateSubscriptionRequest,
} from './api/subscription';

export type {
  Plan,
  PlanStats,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanFilters,
} from './api/plan';

export type {
  ApiResponse,
  PaginatedResponse,
} from './core/api-client';

export type {
  SubscriberProfile,
  PersonalInfo,
  ContactInfo,
  Employment,
  FinancialProfile,
  KycStatus,
  ProfileCompletion,
  IdentityDocument,
} from './core/subscriberProfile.service';