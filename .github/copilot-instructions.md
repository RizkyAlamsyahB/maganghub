# Copilot Instructions for Web Aplikasi Lowongan Magang

## Project Overview

This is a Vue 3 SPA that displays internship vacancy listings from the Magang Hub Kemnaker API. The app fetches and displays available internship positions with company information, location, and quota details.

## Project Architecture

This is a Vue 3 SPA using Vite as the build tool and Tailwind CSS v4 for styling. Key architectural decisions:

- **Vue 3 Composition API with `<script setup>`**: All Vue components use the modern Composition API syntax. See `src/App.vue` for the canonical single-file component structure.
- **Path aliases**: Use `@/` to reference the `src/` directory (configured in `vite.config.js` and `jsconfig.json`). Example: `import Component from '@/components/VacancyCard.vue'`
- **Tailwind CSS v4**: Uses the new `@import "tailwindcss"` syntax in `src/style.css` with the Vite plugin (`@tailwindcss/vite`). Apply utility classes directly in templates for responsive, modern card designs.
- **Router configuration**: Vue Router is set up in `src/router/index.js` with `createWebHistory`. Routes array is currently empty - add route objects here when creating new views.

## API Integration

### External API

- **Endpoint**: `https://maganghub.kemnaker.go.id/be/v1/api/list/vacancies-aktif`
- **Method**: GET
- **Query Parameters**:
  - `order_by=jumlah_kuota`
  - `order_direction=DESC`
  - `page={number}` (default: 1)
  - `limit={number}` (default: 20)
  - `keyword={string}` (optional: search by position name across all pages)
  - `kode_provinsi={string}` (optional: filter by province code)

### Response Structure

```javascript
{
  data: [
    {
      id_posisi: 'string',
      posisi: 'string', // Position name
      jumlah_kuota: number, // Available quota
      jumlah_terdaftar: number, // Number of applicants
      perusahaan: {
        nama_perusahaan: 'string', // Company name
        logo: 'string (url)', // Company logo URL
        kode_kabupaten: 'string',
        nama_kabupaten: 'string', // City/Regency
        nama_provinsi: 'string', // Province
      },
    },
  ]
}
```

### API Service Pattern

Create `src/services/api.js` to centralize API calls:

- Use Fetch API or Axios for HTTP requests
- Implement error handling for network failures and empty responses
- Validate response data exists and is an array
- Export `getVacancies(page, limit, filters)` function
- Filters object supports: `search`, `province`
- Search queries across ALL vacancy pages, not just current page

## Development Workflow

**Start dev server:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Lint and auto-fix:**

```bash
npm run lint
```

**Format code:**

```bash
npm run format
```

## Component Structure

### Core Components

1. **VacancyCard.vue** - Single vacancy display component
   - Props: vacancy object with all fields
   - Display: company logo, position name, company name, province, quota, applicants
   - Calculates acceptance chance percentage based on quota vs applicants
   - Color-coded chance badge (green ≥50%, yellow ≥20%, red <20%)
   - Link to vacancy detail API endpoint
   - Style: Modern card design with Tailwind classes, flex layout for equal heights

2. **VacancyList.vue** - List container for all vacancies
   - Manages API data fetching and state
   - Handles loading, error, and empty states
   - Grid/list layout for cards
   - Integrates SearchFilter component
   - Implements pagination with page navigation

3. **SearchFilter.vue** - Search and filter component
   - Search by position name with debouncing (500ms)
   - Filter by province (dropdown with province codes)
   - Clear filters button
   - Emits events: `@search`, `@filter-province`

4. **LoadingSpinner.vue** - Reusable loading indicator
   - Show during API calls
   - Tailwind-based animation

### Component Naming

- Use PascalCase for component files: `VacancyCard.vue`, `VacancyList.vue`
- Use descriptive, domain-specific names related to internship vacancies

## Code Conventions

### Vue Components

- Always use `<script setup>` syntax (no Options API)
- Structure SFCs in this order: `<script setup>`, `<template>`, `<style scoped>`
- Use scoped styles to prevent CSS leakage
- Import API service: `import { getVacancies } from '@/services/api'`

### Data Display Requirements

Display these fields in each vacancy card:

- **Posisi** (position name) - Primary heading
- **Nama Perusahaan** (company name) - Secondary text
- **Logo Perusahaan** (company logo) - Image, handle missing logos gracefully
- **Lokasi** - Format as: `{nama_kabupaten}, {nama_provinsi}`
- **Kuota** (available quota) - Numeric display
- **Jumlah Pendaftar** (applicants) - Numeric display

### State Management

- Use Vue 3 reactive state with `ref()` and `reactive()`
- Pinia is optional - only add if complexity requires it
- Manage loading, error, and data states in parent components

### Styling

- Prefer Tailwind utility classes over custom CSS
- Responsive breakpoints: mobile (320px-768px), tablet (768px-1024px), desktop (>1024px)
- Use Tailwind grid/flex for card layouts
- Add custom styles only in component `<style scoped>` blocks when Tailwind utilities are insufficient

### Error Handling & Validation

- **API Response Validation**:
  - Check `response.data` exists and is an array
  - Handle empty arrays gracefully (show "No vacancies found" message)
  - Catch network errors and display user-friendly error messages
  - Use try-catch blocks in async functions

Example validation pattern:

```javascript
if (!response.data || !Array.isArray(response.data)) {
  throw new Error('Invalid API response format')
}
```

### ESLint Configuration

- Uses ESLint v9 flat config format (`eslint.config.js`)
- Configured with Vue essential rules and Prettier skip formatting
- Files to lint: `**/*.{js,mjs,jsx,vue}`
- Ignored: `dist/`, `dist-ssr/`, `coverage/`

### Router Setup

- Router instance is created in `src/router/index.js` and registered in `src/main.js`
- Use `createWebHistory` for HTML5 history mode
- Add routes to the `routes` array in `src/router/index.js`

## Node.js Version Requirements

This project requires Node.js `^20.19.0 || >=22.12.0`. Ensure compatibility when suggesting dependencies or using Node.js APIs.

## Browser DevTools Setup

Recommend Vue.js devtools extension and enabling Custom Object Formatters for better debugging experience (see `README.md` for links).
