# Revio Architecture & Development Specification

## 1. Monorepo Layout

Revio is structured as a clean dual-track monorepo using NPM Workspaces:

```text
revio/
├── frontend/             # Single-Page React Application (React 19 + Vite 6 + React Router + Tailwind CSS v4)
├── backend/              # RESTful Express API Engine (Node.js + Express.js + Zod validation)
├── docs/                 # Project documentation
├── AGENTS.md             # Development mandates and design rules
└── PRODUCT_SPEC.md       # Product requirement specifications
```

---

## 2. Frontend Architecture & Conventions

- **Bootstrap & Routing**:
  - `src/app/main.jsx`: Mounts root React application.
  - `src/app/App.jsx`: Wraps router provider and loads global design system (`src/styles/index.css`).
  - `src/app/router.jsx`: Configures React Router routes (`/` landing page, route placeholders, 404 handler).
- **Design System Integrity**:
  - **Brand Assets**: `src/components/brand/logo.jsx` (`RevioMark` SVG reduction mark + `RevioWordmark`).
  - **Palette**: Dark graphite canvas (`#111110`), warm surface (`#191918`), Vermillion Signal accent (`#FF7442` / `oklch(0.685 0.175 42)`).
  - **Typography**: `Instrument Serif` (`text-editorial`), `Geist` (`font-sans`), `JetBrains Mono` (`text-meta`, `text-code`).
  - **Restrained Geometry**: 3px sm, 4px md, 6px lg, 8px xl border radii with hairline grid dividers.
- **Component Categories**:
  - `src/components/brand/`: Core logo and identity assets.
  - `src/components/revio/`: Revio-specific design primitives (`Meta`, `Code`, `CategoryTag`, `StatusDot`, `SectionLabel`, `Panel`, `StepRail`, `AppShell`).
  - `src/components/ui/`: Accessible UI primitives (`button`, `badge`, `card`, `dialog`, `input`, `textarea`, `sonner`).

---

## 3. Backend Architecture & Conventions

- **Runtime**: Node.js ES Modules (`"type": "module"`).
- **Framework**: Express.js with JSON body parser, CORS, and request logger middleware.
- **Health Endpoints**:
  - `GET /health`: Basic health check.
  - `GET /api/v1/health`: API status payload.
- **Error Standard**: Standardized JSON error envelope (`{ success: false, error: { code, message } }`).
- **Logging**: Winston logger outputting structured JSON logs with timestamps and status codes.

---

## 4. Shared Mandates & Constraints

- **Languages**: JavaScript (`.js`), JSX (`.jsx`), CSS.
- **Strictly NO TypeScript**: No `.ts` or `.tsx` files allowed. No `tsconfig.json`. No TypeScript compiler.
- **No Lovable / TanStack Start / SSR Lock-in**: Application runs independently as a client-rendered SPA + Express API.
