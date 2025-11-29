# HydroVacFinder

A Next.js application for finding hydrovac companies and disposal facilities.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- A Mapbox account with an access token

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Mapbox access token:
   - Sign up or log in at [Mapbox](https://www.mapbox.com/)
   - Go to your [Account page](https://account.mapbox.com/)
   - Create a new access token or copy your default public token

3. Update `.env.local` with your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
   ```

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

