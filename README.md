# HydroVacFinder

A Next.js application for finding hydrovac companies and disposal facilities.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- A Mapbox account with an access token
- A Stripe account for payment processing

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Mapbox access token:
   - Sign up or log in at [Mapbox](https://www.mapbox.com/)
   - Go to your [Account page](https://account.mapbox.com/)
   - Create a new access token or copy your default public token

3. Get your Stripe API keys:
   - Sign up or log in at [Stripe Dashboard](https://dashboard.stripe.com/)
   - Go to **Developers** > **API keys**
   - Copy your **Publishable key** (starts with `pk_`) and **Secret key** (starts with `sk_`)
   - For development, use test keys (`pk_test_...` and `sk_test_...`)
   - For production, use live keys (`pk_live_...` and `sk_live_...`)

4. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### Setting Up Stripe Webhooks

For local development:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run the webhook listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Copy the webhook signing secret from the CLI output and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

For production:

1. Go to **Developers** > **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select the following events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the signing secret and add it to your environment variables

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Troubleshooting

### "Mapbox access token not configured" Error

If you see the error message "Mapbox access token not configured. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN environment variable", follow these steps:

1. Ensure you have created a `.env.local` file (not just `.env.example`)
2. Make sure the `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` variable is set with a valid Mapbox token
3. Restart the development server after making changes to environment variables

### "Stripe is not configured" Error

If you see this error when trying to checkout:

1. Ensure `STRIPE_SECRET_KEY` is set in your `.env.local` file
2. Make sure you're using a valid Stripe secret key (test or live)
3. Restart the development server after making changes to environment variables

### Webhook Signature Verification Failed

If webhooks are failing:

1. Verify `STRIPE_WEBHOOK_SECRET` is correctly set
2. For local development, ensure the Stripe CLI is running
3. For production, verify the webhook URL is correctly configured in Stripe Dashboard

