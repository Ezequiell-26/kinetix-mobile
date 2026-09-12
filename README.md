# 🏋️ Kinetix - Unified Fitness Platform

**Monorepo** containing both the mobile app and web dashboard for Kinetix fitness coaching platform.

## 📁 Structure

```
kinetix/
├── apps/
│   ├── mobile/          # Next.js + Electron mobile app (Capacitor)
│   └── web/             # Next.js web dashboard
├── packages/
│   ├── shared/          # Shared components, utilities, types
│   └── config/          # Shared configuration (ESLint, Prettier, etc)
├── docs/                # Documentation
└── package.json         # Monorepo root configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies for all apps
npm install

# OR install specific app
npm -w apps/mobile install
npm -w apps/web install
```

### Development

```bash
# Run mobile app (on separate terminal)
npm run mobile

# Run web dashboard (on separate terminal)
npm run web

# Run both
npm run dev
```

### Building

```bash
# Build mobile app
npm run mobile:build

# Build web dashboard
npm run web:build

# Build all
npm run build
```

## 📱 Apps Overview

### Mobile App (`apps/mobile`)
- **Framework**: Next.js 14 + React 18
- **Desktop**: Electron (Windows/Mac/Linux)
- **Mobile**: Capacitor (iOS/Android)
- **Features**: Fitness coaching, workout tracking, AI coach, achievements
- **Start**: `npm run mobile`
- **More Info**: [Mobile README](./apps/mobile/README.md)

### Web Dashboard (`apps/web`)
- **Framework**: Next.js 14 + React 18
- **Purpose**: Trainer dashboard & client management
- **Features**: Analytics, client management, program creation, real-time stats
- **Start**: `npm run web`
- **More Info**: [Web README](./apps/web/README.md)

## 📦 Shared Packages

### `packages/shared`
Shared components, utilities, types, and constants used by both apps

### `packages/config`
Shared configuration files (ESLint, Prettier, TypeScript base)

## 🧪 Testing

```bash
# Run tests for all apps
npm run test

# Run tests for specific app
npm -w apps/mobile test
npm -w apps/web test
```

## 📚 Documentation

See individual app READMEs:
- [Mobile App README](./apps/mobile/README.md)
- [Web Dashboard README](./apps/web/README.md)

## 🔄 Workflow

1. **Feature Development**: Create branch from `develop`
2. **Testing**: Test both apps before merging
3. **Monorepo**: Ensure changes don't break other apps
4. **PR**: Create PR with both apps tested
5. **Merge**: Merge to `develop`, then to `main` for releases

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run all apps in dev mode |
| `npm run build` | Build all apps |
| `npm run test` | Run tests for all apps |
| `npm run lint` | Lint all apps |
| `npm run format` | Format code in all apps |
| `npm run mobile` | Run only mobile app |
| `npm run web` | Run only web dashboard |
| `npm run mobile:build` | Build only mobile app |
| `npm run web:build` | Build only web dashboard |
| `npm run clean` | Clean all dependencies and build artifacts |

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Test both apps
3. Commit changes: `git commit -m "feat: your feature"`
4. Push and create PR

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

- Ezequiel (Developer)
- Contributors welcome!

---

**Last Updated**: September 12, 2026
**Monorepo Status**: Active Unification (Qwen Enhancement Phase)
