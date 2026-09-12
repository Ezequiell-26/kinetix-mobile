// Re-export all shared utilities
export { cn, formatDate, formatTime, formatDateTime, formatDuration, getRelativeTime } from "@kinetix/shared/utils";
export { formatNumber, formatWeight, formatPercentage, formatXP } from "@kinetix/shared/utils";
export { calculateVolume, calculateWorkoutDuration, calculateBMI, calculateBMR, calculateTDEE, calculateOneRepMax, calculateProgress } from "@kinetix/shared/utils";
export { calculateLevel, calculateXPForLevel, calculateXPProgress, calculateTier, calculateStreak } from "@kinetix/shared/utils";
export { isValidEmail, isValidPassword } from "@kinetix/shared/utils";
export { saveToStorage, loadFromStorage, removeFromStorage } from "@kinetix/shared/utils";
export { buildURL, groupBy, sortBy, uniqueBy, omit, pick } from "@kinetix/shared/utils";
export { withTimeout, retry, debounce, throttle } from "@kinetix/shared/utils";

// Legacy re-export for backwards compatibility
export { cn as twMerge } from "@kinetix/shared/utils";
