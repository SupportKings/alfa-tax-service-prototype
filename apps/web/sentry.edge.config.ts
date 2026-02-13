/**
 * Sentry Edge Configuration
 *
 * This file configures Sentry for edge runtime (middleware, edge API routes).
 *
 * Setup Instructions:
 * 1. Install: bun add @sentry/nextjs
 * 2. Set SENTRY_DSN in .env
 * 3. Run: npx @sentry/wizard@latest -i nextjs
 *
 * Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

// Uncomment after installing @sentry/nextjs
/*
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Set environment
  environment: process.env.NODE_ENV,
});
*/

// Export empty for now - uncomment above after setup
export {};
