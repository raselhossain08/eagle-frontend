# Environment Variables Documentation

This document explains all environment variables used in the Eagle Investors frontend application.

## Required Environment Variables

### Application Configuration
- `NODE_ENV`: Application environment (development/production)
- `NEXT_PUBLIC_APP_NAME`: Application name for branding

### API Configuration
- `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g., http://localhost:5000/api)

### Authentication & Security
- `JWT_SECRET`: JWT secret key (must match backend configuration)
- `NEXTAUTH_URL`: NextAuth.js canonical URL
- `NEXTAUTH_SECRET`: NextAuth.js secret key

### Payment Gateway Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payment processing
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: PayPal client ID for PayPal payments
- `NEXT_PUBLIC_PAYPAL_SDK_URL`: PayPal SDK URL (default: https://www.paypal.com/sdk/js)

### Third-party Services
- `NEXT_PUBLIC_WORDPRESS_URL`: WordPress site URL for integration
- `NEXT_PUBLIC_WORDPRESS_DISCLAIMER_URL`: WordPress disclaimer page URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for PDF storage

### Contact Information
- `NEXT_PUBLIC_CONTACT_EMAIL`: Contact email for support/inquiries

### YouTube Integration
- `NEXT_PUBLIC_YOUTUBE_THUMBNAIL_BASE_URL`: YouTube thumbnail base URL
- `NEXT_PUBLIC_YOUTUBE_BASE_URL`: YouTube video base URL

### Frontend URLs
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend application URL
- `NEXT_PUBLIC_PRODUCTION_URL`: Production frontend URL

### Database
- `NEXT_PUBLIC_DATABASE_NAME`: Database name for client-side operations

## Environment Files

1. `.env` - Default environment variables
2. `.env.local` - Local development overrides (not committed to git)
3. `.env.production` - Production environment variables
4. `.env.example` - Template file with placeholder values

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Update the values with your actual configuration
3. For local development, create `.env.local` with local overrides
4. For production, update `.env.production` with production values

## Security Notes

- Never commit sensitive keys to git
- Use different keys for development and production
- Keep JWT_SECRET consistent between frontend and backend
- Use HTTPS URLs in production

## Development vs Production

### Development
- Use test/sandbox keys for Stripe and PayPal
- API URL points to local backend (http://localhost:5000/api)
- Frontend URL points to localhost (http://localhost:3000)

### Production
- Use live keys for payment gateways
- API URL points to production backend
- Frontend URL points to production domain
- Enable security headers and optimizations

## Changes Made

All hardcoded URLs have been replaced with environment variables:
- PayPal SDK URLs now use `NEXT_PUBLIC_PAYPAL_SDK_URL`
- WordPress URLs use `NEXT_PUBLIC_WORDPRESS_URL` and `NEXT_PUBLIC_WORDPRESS_DISCLAIMER_URL`
- Contact emails use `NEXT_PUBLIC_CONTACT_EMAIL`
- YouTube URLs use YouTube environment variables
- All API calls use `NEXT_PUBLIC_API_URL`
