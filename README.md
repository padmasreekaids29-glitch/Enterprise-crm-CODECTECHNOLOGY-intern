# Enterprise CRM System

A full-stack CRM to manage leads, customers, and sales pipelines.

**Tech stack:** React.js (Vite) · Node.js (Express) · MongoDB (Mongoose) · REST APIs · JWT auth

## Features
- **Lead tracking and deal stages**: lead CRUD with search/filters, convert a lead into a deal, drag-and-drop pipeline board (prospecting → qualification → proposal → negotiation → won/lost)
- **Sales performance dashboards**: open pipeline, revenue won, win rate, pipeline by stage, revenue by month, leads by status, top performers
- **Email and activity logs**: log calls/meetings/tasks/notes; compose emails (sent via SMTP if configured, always logged); automatic activity entries when leads are created or deals change stage
- **Role-based access control**: `admin` (everything + user management), `manager` (all leads/deals, can delete, assign owners), `sales` (own records only)

## Project structure
```
backend/   Express API (models, routes, JWT + RBAC middleware, seed script)
frontend/  React app (pages: Login, Dashboard, Leads, Pipeline, Activities, Emails, Team)
```

## Run locally
Prerequisites: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
npm run seed                # creates demo users + sample data
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

### Demo logins (after `npm run seed`)
| Role    | Email             | Password   |
|---------|-------------------|------------|
| Admin   | admin@crm.com     | admin123   |
| Manager | manager@crm.com   | manager123 |
| Sales   | priya@crm.com     | sales123   |

## REST API (all routes except login need `Authorization: Bearer <token>`)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | any |
| GET/POST/PUT/DELETE | `/api/users` | admin (GET also manager) |
| GET/POST/PUT | `/api/leads`, `/api/leads/:id` | any (sales scoped to own) |
| POST | `/api/leads/:id/convert` | any |
| DELETE | `/api/leads/:id` | admin, manager |
| GET/POST/PUT | `/api/deals` | any (sales scoped to own) |
| DELETE | `/api/deals/:id` | admin, manager |
| GET/POST/PUT/DELETE | `/api/activities` | any (own for sales) |
| GET/POST | `/api/emails` | any (own for sales) |
| GET | `/api/dashboard` | any (scoped by role) |

## Optional: real email sending
Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` in `backend/.env`. Without them, emails are stored in the log with status `logged`.

## Deploy ideas
Backend: Render/Railway + MongoDB Atlas. Frontend: Vercel/Netlify (set `VITE_API_URL` to your backend URL + `/api`, and set `CLIENT_URL` on the backend to your frontend URL).
