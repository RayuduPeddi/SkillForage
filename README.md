# SkillForage

SkillForage is an AI-powered adaptive learning platform for software engineering interview preparation. The application combines a React learning interface with a small Express API; the frontend can also run with its built-in mock data.

## Features

- Adaptive learning experience with an AI Mentor chat
- Local mock-data mode for trying the frontend without a running API
- Express API endpoints for health checks and AI Mentor chat

## Technology

- Frontend: React, Vite, Redux Toolkit, React Router, Tailwind CSS
- Backend: Node.js, Express, and CORS

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm

## Getting started

Clone the repository, then install and start the backend:

```powershell
cd backend
npm install
npm start
```

In a separate terminal, configure and start the frontend:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The backend listens on `http://localhost:4000` by default.

## Configuration

Frontend configuration is read from `frontend/.env`:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Base URL for the backend API |
| `VITE_ENABLE_MOCK_API` | `true` | Use frontend mock data when `true`; set to `false` to use the backend |

When mock mode is disabled, the AI Mentor sends chat requests to `POST /api/ai-chat`. The included backend currently returns a demonstration reply; it does not connect to an external AI provider.

The backend uses port `4000` by default. Set the `PORT` environment variable to change it, and update `VITE_API_BASE_URL` to match.

## Deploy the frontend to Vercel

Import this GitHub repository into Vercel and set the project **Root Directory** to `frontend`. Vercel detects Vite automatically; use these build settings if prompted:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

The included `frontend/vercel.json` rewrites app routes to the SPA entry point, so refreshing a nested route works. The frontend defaults to mock mode and can be deployed without hosting the backend. To connect it to a deployed backend, configure these Vercel project environment variables and redeploy:

- `VITE_ENABLE_MOCK_API=false`
- `VITE_API_BASE_URL=https://<your-backend-domain>/api`

The backend must allow requests from your Vercel deployment domain.

## Development commands

Run these from the `frontend` directory:

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```
