# Dynamic Product Configuration Wizard

A production-ready multi-step **Product Configuration Wizard** built with **React 19**, **TypeScript 5.9**, and **XState 5**. This project demonstrates advanced frontend engineering — predictable state management via a centralized state machine, dynamic conditional rendering, form validation, async submission, comprehensive testing (97%+ coverage), accessibility (WCAG 2.1 AA), responsive design, and Dockerized deployment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Responsiveness](#responsiveness)
- [Accessibility](#accessibility)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

This wizard guides users through configuring a product (Laptop or Mobile) in 3 steps. All navigation, validation, error handling, and state transitions are controlled **exclusively** by a centralized **XState state machine** — no local React `useState` is used for validation or flow control.

### Key Features

| Feature | Details |
|---------|---------|
| Multi-step wizard | 3 steps with visual progress bar |
| Dynamic rendering | Step 2 fields change based on product type (Laptop vs Mobile) |
| XState state machine | All transitions, guards, validation, and error messages |
| Async submission | POST to mock API via XState `invoke` + `fromPromise` |
| Loading & error states | Spinner during submit, error message on failure, retry support |
| Disabled buttons | Next/Submit disabled when required fields are empty |
| Accessibility | ARIA attributes, semantic HTML, keyboard navigation, screen reader support |
| Responsive CSS | Mobile (375px), Tablet (768px), Desktop (1440px) |
| Dark theme | Deep dark navy UI with cyan accents and pink-purple gradient buttons |
| 87 unit tests | Jest + React Testing Library, 97.24% statement coverage |
| 16 E2E tests | Cypress with `data-cy` selectors |
| Docker ready | Multi-stage Dockerfile, Nginx, docker-compose with healthchecks |

---

## How It Works

### Step 1 — Select Product

- Choose **Laptop** or **Mobile** from a dropdown
- **Next** button is disabled until a product is selected
- XState guard validates the selection; fallback transition sets `errorMessage` in context

### Step 2 — Configure Options

Dynamic fields based on product type:

| Laptop | Mobile |
|--------|--------|
| RAM (8GB, 16GB, 32GB, 64GB) | RAM (4GB, 6GB, 8GB, 12GB) |
| Storage (256GB–2TB SSD) | Storage (64GB–512GB) |
| Graphics Card (Integrated, RTX 3060, RTX 4090) | Battery (3000–6000mAh) |

- **Next** button disabled until all required fields are filled
- XState guard validates all fields; contextual error messages show which field is missing
- **Back** preserves form data in machine context

### Step 3 — Summary & Submit

- Displays all selections in a formatted summary card
- **Submit** sends a POST request to `/api/configurations`
- Loading spinner shown during submission; buttons disabled to prevent double-submit
- On success → success screen with "Configure Another Product" button
- On failure → error message with retry option

### Where Does Submitted Data Go?

```
Submit → POST /api/configurations → Vite proxy → http://localhost:3001/configurations
```

Data is stored in `mock-api/db.json` under the `"configurations"` array. You can view all submissions at `http://localhost:3001/configurations`.

---

## Architecture

### XState State Machine

```
step1 → step2 → summary → submitting → success
  ↑        ↑        ↑                      │
  │        │        └──── (on error) ──────┘
  │        └── PREV ──┘
  └──── PREV ──┘                    RESTART → step1
```

- **States**: `step1`, `step2`, `summary`, `submitting`, `success`
- **Events**: `NEXT`, `PREV`, `SUBMIT`, `RESTART`
- **Guards**: Validate data before allowing transitions
- **Fallback transitions**: Set `errorMessage` context when guards fail
- **Actions**: `assign()` updates `globalConfig` and `errorMessage`
- **Async invoke**: `fromPromise` handles POST request; `onDone` → success, `onError` → summary with error

### Centralized Product Configuration

`productConfig.ts` defines all product-specific data in one place:

- `PRODUCT_OPTIONS` — available choices per product type
- `PRODUCT_REQUIRED_FIELDS` — required fields per product type
- `FIELD_LABELS` — human-readable labels for display

### Component Tree

```
main.tsx
└── App.tsx
    └── WizardProvider (React Context + useMachine)
        └── Wizard
            ├── ProgressBar
            ├── Step1Product
            ├── Step2Options
            ├── SummaryStep
            └── Success View
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| State Management | XState 5 + @xstate/react 6 |
| Unit Testing | Jest 30 + React Testing Library + @testing-library/jest-dom |
| E2E Testing | Cypress 15 |
| Styling | CSS custom properties, Flexbox, media queries |
| Mock API | json-server |
| Containerization | Docker + Docker Compose + Nginx |

---

## Project Structure

```
my-config-wizard/
├── src/
│   ├── main.tsx                          # Entry point (imports index.css)
│   ├── App.tsx                           # Root component (imports App.css + wizard.css)
│   ├── App.css                           # Root layout styles
│   ├── index.css                         # Global CSS variables & dark theme
│   ├── components/
│   │   └── ProgressBar.tsx               # Step progress indicator
│   ├── features/Wizard/
│   │   ├── index.tsx                     # Main Wizard component
│   │   ├── WizardMachine.ts              # XState state machine (core logic)
│   │   ├── WizardMachine.test.ts         # Machine unit tests (~30 tests)
│   │   ├── WizardContext.tsx             # React Context wrapping useMachine
│   │   ├── productConfig.ts             # Product options, required fields, labels
│   │   ├── types.ts                     # TypeScript interfaces
│   │   └── steps/
│   │       ├── Step1Product.tsx          # Product type selection
│   │       ├── Step1Product.test.tsx     # Step 1 tests (~9 tests)
│   │       ├── Step2Options.tsx          # Dynamic configuration options
│   │       ├── Step2Options.test.tsx     # Step 2 tests (~20 tests)
│   │       └── SummaryStep.tsx           # Summary + submit
│   └── styles/
│       └── wizard.css                   # All wizard component styles
├── cypress/
│   └── e2e/
│       └── wizard.cy.ts                 # 16 E2E tests
├── mock-api/
│   ├── db.json                          # Mock data store (submissions saved here)
│   ├── package.json                     # json-server dependency
│   └── Dockerfile                       # Mock API container
├── Dockerfile                           # Multi-stage build (Node + Nginx)
├── docker-compose.yml                   # Frontend + API orchestration
├── nginx.conf                           # SPA routing + API proxy
├── jest.config.ts                       # Jest configuration
├── cypress.config.ts                    # Cypress configuration
├── vite.config.ts                       # Vite config with API proxy
└── package.json                         # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**
- **Docker Desktop** (optional, for containerized deployment)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Mock API Server

```bash
cd mock-api
npm install
npx json-server --watch db.json --port 3001
```

The mock API runs at `http://localhost:3001`. Vite automatically proxies `/api` requests to it.

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Production Build

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` in your browser.

---

## Testing

### Unit & Integration Tests (Jest)

```bash
# Run all tests
npx jest

# Run with coverage report
npx jest --coverage
```

**Results: 6 suites, 87 tests, 97.24% statement coverage**

| Test File | Tests | What's Covered |
|-----------|-------|----------------|
| `WizardMachine.test.ts` | ~30 | All transitions, guards, error messages, async submission (success/failure/network error), restart |
| `Step1Product.test.tsx` | ~9 | Rendering, disabled button when empty, enabled on selection, ARIA attributes, data-cy selectors |
| `Step2Options.test.tsx` | ~20 | Dynamic Laptop vs Mobile rendering, disabled button states (all empty, partial, full), error display, pre-filled values |
| `SummaryStep.test.tsx` | ~15 | Summary display, navigation, loading spinner, disabled buttons during submit, error messages |
| `ProgressBar.test.tsx` | ~9 | Step labels, active/completed classes, aria-current, navigation landmark |
| `Wizard.test.tsx` | ~5 | Full integration flow, success view, restart |

### End-to-End Tests (Cypress)

```bash
# Start dev server first
npm run dev

# Run Cypress tests
npx cypress run

# Open Cypress UI
npx cypress open
```

**16 E2E tests** covering:

- Complete Laptop wizard flow (select → configure → submit → success)
- Complete Mobile wizard flow with dynamic fields
- Disabled Next button when no product selected / Step 2 fields empty
- Enabled Next button after filling required fields
- Specific field validation (missing Graphics Card, missing Battery)
- Forward and backward navigation with data persistence
- Progress bar step updates
- Loading indicator during async submission
- Success message after submission
- Error handling on API failure (500 response)
- Restart wizard after successful submission

All selectors use `data-cy` attributes for stability.

---

## Docker Deployment

### Build & Run

```bash
docker-compose up --build
```

Open `http://localhost:3000` in your browser.

### Services

| Service    | Port | Description | Healthcheck |
|------------|------|-------------|-------------|
| `frontend` | 3000 | Nginx serving React production build + API proxy | `curl -f http://localhost:80` |
| `api`      | 3001 | json-server mock API | `wget --spider http://localhost:3001` |

### Docker Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Node.js for building → Nginx for serving. Includes curl for healthchecks |
| `docker-compose.yml` | Orchestrates frontend + API services with healthchecks and dependency ordering |
| `nginx.conf` | SPA routing (fallback to index.html) + reverse proxy `/api` → mock API |
| `mock-api/Dockerfile` | Containerized json-server |

> **Note**: Docker Desktop must be running and configured for Linux containers.

---

## Responsiveness

Responsive layout using CSS Flexbox, custom properties, and media queries:

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | Full-width centered wizard card |
| **Tablet (768px)** | Compact progress bar, adjusted padding, stacked summary items |
| **Mobile (375px–480px)** | Stacked vertical progress bar, full-width buttons, column-reverse button layout |

### Theme

Dark mode design with high contrast:

- **Background**: Deep dark navy (`#070b18` body, `#0f1629` card)
- **Text**: White (`#ffffff`) with light gray secondary text
- **Labels & accents**: Cyan (`#22d3ee`) for form labels, summary keys, focus rings
- **Buttons**: Pink-to-purple gradient (`#ec4899 → #a855f7 → #6366f1`)
- **Active progress step**: Gradient with glow shadow
- **Completed steps**: Cyan with subtle glow
- **Errors**: Pink accent (`#ec4899`)

---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Semantic HTML | `section`, `nav`, `ol`, `dl`, `label`, `button` |
| Required fields | `aria-required="true"` on all required inputs |
| Invalid fields | `aria-invalid="true"` on fields with errors |
| Error linking | `aria-describedby` connects inputs to error messages |
| Error alerts | `role="alert"` on validation error messages |
| Active step | `aria-current="step"` on progress bar |
| Live regions | `aria-live="polite"` for progress, `aria-live="assertive"` for loading |
| Screen readers | `sr-only` class for hidden descriptive text |
| Keyboard navigation | Full tab support with visible focus indicators (cyan outline) |
| Double-submit prevention | Buttons disabled during async submission |
| Color contrast | WCAG AA compliant |

---

## Future Enhancements

- Persist wizard state using `localStorage` for session recovery
- Add more product types (Tablet, Desktop, Smartwatch)
- Implement real backend API replacing json-server
- Add field-level validation on blur
- Add visual regression testing
- Deploy to cloud (Vercel / AWS / Azure)
