# Deployment guide

## 1. MongoDB Atlas

1. Create a free MongoDB Atlas project and cluster.
2. Create a database user with a strong password.
3. Under Network Access, allow the deployment provider's outbound IPs. For initial testing, `0.0.0.0/0` is possible but should be restricted where supported.
4. Copy the Node.js driver connection string.
5. Replace the username, password, and database name.

Example:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/stock-market?retryWrites=true&w=majority
```

## 2. Twelve Data

1. Create an account at Twelve Data.
2. Open the API dashboard.
3. Copy the API key.
4. Add it only to the backend environment:

```env
TWELVE_DATA_API_KEY=YOUR_KEY
```

Never place this key in `client/.env`, React source, or browser requests.

## 3. Backend on Render or Railway

Root directory: repository root.

Build command:

```bash
npm install
```

Start command:

```bash
node server/server.js
```

Required environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_ATLAS_URI
JWT_SECRET=LONG_RANDOM_PRODUCTION_SECRET
TWELVE_DATA_API_KEY=YOUR_TWELVE_DATA_KEY
CLIENT_URL=https://YOUR-FRONTEND-DOMAIN
```

The server binds to `0.0.0.0` and uses the provider-assigned `PORT`.

After deployment, verify:

```text
https://YOUR-BACKEND-DOMAIN/api/health
```

Seed an administrator from a one-off shell/job when required:

```bash
npm run seed:admin
```

Set these only as server environment variables:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=CHANGE_THIS_IMMEDIATELY
```

## 4. Frontend on Vercel or Netlify

Build command:

```bash
npm install && npm --prefix client install && npm --prefix client run build
```

Publish directory:

```text
client/dist
```

The application uses relative `/api` requests. For production, configure the hosting platform to proxy `/api` to the deployed backend, or add a rewrite.

### Vercel rewrite

Create `client/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-BACKEND-DOMAIN/api/:path*" }
  ]
}
```

### Netlify redirect

Create `client/public/_redirects`:

```text
/api/*  https://YOUR-BACKEND-DOMAIN/api/:splat  200
/*      /index.html                         200
```

Use the backend domain in `CLIENT_URL`, without a trailing slash.

## 5. Production checklist

- Use a long random `JWT_SECRET`.
- Change the seeded admin password.
- Restrict Atlas Network Access.
- Set `CLIENT_URL` to the exact frontend origin.
- Keep market keys and database credentials out of Git.
- Confirm browser requests use `/api`, not localhost.
- Confirm `/api/health` responds.
- Test login, quote, buy, sell, portfolio, and admin requests.
- Enable HTTPS on both deployments.
- Review provider logs and rate limits.
