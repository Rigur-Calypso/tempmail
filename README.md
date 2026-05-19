# TempMail

**Real-time disposable email platform** — instant temporary inboxes, live delivery via WebSockets, and automatic expiry. Built as a portfolio-grade full-stack TypeScript application demonstrating monorepo architecture, production-minded backend design, and modern React engineering.

---

## Highlights

| Area             | What this project shows                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Architecture** | Turborepo monorepo, separation of API / web / shared concerns                           |
| **Backend**      | Express REST API, layered controllers → services → Prisma                               |
| **Real-time**    | Socket.IO rooms per inbox, live `email:new` and `inbox:expired` events                  |
| **Data**         | PostgreSQL + Prisma ORM, relational schema, migrations, Neon serverless driver          |
| **Security**     | Zod env validation, rate limiting, Mailgun HMAC webhook verification, HTML sanitization |
| **Ops**          | Health checks, structured logging (Pino), cron cleanup, graceful shutdown               |
| **Frontend**     | React 18, Vite, Tailwind CSS, custom hooks, responsive UI                               |

---

## Live Demo

> Replace URLs with your deployed instances when adding this to your CV.

| Service          | URL                                                     |
| ---------------- | ------------------------------------------------------- |
| **Frontend**     | `https://tempmail-api-bice.vercel.app`                           |
| **API**          | `https://tempmail-api-production.up.railway.app`        |
| **Health check** | `https://tempmail-api-production.up.railway.app/health` |

**Deployment stack:** Vercel · Railway · Neon PostgreSQL · Mailgun

---

## Features

### User-facing

* ⚡ Instant inbox generation
* 📩 Real-time inbox updates using WebSockets
* 📨 Disposable temporary email addresses
* 🔄 Live message synchronization
* ⏳ Automatic mailbox expiration and cleanup
* 📱 Fully responsive UI
* 🔒 Secure backend validation and sanitization
* 🚀 High-performance monorepo architecture

### Engineering Features

* Type-safe full-stack TypeScript setup
* Prisma ORM with PostgreSQL
* Centralized environment variable validation using Zod
* Modular Express backend architecture
* Structured logging with Pino
* Cron-based cleanup services
* API-ready scalable backend structure
* Deployment-ready infrastructure

---

## Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 18         | UI Framework            |
| Vite             | Frontend Build Tool     |
| TypeScript       | Type Safety             |
| Tailwind CSS     | Styling                 |
| Axios            | HTTP Client             |
| Socket.IO Client | Real-time Communication |

### Backend

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| Node.js           | Runtime                 |
| Express.js        | REST API Framework      |
| Prisma ORM        | Database ORM            |
| PostgreSQL / Neon | Database                |
| Socket.IO         | WebSocket Communication |
| Zod               | Schema Validation       |
| Pino              | Structured Logging      |
| node-cron         | Scheduled Cleanup Jobs  |

### DevOps & Tooling

| Tool           | Purpose               |
| -------------- | --------------------- |
| Turborepo      | Monorepo Management   |
| npm Workspaces | Dependency Management |
| ESLint         | Code Quality          |
| GitHub         | Version Control       |
| Vercel         | Frontend Deployment   |
| Railway        | Backend Hosting       |

---

## Architecture Overview

```text
┌──────────────────────┐
│      Frontend        │
│   React + Vite App   │
└──────────┬───────────┘
           │ HTTP / WS
           ▼
┌──────────────────────┐
│      Express API     │
│  REST + Socket.IO    │
└──────────┬───────────┘
           │ Prisma ORM
           ▼
┌──────────────────────┐
│    PostgreSQL DB     │
│    (Neon / Local)    │
└──────────────────────┘
```

---

## Request Flow — Incoming Email

1. Mailgun sends inbound email webhook to the backend.
2. Backend verifies webhook authenticity.
3. Email content is sanitized and validated.
4. Message is stored in PostgreSQL using Prisma.
5. Socket.IO emits real-time updates to subscribed clients.
6. Frontend updates inbox instantly without polling.

---

## Monorepo Structure

```bash
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   ├── src
│   │   └── package.json
│   │
│   └── web
│       ├── src
│       └── package.json
│
├── package.json
├── turbo.json
└── README.md
```

---

## Security Features

* Environment variable validation using Zod
* Request validation and sanitization
* Rate limiting for abuse prevention
* Secure Mailgun webhook verification
* Controlled ORM-based database access
* Structured logging and operational error handling

---

## Performance Optimizations

* WebSocket-based real-time updates
* Vite-powered fast frontend builds
* Turborepo caching and parallel execution
* Efficient Prisma ORM queries
* Modular scalable architecture

---

## Getting Started

### Prerequisites

* Node.js >= 20
* npm >= 11
* PostgreSQL database OR Neon account

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Rigur-Calypso/tempmail.git
```

Move into the project directory:

```bash
cd tempmail
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside:

```bash
apps/api/.env
```

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/tempmail
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## Database Setup

Generate Prisma client:

```bash
npm run db:generate --workspace=@tempmail/api
```

Run migrations:

```bash
npm run db:migrate --workspace=@tempmail/api
```

Open Prisma Studio:

```bash
npm run db:studio --workspace=@tempmail/api
```

---

## Running the Project

Start all applications:

```bash
npm run dev
```

This starts:

* React frontend
* Express backend
* Socket.IO server
* Development watch processes

---

## API Overview

### Create Mailbox

```http
POST /mailbox/create
```

### Get Inbox Messages

```http
GET /mailbox/:id/messages
```

### Delete Mailbox

```http
DELETE /mailbox/:id
```

---

## Deployment Guide

| Layer            | Service         |
| ---------------- | --------------- |
| Frontend Hosting | Vercel          |
| Backend Hosting  | Railway         |
| Database         | Neon PostgreSQL |
| CI/CD            | GitHub Actions  |

---

## Skills Demonstrated

This project demonstrates:

* Full-stack TypeScript engineering
* Real-time systems architecture
* REST API design
* Database modeling with Prisma
* Monorepo management using Turborepo
* WebSocket communication
* Deployment-ready DevOps practices
* Backend security and validation
* Modern React frontend architecture

---

## Future Improvements

* Custom domains
* Email forwarding
* Authentication system
* Spam filtering
* Attachment handling
* Docker support
* Kubernetes deployment
* Redis caching
* Queue-based email processing

---

## Why This Project Matters

TempMail demonstrates practical software engineering skills expected in modern backend and full-stack development roles. The project combines real-time systems, scalable architecture, backend infrastructure, database design, and production deployment practices into a single portfolio-grade application.

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Author

Built by Bhagyesh Kamal.

* GitHub: [https://github.com/Rigur-Calypso](https://github.com/Rigur-Calypso)
* Repository: [https://github.com/Rigur-Calypso/tempmail](https://github.com/Rigur-Calypso/tempmail)

---

## Support

If you found this project helpful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🛠️ Contribute improvements
* 📢 Share feedback

Source reference from uploaded README draft: fileciteturn0file0
