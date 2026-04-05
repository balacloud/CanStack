# API Contracts

## Current Server Endpoints

### `POST /api/checkout`

Purpose:

- create a Stripe Checkout session for a selected pricing tier

Request body:

```json
{
  "tier": "starter | growth | scale",
  "locale": "en | fr"
}
```

Success response:

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

Error response:

```json
{
  "error": "Human-readable error message"
}
```

Notes:

- uses Stripe price IDs from environment variables
- returns `503` when Stripe is not configured
- no client secret is exposed

### `GET /[locale]/auth/callback`

Purpose:

- exchange Supabase auth code for a session and redirect back to the localized app

Notes:

- locale defaults to `en` if missing
- depends on Supabase browser/server auth flow

## Contract Rules

1. Do not add API routes when a deterministic local calculation is sufficient.
2. If an API route changes, this file should be updated.
3. Do not describe internal behavior as contract unless clients rely on it.
