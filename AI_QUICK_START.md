# 🎯 START HERE - AI Quick Start Guide

Welcome! This guide will get any **AI (Qwen, Claude, GPT, etc.)** up to speed in 5 minutes.

---

## 🚀 What You Need to Know

### This is a **Monorepo** 
- **apps/mobile/** - Fitness app (web + iOS + Android + Electron)
- **apps/web/** - Trainer dashboard
- Both apps work independently but share infrastructure

### Your Mission
Make consistent improvements to the codebase that benefit both apps. Think of it as refactoring, optimizing, and polishing.

---

## 📖 Read These First (in order)

1. **[AI_CONTRIBUTION_GUIDE.md](./AI_CONTRIBUTION_GUIDE.md)** (15 min)
   - How to work without breaking things
   - Safe vs forbidden changes
   - Git workflow for IAs
   - Code examples

2. **[MONOREPO.md](./MONOREPO.md)** (10 min)
   - Project structure
   - How workspaces are organized
   - Running the apps locally

3. **[docs/API_REFERENCE.md](./docs/API_REFERENCE.md)** (reference)
   - All backend endpoints
   - Request/response schemas
   - Use this to understand data flow

---

## 🛠️ Quick Setup

### Clone & Install
```bash
git clone https://github.com/Ezequiell-26/kinetix-mobile.git
cd kinetix-mobile
npm install
```

### Analyze the Project
```bash
npx ts-node scripts/analyze-project.ts
```

This gives you:
- Project statistics
- File counts by type
- Areas that need improvement
- Recommendations

### Run Apps (Optional - for testing only)
```bash
# Terminal 1: Mobile app
npm run mobile

# Terminal 2: Web dashboard
npm run web
```

---

## 🎯 Common Improvement Patterns

### Pattern 1: Consolidate Duplicate Code
```
Problem: Same logic in apps/mobile/src/lib/X.ts and apps/web/src/lib/X.ts
Solution: Move to packages/shared/lib/X.ts, import in both
Risk: LOW (as long as you test both apps)
```

### Pattern 2: Optimize Components
```
Problem: Component re-renders unnecessarily
Solution: Add React.memo, useMemo, useCallback
Risk: LOW (visual behavior stays same)
```

### Pattern 3: Add TypeScript Types
```
Problem: Code uses 'any' or lacks types
Solution: Add proper interfaces/types
Risk: LOW (compilation error = caught immediately)
```

### Pattern 4: Extract Reusable Utilities
```
Problem: Util function only in one app
Solution: Move to packages/shared, import elsewhere
Risk: LOW (pure utility, no side effects)
```

---

## ✅ Before You Start, Remember

### DO ✅
- Test both apps work after your change
- Create feature branch: `git checkout -b feature/your-improvement`
- Write clear commit messages
- Make small, focused changes
- Read existing code patterns first

### DON'T ❌
- Modify auth system without testing
- Change database schema (Prisma)
- Delete migration files
- Modify API request/response structures without reason
- Force push to main/develop
- Break existing tests

---

## 🔄 Git Workflow

```bash
# 1. Create branch (always from develop)
git checkout develop
git pull origin develop
git checkout -b feature/your-improvement

# 2. Make your changes
# ... edit files ...

# 3. Commit with clear message
git add .
git commit -m "feat: what you changed and why"

# 4. Push
git push origin feature/your-improvement

# 5. Create PR on GitHub
# Go to: https://github.com/Ezequiell-26/kinetix-mobile
# Click "New Pull Request"
# Base: develop, Compare: your branch
# Add description of changes
```

---

## 💡 Where to Find Things

| What | Where |
|------|-------|
| User-facing pages | `apps/mobile/src/app/(client)/` |
| Trainer pages | `apps/mobile/src/app/(trainer)/` |
| API endpoints | `apps/mobile/src/app/api/` |
| React components | `apps/mobile/src/components/` |
| Business logic | `apps/mobile/src/lib/` |
| Database schema | `apps/mobile/prisma/schema.prisma` |
| Shared code | `packages/shared/` (currently empty - good opportunity!) |
| Tests | `apps/mobile/tests/` |
| Documentation | `docs/` |

---

## 🎓 Real Example: Consolidate Achievements Logic

### Current Situation
- `apps/mobile/src/lib/achievements.ts` (440 lines)
- `apps/web/src/utils/achievements.ts` (450 lines)
- Very similar but diverging slowly

### Plan
1. Compare both files
2. Extract common logic → `packages/shared/achievements.ts`
3. Import in both apps, add app-specific wrappers
4. Test both apps
5. Commit & PR

### Why This Works
- ✅ Low risk (pure utility)
- ✅ Improves both apps
- ✅ DRY principle
- ✅ Easier to maintain
- ✅ Good checkpoint example

---

## 🆘 If Something Goes Wrong

### Revert Last Commit
```bash
git revert HEAD
```

### Revert to Develop
```bash
git reset --hard origin/develop
```

### Stuck?
```bash
# Show what changed
git diff

# Show commit history
git log --oneline -5

# Show status
git status
```

---

## 📊 Metrics You Should Know

```javascript
// From running scripts/analyze-project.ts
Total Files: 850+
TypeScript Files: 450+
Components: 150+
API Routes: 20+
Test Files: 3+
```

---

## 🎪 Popular Improvement Ideas (Ordered by Difficulty)

### Easy (1-2 hours)
- [ ] Add missing TypeScript types
- [ ] Extract common component logic
- [ ] Improve error handling in API route
- [ ] Add JSDoc comments to utilities
- [ ] Consolidate similar functions

### Medium (2-4 hours)
- [ ] Extract shared utilities to packages/shared
- [ ] Optimize component performance (add React.memo)
- [ ] Improve CSS/Tailwind consistency
- [ ] Add more unit tests
- [ ] Refactor form components

### Advanced (4+ hours)
- [ ] Redesign component API
- [ ] Move logic from components to hooks
- [ ] Implement caching strategy
- [ ] Add analytics tracking
- [ ] Improve accessibility (a11y)

---

## 🚀 Status Check

Current state (September 12, 2026):
- ✅ Monorepo unified (both apps in one repo)
- ✅ npm workspaces configured
- ✅ Documentation complete
- ✅ API reference documented
- ✅ Both apps functional
- ✅ Git history preserved
- 🔄 Ready for AI improvements

---

## 📞 Navigation

- **Want detailed guidelines?** → Read [AI_CONTRIBUTION_GUIDE.md](./AI_CONTRIBUTION_GUIDE.md)
- **Need architecture info?** → Read [MONOREPO.md](./MONOREPO.md)
- **Looking for API docs?** → Read [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)
- **Analyze codebase?** → Run `npx ts-node scripts/analyze-project.ts`
- **Clone project?** → `git clone https://github.com/Ezequiell-26/kinetix-mobile.git`

---

## ✨ Quick Wins (Pick One!)

Try one of these small improvements to get started:

1. **Fix any `// TODO` comments** → Find and implement
2. **Add missing TypeScript types** → Search for `any` type
3. **Extract a small utility** → Move duplicate function to shared
4. **Improve error messages** → Make them clearer
5. **Add a missing JSDoc comment** → Document a complex function

Pick one, make it clean, test it, and create a PR. That's it!

---

**Happy coding! 🚀**

*This project is ready for any AI to improve. You have all the tools, docs, and guidelines. Now it's time to make it better!*
