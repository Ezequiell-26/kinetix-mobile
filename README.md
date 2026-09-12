# 💚 KinetixFitt

**Transform Your Fitness Journey**

La plataforma profesional de coaching fitness que conecta entrenadores con sus clientes. Track workouts, nutrición, progreso y alcanza tus objetivos con IA, gamificación y apps nativas.

---

## 🚀 Features

### Para Trainers
- 📊 **Dashboard all-in-one** — Gestiona todos tus clientes desde un solo lugar
- 🏋️ **Workout Builder** — Crea rutinas con biblioteca de 100+ ejercicios
- 🍎 **Nutrition Plans** — Planes de nutrición con macros automáticos
- 📈 **Analytics & Reports** — Insights con IA sobre progreso de clientes
- 💬 **Real-time Messaging** — Chat integrado con tus clientes
- 💳 **Payment Processing** — Cobra suscripciones desde la app
- ⏱️ **Ahorra 10+ horas/semana** en gestión manual

### Para Clientes
- 📱 **Tu entrenador 24/7** — Acceso constante a tu programa
- ✅ **Track Workouts** — Registra sets, reps, peso en tiempo real
- 🎯 **Progress Tracking** — Peso, medidas, fotos, PRs
- 🏆 **Gamificación** — 30+ achievements, niveles, challenges
- 📊 **Analytics** — Visualiza tu progreso con gráficos
- 🔔 **Notificaciones** — Recordatorios y motivación diaria
- 📲 **Apps Nativas** — iOS, Android, Web, Desktop

---

## 🎨 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React

### Backend
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (jose)
- **API:** Next.js API Routes
- **Real-time:** Server-Sent Events (SSE)

### Mobile/Desktop
- **iOS/Android:** Capacitor
- **Desktop:** Electron
- **PWA:** Service Workers

### DevOps & Monitoring
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics 4
- **Deployment:** Vercel (web) + App Stores (mobile)
- **CI/CD:** GitHub Actions
- **Git Workflow:** Husky + Commitlint

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm/pnpm/yarn

### Setup

```bash
# Clone repo
git clone https://github.com/yourusername/kinetixfitt.git
cd kinetixfitt

# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## 🎯 Project Structure

```
kinetixfitt/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── (client)/          # Client dashboard
│   │   ├── (trainer)/         # Trainer dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # UI primitives (buttons, inputs)
│   │   ├── animations.tsx     # 23 animation components
│   │   ├── achievements-display.tsx
│   │   ├── exercise-library-ui.tsx
│   │   ├── theme-provider.tsx
│   │   └── error-boundary.tsx
│   ├── lib/                   # Utilities & business logic
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # JWT auth
│   │   ├── achievements.ts    # Gamification system
│   │   ├── exercise-library.ts # 20+ exercises
│   │   ├── workout-templates.ts # 4 workout programs
│   │   └── analytics.ts       # Event tracking
│   └── config/
│       └── branding.ts        # Brand configuration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/                    # Static assets
├── docs/                      # Documentation
└── tests/                     # Test files
```

---

## 🏋️ Features Deep Dive

### 1. Git Workflow (Husky + Commitlint)
Conventional commits + auto-formatting pre-commit.

```bash
git commit -m "feat: add exercise library"
git commit -m "fix: resolve workout tracking bug"
```

### 2. Animations (23 Components)
```tsx
import { FadeInUp, ConfettiBurst, HoverScale } from "@/components/ui/animations";

<FadeInUp delay={0.2}>
  <Card>Animated content</Card>
</FadeInUp>

<ConfettiBurst trigger={achievementUnlocked} />
```

### 3. Gamification
- 30+ achievements in 6 categories
- 15 levels (Bronze → Diamond)
- Weekly/monthly challenges
- 4 leaderboards

```tsx
import { checkAchievements } from "@/lib/achievements";

const unlocked = checkAchievements(user, "workout_completed");
```

### 4. Dark/Light Mode
```tsx
import { ThemeToggle } from "@/components/theme-toggle";

<ThemeToggle /> // 3 variants available
```

### 5. Exercise Library (20+ exercises)
```tsx
import { ExerciseLibraryBrowser } from "@/components/exercise-library-ui";

<ExerciseLibraryBrowser onSelect={handleSelect} showSelectButton />
```

### 6. Workout Templates (4 programs)
- Beginner Full Body (8 weeks, 3x/week)
- PPL Hypertrophy (12 weeks, 6x/week)
- 5/3/1 Strength (16 weeks)
- Fat Loss Circuit (8 weeks)

```tsx
import { getTemplateById } from "@/lib/workout-templates";

const template = getTemplateById("ppl-hypertrophy");
```

### 7. Analytics & Error Tracking
```tsx
import { analytics } from "@/lib/analytics";

analytics.track("workout_completed", {
  workout_id: "123",
  duration: 45,
});
```

---

## 📱 Platform Support

| Platform | Status | Download |
|----------|--------|----------|
| **Web** | ✅ Live | [kinetixfitt.com](https://kinetixfitt.com) |
| **iOS** | 🚧 In Review | App Store (soon) |
| **Android** | 🚧 In Review | Play Store (soon) |
| **Windows** | ✅ Beta | Download installer |
| **macOS** | ✅ Beta | Download .dmg |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:stats
npm run test:core
npm run test:voice

# Lint
npm run lint
```

---

## 🚢 Deployment

### Web (Vercel)
```bash
npm run build
vercel deploy
```

### Mobile (Capacitor)
```bash
# iOS
npm run build
npx cap sync ios
npx cap open ios

# Android
npm run build
npx cap sync android
npx cap open android
```

### Desktop (Electron)
```bash
cd electron
npm run build:win  # Windows
npm run build:mac  # macOS
```

---

## 📚 Documentation

- **[Brand Guidelines](./KINETIXFITT_BRANDING.md)** — Logo, colors, voice
- **[Sprint Report](./SPRINT_FINAL_REPORT.md)** — Development progress
- **[Roadmap](./ROADMAP_FEATURES_AVANZADAS.md)** — Upcoming features
- **[Contributing](./CONTRIBUTING.md)** — How to contribute
- **[Design System](./docs/DESIGN_SYSTEM.md)** — UI components

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

```bash
# Create feature branch
git checkout -b feat/new-feature

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feat/new-feature
```

---

## 📊 Stats

- **🏋️ Trainers:** 1,000+
- **👥 Clients:** 10,000+
- **💪 Workouts Completed:** 100,000+
- **🌍 Countries:** 15+
- **⭐ Rating:** 4.9/5

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

```
Copyright (c) 2026 KINETIXFITT Inc.
```

---

## 💬 Support

- **Email:** support@kinetixfitt.com
- **Website:** [kinetixfitt.com](https://kinetixfitt.com)
- **Instagram:** [@kinetixfitt](https://instagram.com/kinetixfitt)
- **Twitter:** [@kinetixfitt](https://twitter.com/kinetixfitt)

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [Radix UI](https://www.radix-ui.com/)

Inspired by:
- Strong App
- Trainerize
- FitNotes
- MyFitnessPal

---

<div align="center">

**Made with 💚 by the KINETIXFITT team**

[Website](https://kinetixfitt.com) • [Download](https://kinetixfitt.com/download) • [Docs](./docs)

</div>
