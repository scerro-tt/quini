# Phase 0 — Setup Complete

## ✅ What's been set up

### Project Structure
- **Next.js 14+** with TypeScript and App Router
- **Tailwind CSS 4** for styling
- **Supabase SDKs** (`@supabase/supabase-js` and `@supabase/ssr`) for auth and database
- Supporting libraries: `framer-motion`, `zod`, `clsx`, `@radix-ui/react-slot`

### Authentication Flow
- **Supabase Auth** integration (email + password)
- Server actions for `signUp`, `signIn`, `signOut` in `/lib/auth.ts`
- Middleware protecting `/dashboard` routes
- Auto-redirect: logged-in users → `/dashboard`, others → `/login`

### Pages Created
1. **`/` (Home)** — Landing page with "Entrar" / "Registrarse" links
2. **`/login`** — Sign in with email/password
3. **`/register`** — Sign up with email/password/nickname
4. **`/profile`** — User profile (edit nickname, view avatar, sign out)
5. **`/dashboard`** — Protected dashboard (placeholder for Phase 1)

### Supabase Setup Files
- `/lib/supabase/client.ts` — Browser-side Supabase client
- `/lib/supabase/server.ts` — Server-side Supabase client with cookie handling
- `/middleware.ts` — Auth middleware + route protection

## ⚙️ Next Steps (Before Running)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → create a project
- Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings → API
- Get `SUPABASE_SERVICE_ROLE_KEY` from the same place (keep it secret, only for server)

### 2. Set up Environment Variables
Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-api-key  (for Phase 1, when we read boletos)
```

### 3. Create Supabase Database Tables
Run these SQL queries in Supabase SQL Editor:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can only update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` → you should see the landing page.

## 📝 Testing the Flow
1. Click "Registrarse" → create account with email/password/nickname
2. You'll be redirected to `/profile` (nickname editing + sign out)
3. Sign out → back to login
4. Sign in with your email/password → redirected to `/dashboard`

## 🚀 Ready for Phase 1
Once this works:
- Database schema for seasons, jornadas, boletos, predictions, scores
- Boleto upload + Claude vision integration
- Results & prizes input
- Ranking calculation

## Notes
- `.env.local` is in `.gitignore` — never commit credentials
- RLS policies ensure users can only see/edit their own data
- The app uses server actions for auth (safer, no API key exposure to client)
