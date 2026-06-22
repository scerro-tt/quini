# Phase 1 Setup — Core Infrastructure

## Status: 🚀 Starting Phase 1a

### What's been created
- **Database schema** (`sql/phase1-schema.sql`) — 7 tables + RLS policies + indexes
- **Admin authentication** (`lib/auth/admin.ts`) — role checking utilities
- **Updated middleware** (`middleware.ts`) — protects `/admin` routes
- **Server actions** (`app/actions/`) — seasons and jornadas (matchdays)

### 🔧 NEXT: Run SQL in Supabase

1. Go to **Supabase Console** → Your project → **SQL Editor**
2. Create a new query
3. Copy-paste the entire contents of `/sql/phase1-schema.sql`
4. Click **Run** ✅

This creates:
- `seasons` — Tournament years
- `jornadas` — Matchdays within seasons
- `boletos` — User tickets
- `results` — Match outcomes
- `scores` — Calculated scores per user per jornada
- `prizes` — Prize allocation
- RLS policies for security

### 🔐 Make Yourself Admin

1. In Supabase SQL Editor, run:
```sql
SELECT id, nickname FROM profiles;
```

2. Find your user ID, then run:
```sql
UPDATE profiles SET is_admin = true WHERE id = '<your-user-id>';
```

3. Sign out and back in for changes to take effect

### ✅ Verify It Works

1. Navigate to `http://localhost:3000/admin` (after signing in)
2. You should NOT be redirected (middleware allowed access)
3. If you see a 404, that's fine — admin pages not built yet

If you GET redirected to dashboard → you're not admin. Run the SQL again.

### 📋 What's Next

**Phase 1b (Week 2):** Boleto upload + Claude Vision integration
- File upload handling
- Supabase Storage bucket + RLS
- Claude Vision API integration
- Prediction extraction & validation UI

**Phase 1c (Week 2-3):** Results & Scoring
- Admin interface to enter match results
- Automatic score calculation
- Ranking computation

**Phase 1d-e (Week 3):** Dashboard & Polish
- Main dashboard
- Rankings display
- Prize distribution UI

---

## Testing Checklist (Phase 1a)

- [ ] SQL schema runs without errors
- [ ] You're set as admin
- [ ] Can access `/admin` without redirect
- [ ] Can't access `/admin` from non-admin account (create test account if needed)
- [ ] `npm run build` completes successfully

---

## Important Notes

- **Credentials:** `.env.local` is in `.gitignore` — never commit it
- **RLS:** All tables have row-level security. Only authenticated users can see data
- **Admin role:** Currently hardcoded as `is_admin` boolean. Phase 2 will add proper role-based access control
- **Boleto processing:** Will be asynchronous (Vision API takes time). Status tracking in `processing_status` column

---

Next: Once you confirm SQL is running, we move to Phase 1b (Boleto upload + Vision).
