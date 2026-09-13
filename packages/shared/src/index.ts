/**
 * KinetixFitt - Shared Library
 * Main entry point for shared types, utils, components, constants and domain models
 */

// Domain
export * from './domain';

// Types
export * from './types';

// Constants
export * from './constants';

// Utils
export * from './utils';

// Components (re-exported individually to avoid JSX issues in non-React files)
// Import components directly: import { Button } from '@kinetix/shared/components'
