# Changelog

All notable changes to the FoodRush food ordering app are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **US-001 — Phone OTP Authentication**
  - Backend: `POST /api/v1/auth/send-otp` and `POST /api/v1/auth/verify-otp` with Indian phone validation, in-memory OTP store (5-min TTL), and JWT issuance (7-day expiry).
  - Frontend: Splash, Login, and OTP Verify screens; `authStore` (Zustand + localStorage persistence); protected routes.
- **US-002 — Browse Restaurants (Home Screen)**
  - Backend: `GET /api/v1/restaurants` with `?cuisine=` and `?search=` filtering (case-insensitive, matches name and cuisine).
  - Frontend: `Home` page with restaurant grid, cuisine filter chips, 300ms-debounced search, loading/error/empty states, and bottom navigation.
  - Components: `RestaurantCard` (with "Closed" badge), `CuisineChip`.
- **US-003 — View Restaurant Menu (Restaurant Detail Screen)**
  - Frontend: `Restaurant` page with banner, info, sticky category tabs, and menu grouped by category.
  - Components: `MenuItemCard` (veg/non-veg indicator, qty controls, out-of-stock state), `CategoryTabs`, `FloatingCartBar`.
  - `cartStore` (Zustand) for cart state; cart auto-clears when switching to a different restaurant.
- **US-010 — Restaurant Seed Data**
  - `backend/src/seed/seed.js`: idempotent seed of 10 restaurants across 6 cuisines, each with multiple categories and menu items; realistic ₹ pricing; one closed restaurant and one out-of-stock item. Run via `npm run seed`.
- **Testing infrastructure**
  - Frontend: Vitest + React Testing Library (34 unit tests) with v8 coverage.
  - Frontend: Playwright E2E suite (16 tests) across Chromium, Firefox, and WebKit.
  - Backend: Jest + Supertest + mongodb-memory-server (17 tests).
- ESLint flat-config setup for both backend and frontend; `.gitignore` for backend.

### Fixed
- `Restaurant.jsx`: eliminated a double-fetch on every restaurant visit caused by `cartRestaurantId` being both an effect dependency and updated inside the effect; cart state is now read imperatively via `useCartStore.getState()`.
