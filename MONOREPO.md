# Monorepo Workflow Guide

## Overview

This is a monorepo containing two Next.js applications:
- **Mobile App** (`apps/mobile`) - Client-facing fitness app
- **Web Dashboard** (`apps/web`) - Trainer management dashboard

Both apps share utilities and can evolve independently while benefiting from shared code.

## Structure

```
kinetix/
├── apps/
│   ├── mobile/          # Mobile app (Capacitor + Electron)
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── next.config.mjs
│   └── web/             # Web dashboard
│       ├── src/
│       ├── prisma/
│       ├── package.json
│       └── next.config.ts
├── packages/
│   ├── shared/          # Shared components, utils, types
│   └── config/          # Shared configs (ESLint, Prettier, tsconfig)
└── package.json         # Root workspace config
```

## Installation

```bash
# Install all dependencies
npm install

# Or specific workspace
npm install -w apps/mobile
npm install -w apps/web
```

## Development

### Running Apps

Each app runs on a different port:

```bash
# Terminal 1: Mobile app (port 3001)
npm run mobile

# Terminal 2: Web dashboard (port 3000)  
npm run web
```

Or run both:
```bash
npm run dev
```

### Databases

Each app has its own database configured in `prisma/.env`:

- **Mobile**: `DATABASE_URL=file:./dev.db`
- **Web**: `DATABASE_URL=file:./dev.db`

To run migrations:

```bash
cd apps/mobile
npm run db:migrate

cd ../web
npm run db:migrate
```

## Building

```bash
# Build specific app
npm run mobile:build
npm run web:build

# Build all
npm run build
```

## Working with Shared Code

### Shared Utilities

Place common functions in `packages/shared/`:

```typescript
// packages/shared/utils/helpers.ts
export const calculateCalories = (workouts: Workout[]) => {
  // Shared logic
};
```

Import in both apps:

```typescript
// apps/mobile/src/components/stats.tsx
import { calculateCalories } from '@kinetix/shared';

// apps/web/src/components/analytics.tsx
import { calculateCalories } from '@kinetix/shared';
```

### Shared Components

Place reusable UI in `packages/shared/components/`:

```typescript
// packages/shared/components/Button.tsx
export const Button = ({ children, ...props }) => {
  // Shared button
};
```

## Git Workflow

### Branch Naming

```bash
# Feature
git checkout -b feature/new-analytics

# Bug fix
git checkout -b fix/workout-tracking

# Refactor
git checkout -b refactor/shared-types
```

### Testing Both Apps

Before pushing, test both apps work:

```bash
# Terminal 1
npm run mobile

# Terminal 2 (new terminal)
npm run web

# In both terminals, verify no errors
```

### Committing

```bash
git add .
git commit -m "feat: add shared achievement component"
git push origin feature/name
```

### Creating PRs

When creating a PR:
1. Clearly state which apps are affected
2. Note any shared code changes
3. Include testing steps for both apps

## Tips

- **Keep apps independent**: Changes in one app shouldn't break the other
- **Use shared code strategically**: Only move code to `packages/shared` if both apps use it
- **Test across apps**: Always verify changes don't break the other app
- **Clear commit messages**: Use conventional commits and mention affected apps

## Troubleshooting

### "Cannot find module" errors

```bash
# Rebuild shared packages
npm run build -w packages/shared

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database issues

```bash
# Reset database
rm apps/mobile/prisma/dev.db
rm apps/web/prisma/dev.db

# Re-run migrations
npm run db:migrate -w apps/mobile
npm run db:migrate -w apps/web
```

### Port already in use

If port 3000 or 3001 is in use:

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## CI/CD

Each app can have separate CI/CD:
- Mobile: Tests, build, deployment to app stores
- Web: Tests, build, deployment to Vercel

Both use the same codebase but deploy independently.
