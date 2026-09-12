import { isError } from '@sentry/core';

function isNotFoundNavigationError(subject) {
  return isError(subject) && ["NEXT_NOT_FOUND", "NEXT_HTTP_ERROR_FALLBACK;404"].includes(
    subject.digest
  );
}
function isRedirectNavigationError(subject) {
  return isError(subject) && typeof subject.digest === "string" && subject.digest.startsWith("NEXT_REDIRECT;");
}

export { isNotFoundNavigationError, isRedirectNavigationError };
//# sourceMappingURL=nextNavigationErrorUtils.js.map
