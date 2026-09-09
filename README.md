# EZEQUIEL COACHING — Plataforma Premium de Entrenamiento Online

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Plataforma **premium, minimalista y blanca/negro** para coaching fitness 1:1. Mobile-first, PWA instalable en Android e iOS, con 37 rutas, 18 tablas y todo 100% funcional con DB real.

**Demo:** `https://ezequiel-coaching.vercel.app` • **Docs:** [`/docs`](./docs) • **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md)

---

## ✨ Features

| Módulo | Descripción |
|---|---|
| **Auth & Roles** | JWT httpOnly + bcrypt, TRAINER/CLIENT, middleware, RLS por `userId` |
| **Dashboard Trainer** | Clientes activos, check-ins, ingresos MRR, adherencia, churn risk, charts Recharts |
| **Clientes** | CRUD, búsqueda debounce, filtros, paginación, ficha con 6 tabs |
| **Programas** | Programa → Fase → Semana → Día → Ejercicio, superseries, reordenar, duplicar |
| **Entrenar** | Timer 90s, RIR/RPE, vibración, guardado real, sugerencia de progresión |
| **Biblioteca** | 10 ejercicios, filtros por músculo/equipamiento, video, sustituciones |
| **Progreso** | Peso, medidas, fuerza, fotos privadas con slider, export CSV/PDF |
| **Check-ins** | 8 preguntas 1-10 + fotos, notifica al trainer en <24h |
| **Mensajes** | Chat real con DB, fotos/archivos, optimistic UI, leído |
| **Nutrición VIP** | TDEE Mifflin-St Jeor, macros 2g/kg, agua, IMC, 1RM, hábitos |
| **Pagos** | Planes Básico/Personalizado/Premium, listo para Stripe/Mercado Pago |
| **PWA** | Instalable Android/iOS, offline cache, push listo, tema blanco/negro |

---

## 🚀 Quick Start

```bash
git clone https://github.com/ezequiel-coaching/ezequiel-coaching.git
cd ezequiel-coaching
npm install
cp .env.example .env # genera JWT_SECRET
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev # http://localhost:3001
```

**Demos:**
- Trainer: `ezequiel@ezequielcoaching.com` / `Admin123!`
- Clientes: `martin@demo.com` / `lucas@demo.com` / `sofia@demo.com` / `cliente123`

---

## 📁 Estructura

```
src/
  app/
    (auth)/login, register, forgot-password
    (client)/dashboard, workout, progress, nutrition, history, resources, ...
    (trainer)/dashboard, clients, workouts, analytics, ...
    api/auth, clients, checkins, messages, uploads, ...
  components/ui, analytics-charts, calorie-calculator, ...
  lib/db, auth, getClient, gamification
  hooks/use-debounce
prisma/schema.prisma (18 modelos, 15 índices)
public/manifest.json, icons, sw.js, uploads/
```

---

## 🛠 Stack

- **Framework:** Next.js 15 App Router, React 19, TypeScript 5
- **Style:** Tailwind 3, Inter + Space Grotesk, framer-motion, lucide-react
- **DB:** Prisma 6 + SQLite (dev) / Postgres (prod), 15 índices
- **Auth:** jose JWT + bcryptjs, httpOnly lax, 7d
- **Charts:** Recharts, **PWA:** next-pwa + Workbox

---

## 🔒 Seguridad

- Roles en middleware + RLS por `userId/clientId` en cada query
- Zod en todos los forms, no `any`, no `eval`
- Fotos privadas `isPrivate`, pagos sin guardar tarjeta, `secure` dinámico
- Rate limit listo, sanitización, no secretos en frontend

---

## 📱 PWA

Instalable: **Android** Chrome → ⋮ → Instalar | **iPhone** Safari → Compartir → Agregar al inicio  
Offline cache para entrenamientos, tema blanco/negro, haptics, 44px touch targets.

---

## 🤝 Contribuir

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) y [`docs/GIT_GUIDE.md`](./docs/GIT_GUIDE.md)

```bash
git checkout -b feat/nueva-feature
git commit -m "feat: descripción"
git push -u origin feat/nueva-feature
```

---

## 📄 Licencia

MIT — Ver [LICENSE](./LICENSE)
