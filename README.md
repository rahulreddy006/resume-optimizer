# Resume Optimizer AI

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-orange)
![Google OAuth](https://img.shields.io/badge/Auth-Google%20OAuth-EA4335?logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio)
![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

### AI-Powered Resume Optimization Platform

Analyze resumes against job descriptions using Gemini AI, ATS-style scoring, keyword matching, cover letter generation, and real-time processing powered by BullMQ and WebSockets.

</div>

---

#  Overview

Resume Optimizer AI is a full-stack SaaS application that helps job seekers improve their resumes for specific job opportunities.

The platform allows users to upload their resumes, provide a target job description, and receive a detailed AI-generated optimization report that includes:

- ATS compatibility score
- Matched keywords
- Missing keywords
- Resume section feedback
- Resume improvement suggestions
- AI rewritten bullet points
- Personalized cover letter generation

To ensure scalability and responsiveness, all AI workloads are processed asynchronously using BullMQ and Redis while real-time status updates are delivered through Socket.io.

---

# 🌐Live Demo

## Frontend

```text
https://resume-optimizer-phi-eight.vercel.app
```

## Backend API

```text
https://resume-optimizer-backend-gyp7.onrender.com
```

## Health Check

```text
https://resume-optimizer-backend-gyp7.onrender.com/health
```

---

#  Key Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Refresh Token Rotation
- Google OAuth Login
- Protected Routes
- Secure Refresh Token Cookies
- Session Management via Passport.js

## Resume Management

- PDF Resume Upload
- DOCX Resume Upload
- Resume Parsing
- Resume Storage
- Resume Deletion
- Resume History

## AI-Powered Analysis

- ATS Compatibility Scoring
- Keyword Matching
- Missing Keyword Detection
- Resume Section Evaluation
- Resume Suggestions
- AI Resume Bullet Rewriting
- AI Cover Letter Generation
- Job Description Analysis

## Real-Time Processing

- BullMQ Background Jobs
- Redis Queue Processing
- Socket.io Notifications
- Live Analysis Completion Events
- Async AI Execution

## Security

- Helmet Security Headers
- Rate Limiting
- Zod Validation
- Centralized Error Handling
- JWT Verification
- Refresh Token Rotation
- Protected APIs

## Production Features

- Docker Support
- Render Deployment Ready
- Vercel Deployment Ready
- Neon PostgreSQL Integration
- Upstash Redis Integration
- Environment-Based Configuration

---

#  System Architecture

```text
┌──────────────────┐
│     Frontend     │
│  React + Vite    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Express Backend  │
│      API         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Authentication   │
│ JWT + OAuth      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ PostgreSQL       │
│     Neon DB      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ BullMQ Queue     │
│ Upstash Redis    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Gemini AI        │
│ Analysis Engine  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Socket.io        │
│ Realtime Events  │
└──────────────────┘
```

---

# Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React 19 | UI Framework |
| Vite | Build Tool |
| React Router DOM | Routing |
| Axios | API Requests |
| Socket.io Client | Realtime Communication |
| Tailwind CSS | Styling |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| Prisma ORM | Database Access |
| PostgreSQL | Database |
| JWT | Authentication |
| Passport.js | Google OAuth |
| BullMQ | Background Jobs |
| Redis | Queue Storage |
| Socket.io | Realtime Updates |
| Zod | Validation |
| Helmet | Security |
| Express Rate Limit | API Protection |
| Cookie Parser | Cookie Management |

---

## AI Layer

| Technology | Purpose |
|------------|----------|
| Gemini 2.5 Flash | Resume Analysis |
| Google Generative AI SDK | AI Integration |

---

## Infrastructure

| Technology | Purpose |
|------------|----------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Neon | PostgreSQL Hosting |
| Upstash | Redis Hosting |
| Docker | Containerization |
| GitHub | Version Control |

---

# Project Structure

```text
Resume_Optimizer/
│
├── backend/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │
│   ├── config/
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resume.controller.js
│   │   └── analysis.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   └── analysis.routes.js
│   │
│   ├── services/
│   │   ├── ai.service.js
│   │   └── queue.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── analysis.validator.js
│   │
│   ├── utils/
│   │   ├── prisma.js
│   │   ├── socket.js
│   │   ├── catchAsync.js
│   │   └── AppError.js
│   │
│   └── app.js
│
├── frontend/
│   │
│   ├── src/
│   │
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── Results.jsx
│   │   └── OAuthSuccess.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── README.md
│
└── .gitignore
```

---

# Getting Started

## Prerequisites

- Node.js 22+
- npm
- PostgreSQL Database
- Redis Database
- Google OAuth Credentials
- Gemini API Key

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-optimizer.git

cd resume-optimizer
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend

npm install

npx prisma generate

npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

# Environment Variables

## Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

| Variable | Description |
|-----------|------------|
| VITE_API_URL | Backend API URL |

---

## Backend (.env)

```env
DATABASE_URL=
PORT=3000

JWT_SECRET=
JWT_REFRESH_SECRET=

REDIS_URL=

GEMINI_API_KEY=

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

NODE_ENV=development
```

| Variable | Purpose |
|------------|----------|
| DATABASE_URL | PostgreSQL Database |
| PORT | Express Port |
| JWT_SECRET | Access Token Secret |
| JWT_REFRESH_SECRET | Refresh Token Secret |
| REDIS_URL | Upstash Redis |
| GEMINI_API_KEY | Gemini AI Key |
| CLIENT_URL | Frontend URL |
| GOOGLE_CLIENT_ID | Google OAuth Client |
| GOOGLE_CLIENT_SECRET | Google OAuth Secret |
| GOOGLE_CALLBACK_URL | OAuth Callback URL |
| NODE_ENV | Runtime Environment |

---

#  API Endpoints

## Authentication

| Method | Endpoint | Auth |
|----------|-----------|----------|
| POST | /api/auth/register | ❌ |
| POST | /api/auth/login | ❌ |
| POST | /api/auth/refresh | ❌ |
| POST | /api/auth/logout | ✅ |
| GET | /api/auth/google | ❌ |
| GET | /api/auth/google/callback | ❌ |

---

## Resume

| Method | Endpoint | Auth |
|----------|-----------|----------|
| POST | /api/resumes/upload | ✅ |
| GET | /api/resumes | ✅ |
| DELETE | /api/resumes/:id | ✅ |

---

## Analysis

| Method | Endpoint | Auth |
|----------|-----------|----------|
| POST | /api/analyses | ✅ |
| GET | /api/analyses | ✅ |
| GET | /api/analyses/:id | ✅ |

---

## System

| Method | Endpoint |
|----------|-----------|
| GET | / |
| GET | /health |

---

#  Authentication Flow

## Email Login

```text
User Login
     │
     ▼
Access Token Generated
     │
     ▼
Stored in LocalStorage
     │
     ▼
Protected API Access
```

---

## Google OAuth

```text
Frontend
     │
     ▼
Google Consent Screen
     │
     ▼
OAuth Callback
     │
     ▼
JWT Tokens Generated
     │
     ▼
Redirect To Frontend
     │
     ▼
Store Access Token
```

---

## Refresh Token Rotation

```text
Access Token Expired
        │
        ▼
Refresh Endpoint
        │
        ▼
Validate Refresh Token
        │
        ▼
Issue New Access Token
```

---

# Database Schema

## User

```text
id
name
email
password
googleId
credits
createdAt
```

---

## Resume

```text
id
userId
fileName
fileType
rawText
uploadedAt
```

---

## Analysis

```text
id
resumeId
userId
jobDescription
score
matchedKeywords
missingKeywords
sectionFeedback
suggestions
rewrittenBullets
coverLetter
jobId
status
errorMessage
version
createdAt
```

---

## RefreshToken

```text
id
token
userId
expiresAt
createdAt
```

---

# Available Scripts

## Backend

```bash
npm run dev
```

Start development server using nodemon.

```bash
npm start
```

Start production server.

---

## Frontend

```bash
npm run dev
```

Start Vite server.

```bash
npm run build
```

Build production bundle.

```bash
npm run preview
```

Preview build.

```bash
npm run lint
```

Run ESLint.

---

# Deployment

## Backend (Render)

### Root Directory

```text
backend
```

### Build Command

```bash
npm install && npx prisma generate
```

### Start Command

```bash
npm start
```

---

## Frontend (Vercel)

### Root Directory

```text
frontend
```

### Build Command

```bash
npm run build
```

### Output Directory

```text
dist
```

---

## Production URLs

### Frontend

```text
https://resume-optimizer-phi-eight.vercel.app
```

### Backend

```text
https://resume-optimizer-backend-gyp7.onrender.com
```

---

# Roadmap

- [ ] Stripe Subscription System
- [ ] Credit Purchases
- [ ] Resume Templates
- [ ] Resume Export
- [ ] Interview Preparation AI
- [ ] Resume Version History
- [ ] Team Workspaces
- [ ] Analytics Dashboard
- [ ] Resume Comparison
- [ ] Admin Panel

---

# Contributing

1. Fork Repository

```bash
git checkout -b feature/new-feature
```

2. Commit Changes

```bash
git commit -m "feat: add new feature"
```

3. Push Branch

```bash
git push origin feature/new-feature
```

4. Open Pull Request

---

# License

Licensed under the MIT License.

---

<div align="center">

Built with ❤️ using React, Node.js, PostgreSQL, Redis, BullMQ, Socket.io and Gemini AI.

</div>
