# Quiniela App — Design Specification

## 🎯 Overview

**Quiniela** es una app de seguimiento de torneos de quiniela (apuestas deportivas) en grupo. Los usuarios suben boletos (imágenes de apuestas), la app extrae automáticamente sus predicciones usando IA, y después de que termina cada jornada, el sistema calcula puntos y rankings.

**Tech Stack:** Next.js 15 + React 19 + Supabase + Tailwind CSS

---

## 📊 Flujos Principales

### 1. **Autenticación**
- **Registro:** Email + Password + Nickname
- **Login:** Email + Password
- **Profile:** Ver/editar nickname, ver avatar, sign out
- **Protección:** `/dashboard` y `/admin` requieren login

### 2. **Ciclo de Jornada (Matchday)**

```
PHASE: Jornada abierta (Open)
├─ Usuario sube boleto (imagen)
├─ Claude Vision extrae predicciones
├─ Usuario valida/corrige predicciones
└─ Sistema guarda predicciones

PHASE: Jornada cerrada (Locked)
├─ No se pueden subir más boletos
└─ Admin ingresa resultados

PHASE: Resultados ingresados (Results Entered)
├─ Sistema calcula puntos automáticamente
├─ Se actualiza ranking
└─ Usuarios ven sus scores
```

### 3. **Admin Workflow**
- Admin crea temporadas (seasons)
- Admin crea jornadas dentro de temporadas
- Admin abre/cierra jornadas (deadlines)
- Admin ingresa resultados de partidos
- Admin distribuye premios

### 4. **User Workflow**
- Ve jornadas activas
- Sube boleto (imagen del boleto de apuestas)
- Valida predicciones extraídas por IA
- Ve su puntuación después de que se ingresan resultados
- Ve su posición en el ranking

---

## 📱 Páginas y Estructura

### **Public Pages (No Login Required)**
```
/                 → Home/Landing
/login            → Sign In form
/register         → Sign Up form (email + password + nickname)
```

### **Authenticated Pages (Login Required)**
```
/dashboard        → Main hub (current jornada, quick links)
/profile          → User profile (edit nickname, sign out)
/boletos/...      → Boleto management
/resultados/...   → View match results (after jornada ends)
/rankings/...     → Leaderboard by season
```

### **Admin Pages (Admin Only)**
```
/admin            → Admin dashboard
/admin/seasons    → Create/manage seasons
/admin/jornadas   → Create/manage matchdays
/admin/resultados → Enter match results
/admin/premios    → Distribute prizes
```

---

## 🎨 Key Components & Screens

### **1. Home / Landing**
- Hero section with "Entrar" (Login) and "Registrarse" (Register) buttons
- Brief explanation of what Quiniela is
- Features overview (upload boletos, auto-extract predictions, rankings)

### **2. Register / Login**
- Email input
- Password input
- (Register only) Nickname input
- Submit button
- Error messages
- Link to other page (register ↔ login)

### **3. Profile Page**
- User avatar (placeholder or initial)
- Nickname (editable)
- Edit button
- Save button
- Sign out button

### **4. Dashboard (Main Hub)**
After login, users see:
- **Current Season Card:** Shows active season
- **Next Open Jornada:** Button to upload boleto
- **Quick Stats:** My points so far, My rank, Jornadas completed
- **Sections:**
  - 📤 "Upload Boleto" → Links to `/boletos/[jornada-id]/upload`
  - 📊 "View Rankings" → Links to `/rankings`
  - 📋 "View Results" → Links to `/resultados`

### **5. Boleto Upload Page** (`/boletos/[jornadaId]/upload`)
- **Upload Zone:** Drag-drop area for image
- **Status Indicators:**
  - ✅ All predictions high confidence
  - ⚠️ Some predictions low confidence (warning)
  - 🔴 Some predictions couldn't be read (TBD)
- **Predictions Table:**
  | # | Match | Prediction | Confidence | Correction |
  |---|-------|------------|------------|-----------|
  | 1 | River vs Boca | Local | 95% | [dropdown] |
  | 2 | ... | ... | ... | ... |
- **Actions:** Save corrections button

### **6. Predictions Table Details**
Each row shows:
- **#:** Match number (1-14)
- **Match:** Match description (e.g., "River vs Boca")
- **Prediction:** Badge showing "Local" (1), "Empate" (X), or "Visitante" (2)
- **Confidence:** Progress bar + percentage (green if >80%, yellow if >60%, red if <60%)
- **Correction:** Dropdown to override prediction

### **7. Rankings Page** (`/rankings/[seasonId]`)
- **Season Selector:** Dropdown to pick which season
- **Leaderboard Table:**
  | Rank | User | Points | Jornadas | Status |
  |------|------|--------|----------|--------|
  | 1 | Juan García | 42 | 5 | 👑 |
  | 2 | María López | 38 | 5 | |
  | 3 | (You) Carlos | 35 | 5 | ⭐ |
- Highlight current user
- Sortable by points

### **8. Results Page** (`/resultados/[jornadaId]`)
- **Jornada Title:** "Jornada 5 Results"
- **Results Table:**
  | # | Match | Result |
  |---|-------|--------|
  | 1 | River vs Boca | Local (1) |
  | 2 | Independiente vs... | Empate (X) |
- Show user's prediction vs actual result (highlight mismatches)

### **9. Admin Dashboard** (`/admin`)
- Quick links to admin functions
- Recent activity
- Create Season button
- Create Jornada button
- Enter Results button

### **10. Admin Season Management** (`/admin/seasons`)
- List of seasons with status (upcoming, active, completed)
- Create New Season form (year, name, dates)
- Edit season status

### **11. Admin Jornada Management** (`/admin/jornadas/[seasonId]`)
- List jornadas with status (upcoming, open, locked, results_entered)
- Create New Jornada form (number, name, deadline)
- Open/Lock jornada buttons
- Edit deadline

### **12. Admin Results Entry** (`/admin/resultados/[jornadaId]`)
- **Match Results Form:**
  - For each match: dropdown (Local / Empate / Visitante)
  - Submit button
  - After submit: system calculates scores automatically
  - Success message: "Scores calculated for X users"

### **13. Admin Prize Distribution** (`/admin/premios/[jornadaId]`)
- Prize Pool Input: Total amount
- Prize Tiers:
  - 1st Place: $X
  - 2nd Place: $Y
  - 3rd Place: $Z
- "Calculate Distribution" button
- Preview of winners
- "Award Prizes" button

---

## 🎨 Design System

### **Color Palette**
- **Primary:** Blue (#3B82F6) — Actions, highlights
- **Success:** Green (#10B981) — High confidence, correct predictions
- **Warning:** Yellow (#F59E0B) — Low confidence, attention needed
- **Error:** Red (#EF4444) — Failed processing, incorrect
- **Neutral:** Gray (#6B7280) — Text, borders, backgrounds
- **Background:** White/Light Gray (#F9FAFB)

### **Typography**
- **Headings:** Bold, 24px-32px (desktop), 18px-24px (mobile)
- **Body:** Regular, 14px-16px
- **Small:** 12px (captions, confidence scores)
- **Font:** System font (Geist already configured)

### **Spacing**
- **Large gaps:** 32px (between sections)
- **Medium gaps:** 16px (between components)
- **Small gaps:** 8px (within components)

### **Components**
- **Buttons:** Rounded corners (6px), padding 10px-16px
- **Forms:** Simple inputs, clear labels, helper text
- **Cards:** Subtle shadow, border, 12px border-radius
- **Tables:** Striped rows (hover effect), left-aligned text
- **Alerts:** Icon + text + color coding
- **Progress bars:** Smooth, no text inside (show % next to)

### **Icons**
- Use Lucide React icons throughout (already integrated)
- Upload icon for file input
- Check/X icons for validation
- Crown icon for rank 1
- Star icon for current user in rankings

### **Responsive Design**
- **Desktop:** Full-width layouts, tables
- **Tablet:** Condensed tables, stacked where needed
- **Mobile:** Stacked layouts, full-width inputs, bottom navigation

---

## 🔄 Key Interactions & States

### **Upload Flow**
1. User drags image → Highlight drop zone
2. Click "Select File" → File picker
3. Image uploading → Show spinner
4. Claude Vision processing → Show spinner + message "Processing your boleto..."
5. Results loaded → Show table with predictions
6. Low confidence warnings → Yellow alert boxes
7. User corrects → Dropdown selections
8. User saves → Success message

### **Loading States**
- Spinners for async operations
- Disabled buttons during processing
- "Loading..." text where relevant

### **Error States**
- Red alert boxes with error message
- Retry buttons where applicable
- Contact admin if system error

### **Empty States**
- "No jornadas available" → Button to create
- "No rankings yet" → Placeholder message
- "No results entered" → Waiting message

---

## 📊 Data Displayed

### **Boleto Predictions**
```json
{
  "match_number": 1,
  "match_description": "River vs Boca",
  "prediction": "1", // "1", "X", "2", or "TBD"
  "confidence": 0.95 // 0.0 to 1.0
}
```

### **User Profile**
```json
{
  "nickname": "Juan García",
  "avatar": "default", // or image URL
  "is_admin": false
}
```

### **Rankings**
```json
{
  "rank": 1,
  "user": "Juan García",
  "points": 42,
  "jornadas_completed": 5
}
```

---

## 🎯 Priority Features (MVP)

1. ✅ Auth (login/register/profile)
2. ✅ Boleto upload + Claude Vision processing
3. ✅ Prediction validation UI
4. 🚧 Admin panel (seasons, jornadas, results)
5. 🚧 Results display
6. 🚧 Rankings leaderboard
7. 🚧 Prize distribution

---

## 📝 Next Phases

**Phase 1c (Current):** Results & Scoring
- Build admin results entry interface
- Implement score calculation
- Display results to users

**Phase 2:** Leaderboards & Social
- Full rankings page
- User profiles with stats
- Prize distribution
- Share functionality

**Phase 3:** Polish & Scale
- Mobile app (React Native)
- Real-time notifications
- Email notifications for results
- Historical stats

---

## ⚙️ Current Tech Details

- **Database:** Supabase PostgreSQL + RLS
- **Auth:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (boleto images)
- **Vision API:** Anthropic Claude (OCR extraction)
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **State:** Server actions for mutations
- **Form Validation:** Zod

---

## 📞 Design Handoff Notes

- Keep it **simple and clean** — sports betting audience likes clarity
- Use **clear iconography** — predictions should be visually distinct (1/X/2)
- **Confidence indicators** are important — users need to know if AI is uncertain
- **Mobile-first** approach — users will check scores on-the-go
- **Accessibility:** WCAG AA compliance, good contrast ratios
- **Loading states matter** — Claude Vision takes a few seconds, show progress
- **Success/error feedback:** Clear, friendly messages

---

Este documento contiene todo lo necesario para diseñar y implementar la UI del proyecto Quiniela.
