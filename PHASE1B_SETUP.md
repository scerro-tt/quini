# Phase 1b Setup — Boleto Upload + Claude Vision

## Status: 🚀 Phase 1b Core Code Ready

### What's been created

**Server Actions & API:**
- `app/actions/boletos.ts` — Upload, process, fetch boletos
- `app/api/claude-vision/route.ts` — Claude Vision integration for OCR

**Components:**
- `app/components/BoletoUpload.tsx` — Drag-drop file upload with progress
- `app/components/BoletoPreview.tsx` — Image preview + predictions table + manual corrections

**Pages:**
- `app/(authenticated)/boletos/[jornadaId]/upload/page.tsx` — Upload interface

**Dependencies:**
- `@anthropic-ai/sdk` — Added to package.json

---

## 🔧 NEXT STEPS — CRITICAL CONFIG

### 1. Install Dependencies

```bash
npm install
```

This installs the Anthropic SDK.

### 2. Create Supabase Storage Bucket

Go to **Supabase Console** → **Storage** → **Create a new bucket**:
- Name: `boletos`
- Privacy: **PUBLIC** (so images can be viewed)
- ✅ Click Create

### 3. Configure Storage RLS Policies

**EASIER: Use Supabase Console UI** (recommended):

1. Go to **Supabase Console** → **Storage** → **boletos** bucket → **Policies**
2. Click **New Policy** → **For authenticated users only**
3. Add these policies via the UI:

| Name | Type | Allowed |
|------|------|---------|
| Users can upload | INSERT | ✅ |
| Users can read | SELECT | ✅ |
| Users can delete own | DELETE | ✅ |

The UI will generate the SQL for you.

---

**ALTERNATIVE: Run this SQL in SQL Editor:**

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload boletos" ON storage.objects;
DROP POLICY IF EXISTS "Users can read all boletos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own boletos" ON storage.objects;

-- Policy: Users can upload to boletos bucket
CREATE POLICY "Users can upload boletos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'boletos');

-- Policy: Users can read all boletos (transparency)
CREATE POLICY "Users can read all boletos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'boletos');

-- Policy: Users can delete their own boletos
CREATE POLICY "Users can delete their own boletos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'boletos' AND owner = auth.uid());
```

### 4. Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. **API Keys** → **Create Key**
4. Copy the key

### 5. Update Environment Variables

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 6. Test the Flow

```bash
npm run dev
```

Then:
1. Create a test season + jornada (via admin panel — we'll build this next)
2. Navigate to `/boletos/[jornada-id]/upload`
3. Upload a boleto image (or test with a sports betting ticket image)
4. Wait for Claude Vision to extract predictions
5. Verify predictions are shown with confidence scores
6. Manually correct if needed

---

## How It Works

1. **Upload** → Image saved to Supabase Storage (`boletos/` bucket)
2. **Vision API Call** → Claude reads the image, extracts match predictions
3. **Confidence Scoring** → Each prediction gets a confidence score (0-1)
4. **User Review** → User sees extracted predictions + can manually correct low-confidence ones
5. **Save** → Predictions stored in `boletos.predictions` (JSONB)

---

## Known Limitations (Phase 1b)

- Manual admin setup (next phase: create admin UI for seasons/jornadas)
- No boleto deletion UI yet
- Single match format assumed (customize later for other formats)
- Confidence thresholds hardcoded (0.7 = low confidence warning)

---

## Next Phase (1c)

- Results input interface (admin only)
- Score calculation engine
- Ranking computation

---

## Testing Checklist

- [ ] npm install completes
- [ ] Supabase bucket "boletos" created
- [ ] Storage RLS policies in place
- [ ] ANTHROPIC_API_KEY in .env.local
- [ ] npm run dev works
- [ ] Can navigate to `/boletos/[id]/upload` (after creating a jornada)
- [ ] Can upload an image
- [ ] Claude Vision processes it
- [ ] Predictions shown in table
- [ ] Can correct predictions
- [ ] Can save corrections

Once verified, move to Phase 1c (Results & Scoring).
