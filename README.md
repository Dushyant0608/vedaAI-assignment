# VedaAI — AI Assessment Creator

An AI-powered assessment generation platform where teachers create assignments and an LLM generates structured question papers in real time.

## Architecture

```
Client (React) ──► Express API ──► BullMQ Queue ──► Worker ──► Groq LLM
   ▲                                                   │
   │              Socket.io (status-update)             │
   └────────────────────────────────────────────────────┘
                         │
                    MongoDB Atlas ◄── Redis Cache (5min TTL)
```

**Flow:**
1. Teacher submits assignment config → API saves to MongoDB with `status: pending` and enqueues a BullMQ job → returns `202 Accepted`
2. Worker picks up the job → sets `status: processing` → emits socket event
3. Groq (llama-3.3-70b-versatile) generates a structured JSON question paper → validated and saved
4. Worker sets `status: completed` → invalidates Redis cache → emits socket event
5. Frontend receives the event via Socket.io → refetches and renders the output
6. Teacher can view the exam paper and download it as a PDF

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB Atlas, Upstash Redis (ioredis), BullMQ, Socket.io, Groq API

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Axios, socket.io-client, @react-pdf/renderer

## Project Structure

```
vedaai/
├── backend/
│   └── src/
│       ├── config/         # env, db, redis
│       ├── models/         # mongoose schemas
│       ├── queues/         # BullMQ queue definition
│       ├── services/       # Groq prompt + generation
│       ├── controllers/    # route handlers
│       ├── routes/         # Express routes
│       ├── workers/        # BullMQ worker (processes jobs, emits socket events)
│       ├── socket/         # Socket.io init + room management
│       ├── utils/          # AppError, asyncHandler
│       ├── app.ts          # Express setup + middleware
│       └── server.ts       # HTTP server + DB connect + boot
├── frontend/
│   └── src/
│       ├── api/            # Axios API calls
│       ├── components/     # Sidebar, Navbar, PdfDocument
│       ├── hooks/          # useSocket (real-time updates)
│       ├── pages/          # Home, CreateAssignment, AssignmentOutput
│       ├── store/          # Zustand store
│       ├── types/          # TypeScript interfaces
│       ├── App.tsx         # Layout shell + routing
│       └── main.tsx        # Entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assignments` | Create assignment (202) + enqueue job |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get by ID (Redis cached when completed) |
| DELETE | `/api/assignments/:id` | Delete + invalidate cache |
| POST | `/api/assignments/:id/regenerate` | Reset to pending + re-enqueue |

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Upstash Redis instance (TCP connection)
- Groq API key

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
UPSTASH_REDIS_URL=rediss://default:your-token@your-host.upstash.io:6379
GROQ_API_KEY=gsk_your-key
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

## Deployment

**Backend** — deployed on Railway

**Frontend** — deployed on Vercel with `VITE_API_URL` set to the Railway backend URL

**Live:** [https://veda-ai-assignment-gunz7bb2c-dushyants-projects-c409dd60.vercel.app](https://veda-ai-assignment-gunz7bb2c-dushyants-projects-c409dd60.vercel.app)

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| Groq (llama-3.3-70b) over Gemini | Gemini free quota exhausted; Groq is free + fast |
| ioredis over @upstash/redis | BullMQ requires TCP persistent connection, not REST |
| BullMQ payload = assignmentId only | MongoDB is source of truth; queue is just a trigger |
| 202 on create | Correct REST semantics for async accepted-not-processed |
| Redis cache on getById (5min TTL) | Output docs are large and frequently re-fetched |
| Schema-locked JSON from Groq | Never store/render raw LLM text; parse-fail = job-fail |