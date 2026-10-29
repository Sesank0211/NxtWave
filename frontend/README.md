# ProjectZero Growth Engine

ProjectZero is a workshop registration site with referral links, referral statistics, a public leaderboard, and a protected administrator dashboard.

## Stack and layout

- Frontend: React, TypeScript, Vite, Tailwind CSS, Chart.js.
- Backend: Node.js JavaScript, Express, built-in SQLite (`node:sqlite`).
- `frontend/`: React application, assets, public files, Vite and TypeScript configuration, frontend package scripts, and frontend environment settings.
- `backend/src/models/`: Mongoose models.
- `backend/src/controllers/`: request handling and business logic.
- `backend/src/routes/`: API route definitions.
- `backend/src/middleware/`: request validation, admin authorization, and error handling.
- `backend/src/config/`: embedded SQLite connection and schema setup.

## Setup

Install frontend dependencies with `cd frontend && npm install`, then install backend dependencies with `cd backend && npm install`.

Use Node.js 22.13 or newer. The backend creates `backend/data/projectzero.sqlite` automatically; set optional `SQLITE_PATH` to place it elsewhere. Copy `backend/.env.example` to `backend/.env` and set `CLIENT_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. Those administrator credentials stay on the backend and are never bundled into the frontend. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` (default: `http://localhost:5000/api`). Keep real `.env` files private.

Start the backend from `backend/` using `npm run dev` during development or `npm start` in production. Start the frontend from `frontend/` using `npm run dev`. Build the frontend from `frontend/` using `npm run build`.

## APIs

- `GET /api/health`: service and database status.
- `POST /api/registrations`: create a registration; duplicate email addresses are rejected.
- `GET /api/registrations/count`: registration count.
- `GET /api/referrals/validate/:code`, `/stats/:code`, and `/leaderboard`: public referral features. The leaderboard omits email addresses.
- `POST /api/admin/login`: accepts the configured administrator username and password and returns an expiring session token.
- `/api/admin/*` (except login): administrator-only metrics, chart data, student records, and CSV export. The frontend sends the signed session token as a bearer token after login.
- `/api/analytics/overview`, `/daily`, `/sources`, and `/api/registrations/recent`: protected analytics compatibility routes.

## Current status

Registration persistence, referral attribution, referral lookup/statistics, and a public leaderboard use the local SQLite database. Existing local MongoDB registration records were copied into SQLite during the database change. The dashboard displays database-driven metrics, campaign progress, registration trends, acquisition sources, and recent student records. Administrators sign in with credentials configured on the backend; sessions expire after eight hours and can be ended with Log out. The backend follows MVC with JavaScript models and controllers plus separate routes; the frontend remains TypeScript.

Campaign spend is not stored, so cost and spending KPIs are not reported. The dashboard's charts include registration timeline, acquisition sources, and colleges. SQLite data is stored in a local file; production deployments need persistent disk storage. No deployment has been performed.

## Deployment

Deploy the frontend and backend as separate services, set `VITE_API_BASE_URL` to the deployed API URL, configure `SQLITE_PATH` to a persistent disk location, and set the backend's `CLIENT_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `NODE_ENV=production`, then run `npm start` in `backend/`. Use HTTPS and rotate the administrator password and session secret if exposed.
