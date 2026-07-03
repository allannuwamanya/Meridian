# Meridian Deployment Guide

This guide covers deploying Meridian to **Cloudflare Pages** and **Cloudflare Workers**.

---

## Prerequisites

1. **Node.js** (v18 or later)
2. **npm** or **yarn**
3. **Wrangler CLI** (for Cloudflare deployment)
4. **Cloudflare Account**
5. **Google Gemini API Key** (for AI features)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/allaninfo-tech/Meridian.git
cd Meridian

# Install dependencies
npm install
```

---

## Local Development

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Firebase Analytics (remove if not using)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

> **Note:** The current code has hardcoded API keys in `src/app/api/ai/route.ts` and `src/lib/firebase.ts`. 
> For production, use environment variables and rotate the exposed keys.

---

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

Cloudflare Pages provides the simplest way to deploy Next.js applications with automatic CI/CD.

#### Step 1: Create a Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Pages**
3. Click **Create application** > **Connect GitHub account**
4. Select your Meridian repository
5. Configure build settings:
   - **Project name**: `meridian`
   - **Production branch**: `main` or your preferred branch
   - **Build command**: `npm run build` or `npm run build:pages`
   - **Build output directory**: `.next`
   - **Root directory**: (leave empty)

#### Step 2: Configure Environment Variables

In your Cloudflare Pages project settings:
1. Go to **Settings** > **Environment variables**
2. Add the following variables:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `NEXT_PUBLIC_FIREBASE_API_KEY` - (Optional) Firebase API key
   - Other Firebase variables if needed

#### Step 3: Deploy

Push to your repository and Cloudflare Pages will automatically build and deploy:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

Your site will be available at `https://<project-name>.pages.dev`

#### Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `meridian.yourdomain.com`)
4. Follow the DNS configuration instructions

---

### Option 2: Cloudflare Workers with Wrangler

For advanced users who want to use Cloudflare Workers.

#### Step 1: Install Dependencies

```bash
npm install -g wrangler
npm install @cloudflare/next-on-pages --save-dev
```

#### Step 2: Configure wrangler.toml

Edit `wrangler.toml`:

```toml
name = "meridian"
main = "./.next/server/edge.js"
compatibility_date = "2024-01-01"

[vars]
NODE_VERSION = "18"
GEMINI_API_KEY = "@gemini-api-key"

[site]
bucket = "./public"
entry-point = "workers-site"

[build]
command = "npm run build"
watch = { pattern = "**/*.*", ignore = "**/.next/**" }

[[kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-namespace-id"
```

#### Step 3: Create a Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Workers**
3. Click **Create service** > **Create Worker**
4. Name it `meridian`

#### Step 4: Deploy

```bash
# Build the application
npm run build

# Deploy to Cloudflare Workers
npx wrangler deploy
```

#### Step 5: Configure Routes

In the Worker settings, configure a route (e.g., `meridian.yourdomain.com/*`) to point to your Worker.

---

### Option 3: Manual Deployment to Cloudflare Pages via CLI

If you prefer using the CLI:

#### Step 1: Build the Application

```bash
npm run build
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

#### Step 3: Create and Deploy

```bash
# Create a new Pages project
wrangler pages project create meridian

# Deploy to Cloudflare Pages
wrangler pages publish .next --project-name=meridian
```

---

## Deployment Checklist

- [ ] Set up environment variables (GEMINI_API_KEY)
- [ ] Configure custom domain (optional)
- [ ] Test all AI features with your API key
- [ ] Verify build succeeds locally (`npm run build`)
- [ ] Set up monitoring/alerts in Cloudflare
- [ ] Configure caching settings (optional)
- [ ] Set up automatic deployments (GitHub Actions)

---

## Post-Deployment

### Verify Deployment

1. Visit your deployed URL
2. Test the resume editor
3. Try AI features (bullet enhancement, summary generation, etc.)
4. Check the dashboard and career agent

### Performance Optimization

In Cloudflare Pages:
- Enable **Auto-minification** (Settings > Build & deployment)
- Enable **Brotli compression**
- Configure **Cache settings** for static assets

### Security Considerations

1. **Rotate API Keys**: The hardcoded keys in the repository should be rotated
2. **Environment Variables**: Always use environment variables for sensitive data
3. **CORS**: Configure CORS settings if making cross-origin requests
4. **Rate Limiting**: Consider adding rate limiting to the AI API endpoint

---

## Troubleshooting

### Build Fails

```bash
# Check for TypeScript errors
npm run lint

# Build without linting
npm run build -- --no-lint
```

### AI Features Not Working

1. Verify `GEMINI_API_KEY` is set correctly
2. Check API key has quota remaining
3. Test the API endpoint: `/api/ai`
4. Check browser console for errors

### Deployment Hangs

1. Check Node.js version (must be v18+)
2. Increase memory limits if needed
3. Check for large file uploads in the project

### Static Pages Not Generating

Ensure your `next.config.mjs` has proper export settings:

```javascript
// next.config.mjs
const nextConfig = {
  output: 'standalone', // For Workers deployment
  // or 'export' for static export
};
```

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - run: npm install
      - run: npm run build -- --no-lint
      
      - uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: meridian
          directory: .next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Secrets Required

- `CLOUDFLARE_API_TOKEN` - From Cloudflare > My Profile > API Tokens
- `CLOUDFLARE_ACCOUNT_ID` - From Cloudflare Dashboard URL
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

---

## Monitoring and Analytics

### Cloudflare Analytics

View analytics in your Cloudflare Pages project dashboard:
- Traffic statistics
- Bandwidth usage
- Request counts
- Error rates

### Application Logging

Add logging to your Next.js application:

```typescript
// In your API routes
console.log("Request received", { method: req.method, path: req.url });

// Or use a logging service
import { logger } from '@/lib/logger';
logger.info("User action", { userId, action });
```

---

## Scaling and Optimization

### For High Traffic

1. **Enable Caching**: Configure Cloudflare Cache Rules
2. **Edge Functions**: Use Cloudflare Workers for edge-side rendering
3. **Load Balancing**: Consider Cloudflare Load Balancing
4. **Rate Limiting**: Add rate limiting to API endpoints

### For Better Performance

1. **Image Optimization**: Use `next/image` for automatic optimization
2. **Code Splitting**: Next.js does this automatically
3. **Lazy Loading**: Implement lazy loading for non-critical components
4. **Preloading**: Preload critical resources

---

## Support

- **Cloudflare Documentation**: https://developers.cloudflare.com/pages/
- **Next.js Documentation**: https://nextjs.org/docs
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

## License

This project is proprietary. Ensure you have the rights to deploy and use it.

---

**Deployment Status**: Ready for production with proper API key configuration
