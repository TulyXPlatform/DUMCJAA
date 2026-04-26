# Frontend Completion Plan (DUMCJAA Rebuild)

## Phase 1 — Stabilize Foundation
1. Fix all ESLint errors and enable CI gate (`npm run lint` + `npm run build`).
2. Replace `any` with domain DTOs for auth, alumni, events, RBAC.
3. Standardize API layer (`apiClient` + feature-specific hooks + typed error mapping).
4. Add route-level loading/error boundaries per feature.

## Phase 2 — Content & Feature Parity with dumcjaa.com
1. Public pages: Home, About, Alumni Directory, Events, News, Gallery.
2. Auth flows: register/login/forgot/reset/email verification.
3. Admin flows: CRUD for alumni/events/news/settings + RBAC management.
4. Data wiring: replace placeholders/static data with real API endpoints.

## Phase 3 — Production Readiness
1. Accessibility pass (keyboard nav, labels, aria, contrast).
2. Performance pass (code-splitting by route, image optimization, caching).
3. E2E and integration tests (Playwright + React Testing Library).
4. Monitoring and observability (client error tracking, API latency dashboards).

## Definition of Done
- Lint: 0 errors.
- Build: passing in CI.
- Core user journeys validated on production-like environment:
  - Browse alumni
  - View events/news/gallery
  - Register/login
  - Admin CRUD + RBAC
