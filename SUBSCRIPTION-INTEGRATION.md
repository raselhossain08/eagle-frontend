# Eagle Frontend - Subscription & Plan Management Integration

## 🚀 Overview

This document outlines the complete integration between the Eagle Frontend and Eagle Backend for subscription and plan management. The frontend now has full dynamic connectivity with all backend APIs.

## 📁 Project Structure

```
eagle-frontend/
├── src/
│   ├── lib/
│   │   └── services/
│   │       ├── core/
│   │       │   └── api-client.ts          # Centralized API client with auth & error handling
│   │       ├── api/
│   │       │   ├── subscription.ts        # Complete subscription API integration
│   │       │   ├── plan.ts               # Full plan management API
│   │       │   ├── contracts.ts          # Contract management (existing)
│   │       │   ├── functions.ts          # Functions API (existing)
│   │       │   └── user.ts               # User management (existing)
│   │       └── index.ts                  # Service exports
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── subscription-plan-dashboard.tsx  # Main dashboard component
│   │   └── subscription/
│   │       ├── subscription-manager.tsx          # Original component
│   │       └── subscription-manager-enhanced.tsx # Enhanced component
│   └── app/
│       └── (dashboard)/
│           ├── plans/page.tsx            # Plans management page
│           ├── subscriptions/page.tsx    # Subscription management page
│           └── test-api/page.tsx         # API connection testing page
```

## 🔧 Core Services

### API Client (`api-client.ts`)
- **Centralized HTTP client** using Axios
- **Automatic authentication** with JWT tokens
- **Error handling** with retry logic
- **Request/response interceptors**
- **TypeScript-first** with proper typing

```typescript
import { api } from '@/lib/services/core/api-client';

// Simple API calls with built-in error handling
const plans = await api.get('/plans/public');
const subscription = await api.post('/subscription/update', { subscription: 'Diamond' });
```

### Subscription Service (`subscription.ts`)
Complete integration with all backend subscription endpoints:

#### User Endpoints
- `getSubscriptionStatus()` - Get current user's subscription status
- `getUserSubscriptions()` - Get user's subscription history
- `updateSubscription()` - Update user's subscription level
- `scheduleDowngrade()` - Schedule subscription downgrade
- `cancelDowngrade()` - Cancel scheduled downgrade

#### Admin Endpoints (require admin permissions)
- `getAllSubscriptions()` - Get all subscriptions with pagination
- `getSubscriptionAnalytics()` - Get subscription analytics and metrics
- `createSubscription()` - Create new subscription
- `getExpiringSoon()` - Get subscriptions expiring soon
- `getDueForRenewal()` - Get subscriptions due for renewal
- `cancelSubscription()` - Cancel subscription (admin)
- `reactivateSubscription()` - Reactivate subscription (admin)
- `suspendSubscription()` - Suspend subscription (admin)
- `resumeSubscription()` - Resume subscription (admin)
- `pauseSubscription()` - Pause subscription (admin)
- `processRenewal()` - Process subscription renewal (admin)

### Plan Service (`plan.ts`)
Full integration with backend plan management:

#### Public Endpoints (no auth required)
- `getPublicPlans()` - Get all active plans for public display
- `getPublicPlanById()` - Get specific plan details

#### Protected Endpoints (admin only)
- `getAllPlans()` - Get all plans with filtering and pagination
- `getPlanStats()` - Get plan statistics and analytics
- `createPlan()` - Create new plan
- `updatePlan()` - Update existing plan
- `deletePlan()` - Delete plan (soft/permanent)
- `togglePlanFeatured()` - Toggle featured status
- `togglePlanPopular()` - Toggle popular status
- `reorderPlans()` - Reorder plans by sortOrder
- `duplicatePlan()` - Duplicate existing plan
- `getPlansByCategory()` - Get plans by category
- `getPlansByType()` - Get plans by type

#### Helper Functions
- `formatPlanPrice()` - Format plan pricing display
- `getPlanDisplayName()` - Get plan display name
- `planHasFeature()` - Check if plan has specific feature
- `comparePlans()` - Sort/compare plans
- `filterPlans()` - Filter plans by criteria
- `getRecommendedPlans()` - Get plan recommendations

## 🎨 Components

### Subscription Plan Dashboard
**File:** `subscription-plan-dashboard.tsx`

A comprehensive dashboard that displays:
- **User subscription status** with current plan and features
- **Analytics cards** showing subscription metrics (admin only)
- **Recent subscription activity**
- **Expiring subscriptions alerts**
- **Available plans grid**
- **Quick action buttons**

**Features:**
- Automatic role detection (shows admin data if user has permissions)
- Graceful error handling for unauthorized access
- Real-time data with loading states
- Responsive design for all screen sizes

### Enhanced Subscription Manager
**File:** `subscription-manager-enhanced.tsx`

Advanced subscription management with:
- **Current subscription display** with features and billing info
- **Subscription change interface** with plan selection
- **Downgrade scheduling** with effective date management
- **Active subscriptions list** with billing details
- **Available plans showcase** with feature comparison
- **Payment integration** for plan upgrades

**New Features:**
- Schedule downgrades for end of billing cycle
- Cancel scheduled downgrades
- View all user subscriptions with billing info
- Integration with checkout system for upgrades

## 🚦 API Testing

### Test Page
**File:** `test-api/page.tsx`

A dedicated testing page that verifies:
- ✅ **Public API connection** (should always work)
- ⚠️ **Authenticated API connection** (requires login)
- ⚙️ **Environment configuration**
- 🔧 **Error handling**

**Usage:**
1. Navigate to `/dashboard/test-api`
2. Click "Run API Tests"
3. Review results for any connection issues

## 🔐 Authentication & Authorization

### Token Management
- JWT tokens stored in cookies via `CookieManager`
- Automatic token refresh on API calls
- Redirect to login on token expiration
- Role-based access control for admin features

### Permission Levels
- **Public:** Access to public plans and general information
- **Authenticated:** Access to personal subscription management
- **Admin:** Full access to analytics, user management, and plan administration

## 🎯 Usage Examples

### Basic Subscription Check
```typescript
import { getSubscriptionStatus } from '@/lib/services';

const checkUserSubscription = async () => {
  try {
    const status = await getSubscriptionStatus();
    console.log(`User has ${status.subscription} subscription`);
    console.log(`Available features:`, status.features);
  } catch (error) {
    console.error('User not logged in or subscription check failed');
  }
};
```

### Plan Management
```typescript
import { getPublicPlans, formatPlanPrice } from '@/lib/services';

const displayPlans = async () => {
  try {
    const plans = await getPublicPlans();
    
    plans.forEach(plan => {
      console.log(`${plan.displayName}: ${formatPlanPrice(plan, 'monthly')}/month`);
      console.log(`Features: ${plan.features.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to load plans');
  }
};
```

### Admin Analytics
```typescript
import { getSubscriptionAnalytics, getPlanStats } from '@/lib/services';

const loadAdminDashboard = async () => {
  try {
    const [subscriptionData, planData] = await Promise.all([
      getSubscriptionAnalytics(),
      getPlanStats()
    ]);
    
    console.log(`Total Revenue: $${subscriptionData.data.revenue.total}`);
    console.log(`Active Plans: ${planData.data.activePlans}`);
  } catch (error) {
    console.error('Admin access required');
  }
};
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API URL

# Optional
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000  # Frontend URL
NODE_ENV=development                            # Environment
DEBUG=true                                      # Enable debug logging
```

### API Client Configuration
```typescript
// In api-client.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,           // 30 seconds
  RETRY_ATTEMPTS: 3,        // Retry failed requests 3 times
  RETRY_DELAY: 1000,        # 1 second delay between retries
};
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Test API Connection
1. Navigate to `http://localhost:3000/dashboard/test-api`
2. Click "Run API Tests" 
3. Verify all connections are working

### 5. Access Dashboard
- **Plans Dashboard:** `http://localhost:3000/dashboard/plans`
- **Subscriptions:** `http://localhost:3000/dashboard/subscriptions`
- **Main Dashboard:** `http://localhost:3000/dashboard`

## 🐛 Troubleshooting

### Common Issues

#### "Network Error - please check your connection"
- ✅ Verify backend is running on the configured port
- ✅ Check `NEXT_PUBLIC_API_URL` environment variable
- ✅ Ensure no CORS issues between frontend and backend

#### "Authentication failed - please login again"
- ✅ User needs to log in
- ✅ JWT token may be expired
- ✅ Check backend authentication middleware

#### "Access denied - insufficient permissions"
- ✅ User doesn't have admin role for admin-only endpoints
- ✅ Check backend RBAC middleware configuration

#### TypeScript Errors
- ✅ Run `npm run build` to check for type errors
- ✅ Ensure all service imports use correct paths
- ✅ Verify API response types match backend models

### Debug Mode
Enable debug logging:
```bash
# In .env.local
DEBUG=true
```

This will log all API requests and responses to the browser console.

## 🎉 Features Summary

### ✅ Completed Integration
- 🔐 **Authentication & Authorization** - JWT token management with role-based access
- 📊 **Subscription Management** - Full CRUD operations for user and admin
- 📦 **Plan Management** - Complete plan lifecycle with pricing and features  
- 📈 **Analytics Dashboard** - Real-time metrics and insights (admin)
- 🛒 **Payment Integration** - Seamless checkout flow for plan upgrades
- ⏰ **Subscription Scheduling** - Downgrade scheduling and management
- 🧪 **API Testing** - Built-in connection and functionality testing
- 📱 **Responsive Design** - Mobile-first responsive components
- ⚡ **Performance** - Optimized API calls with caching and retry logic
- 🔍 **Error Handling** - Comprehensive error management with user feedback

### 🔄 Dynamic Features
- Real-time subscription status updates
- Automatic plan recommendation based on features
- Live pricing with currency formatting  
- Subscription lifecycle management (pause, suspend, reactivate)
- Admin analytics with growth metrics and revenue tracking
- Bulk operations for plan management
- Advanced filtering and search capabilities

The system is now **fully connected and ready for production use** with comprehensive error handling, authentication, and a complete feature set for subscription and plan management.