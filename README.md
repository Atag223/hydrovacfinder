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

## Deploying to Vercel with Custom Domain (hydrovacfinder.com)

This guide walks you through deploying the HydroVacFinder application to Vercel and connecting your custom domain purchased through Network Solutions.

### Step 1: Deploy to Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up (you can use your GitHub account)

2. **Import the GitHub Repository**
   - Click **"Add New..."** → **"Project"**
   - Select the `hydrovacfinder` repository from your GitHub account
   - Click **"Import"**

3. **Configure Environment Variables**
   Before deploying, add your environment variables in Vercel:
   - Expand **"Environment Variables"** section
   - Add each of the following variables:
     | Name | Value |
     |------|-------|
     | `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Your Mapbox access token |
     | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (use `pk_live_...` for production) |
     | `STRIPE_SECRET_KEY` | Your Stripe secret key (use `sk_live_...` for production) |
     | `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret |
     | `RESEND_API_KEY` | Your Resend API key |

4. **Deploy**
   - Click **"Deploy"**
   - Wait for the build to complete (usually 1-2 minutes)
   - You'll receive a temporary Vercel URL (e.g., `hydrovacfinder.vercel.app`)

### Step 2: Add Custom Domain in Vercel

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **"Settings"** tab
3. Click on **"Domains"** in the left sidebar
4. Enter `hydrovacfinder.com` and click **"Add"**
5. Vercel will show you the DNS records you need to configure
6. Also add `www.hydrovacfinder.com` as a domain (Vercel will redirect it to the main domain)

### Step 3: Configure DNS in Network Solutions

1. **Log in to Network Solutions**
   - Go to [networksolutions.com](https://www.networksolutions.com)
   - Click **"Manage Account"** and sign in

2. **Access DNS Settings**
   - Find your domain `hydrovacfinder.com`
   - Click **"Manage"** next to the domain
   - Look for **"Advanced DNS"** or **"DNS Management"**

3. **Remove Existing Records (if any)**
   - If you previously had this domain pointing to Replit, remove those records:
     - Delete any `A` records pointing to Replit's IP
     - Delete any `CNAME` records pointing to Replit

4. **Add Vercel DNS Records**
   
   Add the following DNS records (verify current values in [Vercel's DNS documentation](https://vercel.com/docs/projects/domains/add-a-domain)):

   **For the root domain (hydrovacfinder.com):**
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A | @ | `76.76.21.21` | 3600 |

   > **Note:** Vercel's IP address may change. When adding your domain in Vercel, it will show you the exact DNS records to configure. Use those values if they differ from the above.

   **For the www subdomain:**
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | CNAME | www | `cname.vercel-dns.com` | 3600 |

5. **Save Changes**
   - Click **"Save"** or **"Apply Changes"**

### Step 4: Verify Domain in Vercel

1. Go back to your Vercel project → **Settings** → **Domains**
2. Wait for DNS propagation (can take 5 minutes to 48 hours, typically 15-30 minutes)
3. Vercel will automatically verify your domain and issue an SSL certificate
4. Once verified, you'll see a green checkmark next to your domain

### Step 5: Update Stripe Webhook URL

Now that your site is live, update Stripe to use the production URL:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **"Add endpoint"** (or edit existing)
3. Set the endpoint URL to: `https://hydrovacfinder.com/api/stripe/webhook`
4. Select the events listed in the "Setting Up Stripe Webhooks" section above
5. Copy the new webhook signing secret
6. Update the `STRIPE_WEBHOOK_SECRET` environment variable in Vercel:
   - Go to Vercel → Project → **Settings** → **Environment Variables**
   - Update the `STRIPE_WEBHOOK_SECRET` value
   - Redeploy the application for changes to take effect

### Step 6: Verify Email Domain in Resend (Required for Email)

To send emails from `@hydrovacfinder.com`:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"** and enter `hydrovacfinder.com`
3. Resend will provide DNS records to add
4. Go back to Network Solutions DNS settings and add:
   - SPF record (TXT type)
   - DKIM record (CNAME type)
5. Return to Resend and click **"Verify"**

### Troubleshooting Deployment

#### Domain Not Connecting

- **DNS Propagation**: Wait up to 48 hours for DNS changes to propagate globally
- **Check DNS Records**: Use [dnschecker.org](https://dnschecker.org) to verify your DNS records are correct
- **Clear Browser Cache**: Try accessing the site in incognito/private mode

#### SSL Certificate Issues

- Vercel automatically provisions SSL certificates
- If you see SSL errors, wait 10-15 minutes for the certificate to be issued
- Ensure no conflicting DNS records exist

#### Build Failures on Vercel

- Check the build logs in Vercel Dashboard
- Ensure all environment variables are correctly set
- Verify the build works locally with `npm run build`


