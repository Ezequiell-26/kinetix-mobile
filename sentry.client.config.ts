import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  
  // Ignore errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "chrome-extension://",
    "moz-extension://",
    // Network errors that we can't control
    "NetworkError",
    "Failed to fetch",
    // Aborted requests
    "AbortError",
  ],
  
  // Before send hook to add user context
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    
    // Add user context if available
    if (typeof window !== "undefined" && window.localStorage) {
      const userEmail = localStorage.getItem("user-email");
      if (userEmail) {
        event.user = {
          ...event.user,
          email: userEmail,
        };
      }
    }
    
    return event;
  },
  
  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      // Route changes
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
