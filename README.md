# Revio — Release Intelligence & Changelog Platform

Revio is a GitHub-native release intelligence platform that transforms raw repository activity (commits, pull requests, tags, and merges) into clear, structured, customer-facing product updates.

---

## Architecture

Revio is organized as a clean dual-track monorepo using NPM Workspaces:

```text
revio/
├── frontend/             # Single-Page React Application (React 19 + Vite 6 + React Router + Tailwind CSS v4)
├── backend/              # Express.js REST API Engine (Node.js + Express.js + Zod validation)
├── docs/                 # Architecture & design documentation
├── AGENTS.md             # Development mandates and design rules
└── PRODUCT_SPEC.md       # Product requirement specifications
```

---

## Technology Stack

### Frontend
- **Framework**: React 19 Single Page Application (SPA)
- **Build Tool**: Vite 6
- **Routing**: React Router (v6/v7)
- **Styling**: Tailwind CSS v4 with OKLCH design tokens
- **Primitives**: Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`)
- **Icons**: Lucide React
- **Language**: JavaScript (`.js`) and JSX (`.jsx`) — **100% TypeScript-free**

### Backend
- **Runtime**: Node.js ES Modules (`"type": "module"`)
- **Framework**: Express.js
- **Validation**: Zod
- **Logging**: Winston + Morgan HTTP request logger
- **Testing**: Vitest + Supertest

---

## Installation & Quick Start

### 1. Install Workspace Dependencies

```sh
npm install
```

### 2. Start Development Servers

```sh
npm run dev
```

This concurrently launches both the Vite frontend server on `http://localhost:5173` and the Express backend API server on `http://localhost:5000`.

To launch workspaces individually:

```sh
npm run dev:frontend
npm run dev:backend
```

---

## Testing

Run the full workspace test suite (both backend and frontend test runners):

```sh
npm test
```

To run individual workspace test suites:

```sh
npm run test --workspace=backend
npm run test --workspace=frontend
```

---

## Production Build

To run production build checks across all monorepo workspaces:

```sh
npm run build
```

This compiles the frontend production bundle (`dist/`) and validates backend configuration modules.

---

## Current Product Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Approved Revio Editorial Landing Page & TransformDemo | Active |
| `/connect` / `/login` | GitHub OAuth authorization & security connection portal | Active |
| `/onboarding` | 3-Step Setup (Workspace $\rightarrow$ Repository $\rightarrow$ Activity Scan) | Active |
| `/dashboard` | Workspace Operational Home & Draft Release Hero | Active |
| `/releases` | Canonical redirect to `/dashboard` | Active |
| `/releases/:id` | Flagship Release Room Studio Editor | Active |
| `/changelogs/:id/edit` | Release Room Studio alias | Active |
| `/publish/:id` | Side-by-side Public vs Private Publication Gate | Active |
| `/changelog` | Public Customer Changelog feed (Warm paper `--paper` surface) | Active |
| `/c/:slug` | Public workspace customer changelog | Active |
| `/distribution` | Multi-channel manager & Live Embeddable Widget Preview | Active |
| `/settings` | Workspace, Repository, Team, Notifications, and Billing Settings | Active |

---

## Environment Configuration

Configuration templates are available in:
- Root template: `.env.example`
- Frontend template: `frontend/.env.example`
- Backend template: `backend/.env.example`

---

## Current Status & Roadmap

- **Phase 1 Complete**: Complete end-to-end frontend product user experience implemented using React Context (`WorkspaceContext` and `ReleaseContext`) and realistic mock domain data.
- **Phase 2 Planned**: Backend PostgreSQL / Supabase schema persistence, JWT authentication, GitHub OAuth, and real-time webhook ingestion.
