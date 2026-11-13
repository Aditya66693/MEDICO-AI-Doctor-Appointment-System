# 🩺 Medico — Doctor Appointment Management System

Spring Boot 3 (Java 17) + React (Vite) + Gemini (symptom triage) + Razorpay (payments).

## Features
- Patient register / login (JWT, BCrypt)
- Choose a specialist (Neurologist, Dentist, …) → **3 nearest doctors** (browser geolocation + Haversine distance) with clinic, address, rating, fee
- **Describe your problem** → Gemini suggests the specialist (keyword fallback if no API key; emergency keywords trigger a "call 112" warning)
- Date + 30-min slot picker, 10-minute slot hold, no double booking
- Payment (Razorpay test/live, or built-in **demo mode** with no keys) → confirmation **ticket** with code (printable)
- Cancel (auto-refund via Razorpay), my appointments, post-visit ratings that update the doctor's average

## Run locally
Backend (needs JDK 17+ and Maven):
```bash
cd backend
mvn spring-boot:run          # http://localhost:8080 , H2 file DB in ./data
```
Frontend (Node 18+):
```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173 (proxies /api to :8080)
```
Works with zero config (demo payments, keyword triage). Optional env vars for the backend:

| Var | Purpose |
|---|---|
| `GEMINI_API_KEY` | AI triage (free key: aistudio.google.com) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Real checkout. Use `rzp_test_...` keys from the Razorpay dashboard |
| `JWT_SECRET` | 32+ char random string (**required in prod**) |
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | Postgres in prod, e.g. `jdbc:postgresql://host/db?sslmode=require` |
| `CORS_ORIGINS` | Your frontend URL(s), comma-separated |
| `DEV_MODE` | `false` in prod (dev mode lets you review before the appointment time) |

Razorpay test card: 4111 1111 1111 1111, any future expiry, any CVV, OTP 1234 (check Razorpay docs if changed).

## Deploy (all have free tiers)
1. **Push to GitHub**: `git init && git add . && git commit -m "Medico" && git remote add origin <url> && git push -u origin main`
2. **Database** — create a free Postgres on Neon (neon.tech). Copy host/db/user/password.
3. **Backend** — Render → New Web Service → connect repo → Root dir `backend`, Runtime *Docker*. Set env vars: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`, `RAZORPAY_*`, `DEV_MODE=false`, `CORS_ORIGINS=https://<your-vercel-app>.vercel.app`. (Render free tier sleeps when idle; first request is slow.)
4. **Frontend** — Vercel → Import repo → Root dir `frontend`, framework Vite. Env: `VITE_API_URL=https://<your-render-service>.onrender.com`.
5. Open the Vercel URL, register, book.

## Known limits (read before going "live")
- Doctors are **fictional sample data** (`DataSeeder`). Real data needs an admin/doctor panel or Google Places API.
- "Nearest" = distance math over doctors in *your* DB, not a live map search.
- AI only suggests a specialty; it does not diagnose.
- Ratings exist only from reviews made inside Medico.
- Slot-locking is single-instance safe; for multiple server instances add a DB unique constraint/lock.
- Going live with real money needs Razorpay KYC, privacy policy / terms, and handling of health data under India's DPDP Act.
