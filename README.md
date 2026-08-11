# Equity — Stock Market Paper Trading

Phase 1 establishes the MERN application skeleton. Authentication, market proxying, trading, and persistence models are intentionally added in later phases.

## Project structure

```text
client/                 Vite React SPA
  src/components/       Shared UI components
  src/context/          React state providers
  src/hooks/             Reusable hooks
  src/pages/             Route pages
  src/services/          Axios/API services
server/
  config/               Database configuration
  controllers/          Request controllers (future phases)
  middleware/           Express middleware (future phases)
  models/               Mongoose models (future phases)
  routes/               API routes (future phases)
  services/             Business/integration services (future phases)
  server.js             Express entry point
```

## Phase 1 setup

Prerequisites: Node.js 18+, an accessible MongoDB Atlas cluster.

```bash
cp .env.example .env
# Edit .env and set MONGODB_URI (and keep secrets server-side)
npm run install:all
npm run dev
```

The React app is available at `http://localhost:5173`; the API health check is `http://localhost:5000/api/health`.

For Atlas, create a free cluster, create a database user, add your development IP under Network Access, then copy the Node.js connection string into `MONGODB_URI`. `TWELVE_DATA_API_KEY` is reserved for the market-data phase and must never be put in `client/`.

## Phase 1 delivered

- Express server with JSON parsing, Helmet, CORS, health endpoint, 404 response, and centralized error response shape.
- MongoDB connection bootstrap using Mongoose and environment configuration.
- Vite React SPA with a responsive trading-app shell and initial dashboard visual design.
- Root scripts for running client and server together.

Phase 11 deployment instructions are available in `docs/DEPLOYMENT.md`. The Postman collection is in `postman/Stock-Market-Paper-Trading.postman_collection.json`, and controller verification cases are in `docs/TEST_CASES.md`.

Phase 5 portfolio calculation rules: cash is read from the user account and never modified by market price changes; current portfolio value and unrealized P/L are derived from fresh backend market quotes.
