# CacheFlow engineering notes

CacheFlow is a React/Vite frontend backed by an Express API and MongoDB. Authenticated users can manage income and expenses, review 12-month cash-flow reports, and ask a Gemini-powered copilot questions about their recorded finances.

## Local setup

1. Copy `BACKEND/.env.example` to `BACKEND/.env` and set MongoDB, JWT, and Gemini credentials.
2. Copy `FRONTEND/.env.example` to `FRONTEND/.env`.
3. Install dependencies with `npm ci` in both `BACKEND` and `FRONTEND`.
4. Start the API with `npm run dev` in `BACKEND`; start the UI with `npm run dev` in `FRONTEND`.

The Gemini API key is read only by the backend. Do not use a `VITE_` prefix for secrets. The copilot is unavailable until `GEMINI_API_KEY` is configured; the rest of the app continues to work.

## Features and API

- `GET/POST/PUT/DELETE /api/v1/income` and `/api/v1/expense`: user-owned transaction CRUD, search, category and date filters, pagination, notes, tags, and receipts.
- `GET /api/v1/reports`: monthly income, expenses, net cash flow, and expense categories for the current and previous 11 months, grouped in the app's Asia/Kolkata time zone.
- `GET /api/v1/reports/download-excel`: the same report as an Excel workbook.
- `POST /api/v1/copilot/ask`: Gemini-generated explanations grounded in the authenticated user's 12-month report.

Receipt downloads require authentication and ownership. Receipt uploads are limited to 5 MB and JPEG, PNG, WebP, or PDF. The current receipt store is local disk; production deployments with ephemeral filesystems should replace it with private object storage.

## Validation

- Backend unit tests: `cd BACKEND && npm test`
- Feature-code lint: `cd FRONTEND && npm run lint:features`
- Existing full-project lint: `cd FRONTEND && npm run lint`
- Frontend production build: `cd FRONTEND && npm run build`
- Browser end-to-end flow: `cd FRONTEND && npx playwright install chromium && npm run test:e2e`

GitHub Actions runs backend tests, feature-code lint, browser end-to-end tests, and a production build for pushes and pull requests. The existing full-project lint command also reports legacy issues outside these features. Configure `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `CLIENT_URL` in the deployment environment. Set `VITE_API_BASE_URL` when deploying the frontend. Never commit environment files.
