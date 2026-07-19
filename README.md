# Archive — RAG Document Chat

Upload a PDF/TXT, ask questions, get answers grounded in the actual document content.

**Stack:** Next.js (TypeScript, Tailwind) · FastAPI · Supabase + pgvector · Google Gemini

---

## 1. Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- A free [Supabase](https://supabase.com) account
- A free [Google AI Studio](https://aistudio.google.com/apikey) API key (Gemini)
- A [GitHub](https://github.com) account (for deploying to Vercel/Render)

---

## 2. Set up Supabase (5 min)

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a name, password, and region. Wait ~2 min for provisioning.
2. In your project, open **SQL Editor** → **New query**.
3. Paste the entire contents of `supabase/migrations/0001_init.sql` and click **Run**.
   This enables `pgvector`, creates `documents` + `document_chunks` tables, and the `match_documents` search function.
4. Go to **Project Settings → API**. Copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (not the anon key — the backend needs full write access) → this is `SUPABASE_SERVICE_KEY`

Keep this tab open, you'll need these values in the next step.

---

## 3. Get a Gemini API key

Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey), sign in, click **Create API key**. Copy it — this is `GEMINI_API_KEY`. It's free for moderate usage.

---

## 4. Run the backend locally

```bash
cd apps/api
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# now open .env and fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY
# leave FRONTEND_ORIGIN=http://localhost:3000 for now

uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/health` — you should see `{"status": "ok"}`. If it fails, double-check your `.env` values and that the SQL migration ran successfully.

---

## 5. Run the frontend locally

Open a **new terminal tab** (keep the backend running):

```bash
cd apps/web
npm install

cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000 is correct as-is for local dev

npm run dev
```

Visit `http://localhost:3000`. Upload a PDF in the sidebar, wait for its status badge to flip to "ready," then ask a question in the chat.

---

## 6. Going live

### Push to GitHub first

```bash
cd rag-document-chat
git init
git add .
git commit -m "Initial commit: RAG document chat app"
git branch -M main
git remote add origin https://github.com/<your-username>/rag-document-chat.git
git push -u origin main
```

### Deploy the backend to Render

1. Go to [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.
2. Render should detect `apps/api/render.yaml` automatically. If not, set manually:
   - **Root Directory:** `apps/api`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Under **Environment**, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `GEMINI_API_KEY`
   - `FRONTEND_ORIGIN` — leave as `http://localhost:3000` for now, you'll update it after the frontend is deployed
4. Click **Create Web Service**. Wait for the build to finish, then copy your live URL (something like `https://rag-document-chat-api.onrender.com`).
5. Visit `<your-render-url>/health` to confirm it's live.

> Free-tier Render services sleep after inactivity and take ~30–60s to wake on the first request — normal for a portfolio project, worth mentioning if you demo it live.

### Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the same GitHub repo.
2. Set **Root Directory** to `apps/web`.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = your Render URL from above (e.g. `https://rag-document-chat-api.onrender.com`)
4. Click **Deploy**. Vercel will build and give you a live URL like `https://rag-document-chat.vercel.app`.

### Final step: connect the two

Go back to **Render → your API service → Environment**, and update `FRONTEND_ORIGIN` to your actual Vercel URL (e.g. `https://rag-document-chat.vercel.app`). Save — Render will redeploy automatically. This is what allows the frontend's browser requests to pass CORS.

Your app is now live. Visit your Vercel URL, upload a document, and chat with it.

---

## 7. Common issues

| Symptom | Likely cause |
|---|---|
| Frontend shows no documents / network errors | `NEXT_PUBLIC_API_URL` wrong, or `FRONTEND_ORIGIN` on Render doesn't match your Vercel URL exactly (check for trailing slashes) |
| Upload succeeds but chat returns "no relevant context" | Check the Supabase `document_chunks` table has rows with non-null `embedding` — if empty, the embedding call may have silently failed; check Render logs |
| 500 error on upload | Usually a bad `GEMINI_API_KEY` or `SUPABASE_SERVICE_KEY` — check Render's logs tab |
| Backend works locally but not on Render | Confirm env vars are set in Render's dashboard, not just your local `.env` (that file is gitignored and never gets pushed) |

---

## 8. Project structure

```
apps/web/     → Next.js frontend (deploy to Vercel)
apps/api/     → FastAPI backend (deploy to Render)
supabase/     → SQL migration for the vector database
```

See the inline comments in `apps/api/app/services/` for how chunking, embedding, retrieval, and generation each work — they're small, single-purpose files by design, good to point to in an interview.
