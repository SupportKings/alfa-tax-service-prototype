/**
 * Sentry Server Configuration
 *
 * This file configures Sentry for server-side error tracking in Next.js.
 *
 * Setup Instructions:
 * 1. Install: bun add @sentry/nextjs
 * 2. Set SENTRY_DSN in .env (server-side, not public)
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

  // Capture unhandled promise rejections
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["error"],
    }),
  ],

  // Before sending, you can modify or drop the event
  beforeSend(event, hint) {
    // Example: Don't send expected errors
    const error = hint.originalException as Error;
    if (error?.message?.includes("Expected error")) {
      return null;
    }
    return event;
  },

  // Exclude certain routes from tracing
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/yourdomain\.com/,
  ],
});
*/

// Export empty for now - uncomment above after setup
export {};
