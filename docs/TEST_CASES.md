# API verification checklist

## Authentication

- Register with valid name/email/password returns 201 and a JWT.
- Registration grants exactly `1000000` virtual cash.
- Duplicate email returns 409.
- Invalid email, short password, and short name return 400.
- Wrong password returns 401 without revealing which credential failed.
- Missing, malformed, and expired bearer tokens return 401.
- `/api/auth/me` returns the authenticated user without the password.
- Authentication rate limiting activates after repeated attempts.

## Market data

- Valid quote, history, search, gainers, and losers requests return provider data.
- Market routes without JWT return 401.
- Invalid symbols return 400.
- Invalid intervals return 400.
- Empty or oversized search queries return 400.
- Missing provider key returns a controlled 503.
- Provider timeout/error returns a controlled 502/504.
- Repeated quote requests are served from the in-memory cache during its TTL.

## Trading

- BUY with a valid symbol and quantity creates a holding and BUY transaction.
- BUY deducts `price * quantity` from cash.
- BUY with insufficient funds returns 400 and does not create a transaction.
- BUY with zero, negative, decimal, or missing quantity returns 400.
- SELL only succeeds for an owned symbol.
- Selling more than owned returns 400 without changing cash or holdings.
- SELL adds `price * quantity` to cash.
- Full SELL removes the holding.
- Partial SELL updates quantity and invested amount.
- Realized P/L equals `(sellPrice - averageBuyPrice) * quantity`.
- Client-supplied price values are ignored.

## Portfolio

- Dashboard and portfolio require JWT.
- Current value equals quantity multiplied by backend quote.
- Unrealized P/L equals current value minus invested amount.
- Total account value equals cash plus current portfolio value.
- Market price changes do not alter cash.
- Transaction history returns newest records first and supports BUY/SELL filtering.
- Empty accounts return valid empty arrays and zero portfolio values.

## Watchlist

- Authenticated users can list, add, and delete symbols.
- Invalid symbols return 400.
- Duplicate user/symbol entries are prevented.
- Deleting a missing symbol returns 404.
- Users cannot access another user's watchlist.

## Admin

- Non-authenticated admin requests return 401.
- Authenticated non-admin requests return 403.
- Admin can list users, stocks, and all transactions.
- User passwords never appear in admin responses.
- Transaction records include populated user name/email when available.
