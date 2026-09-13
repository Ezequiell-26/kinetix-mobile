import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.1,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  
  // Server-specific settings
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    return event;
  },
});
