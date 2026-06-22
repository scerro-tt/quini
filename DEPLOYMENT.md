# Deployment Guide - Railway

## Prerequisites
- Railway.app account ([sign up](https://railway.app))
- GitHub repository connected (already done: https://github.com/scerro-tt/quini)
- Supabase project configured

## Deployment Steps

### 1. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Connect your GitHub account
5. Select repository `scerro-tt/quini`
6. Railway will auto-detect it's a Next.js project

### 2. Configure Environment Variables
In Railway Dashboard:

1. **Project Settings** → **Variables**
2. Add these variables (get values from `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
NODE_ENV=production
```

**Where to get these:**
- Supabase: **Project Settings** → **API** (get all 3 keys)
- Anthropic: **console.anthropic.com** → **API Keys**
- See `.env.example` for variable names

### 3. Deploy
Railway will automatically deploy when you:
- Push to main branch
- Or manually trigger via **Deployments** → **Trigger Deploy**

### 4. Get Your URL
After deployment:
1. **Project** → **Settings** → **Domains**
2. Railway auto-generates a domain: `your-app-name.up.railway.app`
3. Use this URL to test the app

### 5. Configure Supabase for Your Domain
In Supabase Console:

1. **Project Settings** → **Auth**
2. **Redirect URLs** → Add:
   ```
   https://your-app-name.up.railway.app/auth/callback
   https://your-app-name.up.railway.app
   ```

### 6. Test Deployment
- Visit `https://your-app-name.up.railway.app`
- Test: Landing → Register → Login → Profile
- Check logs in Railway if there are errors

---

## Database (Optional)

**Current Setup:** Using Supabase (PostgreSQL hosted)
- No additional database needed in Railway
- All data stored in Supabase

**Alternative:** If you want Railway PostgreSQL:
1. In Railway Dashboard → **New Service**
2. Select **PostgreSQL**
3. This gives you DB_URL in environment
4. Would require migrating from Supabase (more complex)

**Recommendation:** Keep using Supabase (already configured, working)

---

## Monitoring

### Logs
- Railway Dashboard → **Project** → **Deployments** → **Logs**
- View real-time logs from your app

### Metrics
- Dashboard → **Metrics** tab
- Monitor CPU, memory, requests

### Errors
- Check Railway logs if deployment fails
- Common issues:
  - Missing env variables
  - Build failure (check build log)
  - Port not exposed (Railway does this automatically for Next.js)

---

## Updates & Redeployment

Every time you push to GitHub:
1. Railway automatically rebuilds
2. Runs `npm run build`
3. Starts with `npm run start`
4. New version deployed

To manually redeploy:
- **Deployments** → **Trigger Deploy**

---

## Useful Links
- [Railway Docs](https://docs.railway.app)
- [Next.js on Railway](https://docs.railway.app/guides/nextjs)
- [Environment Variables](https://docs.railway.app/develop/variables)
