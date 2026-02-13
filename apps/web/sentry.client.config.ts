/**
 * Sentry Client Configuration
 *
 * This file configures Sentry for client-side error tracking.
 *
 * Setup Instructions:
 * 1. Install: bun add @sentry/nextjs
 * 2. Set NEXT_PUBLIC_SENTRY_DSN in .env
 * 3. Run: npx @sentry/wizard@latest -i nextjs
 *
 * Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

// Uncomment after installing @sentry/nextjs
/*
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Set environment
  environment: process.env.NODE_ENV,

  // Integration options
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    // Network errors
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    // User aborted
    "AbortError",
    "Request aborted",
    // Browser extensions
    "Extension context invalidated",
  ],

  // Don't send errors from these URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Firefox extensions
    /^moz-extension:\/\//i,
  ],
});
*/

// Export empty for now - uncomment above after setup
export {};
