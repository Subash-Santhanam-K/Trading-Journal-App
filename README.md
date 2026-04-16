# PrimeTrade: Trading Journal & Analytics Platform

PrimeTrade is a production-grade Trading Journal API and interactive Dashboard built to log, visualize, and analyze trading executions. Designed as a real-world product, it provides secure authentication, seamless trade tracking, real-time Profit/Loss (PnL) analytics, and high-performance charting out of the box.

---

## ⚙️ Tech Stack

### Backend
* **Node.js & Express.js** – High-performance asynchronous API foundation
* **Prisma ORM** – Type-safe database mapping and query optimization
* **PostgreSQL (Neon)** – Scalable, serverless relational database

### Frontend
* **React (Vite)** – Ultra-fast modern frontend build tool
* **Tailwind CSS** – Utility-first, deeply customizable styling system
* **Recharts** – High-performance responsive data visualization

### Core Security
* **JWT (Access + Refresh)** – Cryptographically sound dual-token architecture
* **Bcrypt** – Salted password hashing
* **Helmet & xss-clean** – Deep payload scrubbing and secure HTTP headers
* **Express Rate Limiting** – Advanced bot and DDoS mitigation
* **Zod** – Strict boundary payload validation

---

## 🧠 System Architecture

This project strictly adheres to a modular component architecture, seamlessly bridging monolithic simplicity with the capacity to scale directly into independent microservices.

```text
backend/src/
├── controllers/   # Request interception and response formatting
├── services/      # Core business logic and database isolation
├── routes/        # Modular API endpoint declarations
├── middlewares/   # Auth validation, Zod barriers, error trapping
└── modules/       # Encapsulated, feature-based verticals (Auth, Trades)
```

> **Design Philosophy**: By separating business logic (`services`) from network transport (`controllers`), we ensure that when the system scales, individual modules can be ripped out and containerized as standalone microservices with zero structural refactoring.

---

## 🔌 API Documentation Summaries

### Authentication
* `POST /api/v1/auth/register` – provisions new user accounts seamlessly.
* `POST /api/v1/auth/login` – maps secure JWT Access and distinct 7-day Refresh tokens.

### Trade Executions 
*(Requires Bearer JWT Authorization)*
* `GET /api/v1/trades` – Retrieves securely paginated executions.
* `POST /api/v1/trades` – Logs new action bounds securely tracking PNL.
* `PUT /api/v1/trades/:id` – Modifies existing journal logs.
* `DELETE /api/v1/trades/:id` – Purges faulty execution data.
* `GET /api/v1/trades/stats` – Computes aggregated net-profit vectors and system stats.

---

## 🧪 Setup Instructions

### 1. Booting the Backend API
```bash
cd backend
npm install
```
Configure your `.env` securely:
```env
DATABASE_URL=postgresql://neondb_owner:npg_m4EUCcAilYS8@ep-dawn-silence-amgtramv-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5000
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=supersecretrefreshkey
```
Start the core:
```bash
npm run dev
```

### 2. Booting the Interactive Dashboard
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Security Standards

This backend enforces deep, production-ready security layers:

* **Dual-Token Authentication**: Short-lived access tokens (15m) paired tightly with cryptographically bound Refresh tokens.
* **Role-Based Access Control (RBAC)**: Enforced segregation between `USER` and `ADMIN` roles across database reads.
* **Strict Parameter Bounds**: All endpoints demand pure `Zod` validation with `.strict()` flags stripping unknown fields prior to execution.
* **Traffic Throttling**: Strict global rate limits (100req/15m), clamped aggressively tighter across authentication gateways (20req/15m) halting credential stuffing.
* **Secure Payloads**: `Helmet` dynamically secures HTTP headers against clickjacking, while `xss-clean` purges malicious Javascript from incoming payloads.

---

## 🚀 Scalability Strategy

This platform was built looking toward enterprise scalability:

### 1. Modular Monolith → Microservices
The internal `modules` strictly isolate logic. The `Auth` pipeline and the `Trades` ledger can easily be split into completely independent microservices natively supporting isolated deployments.

### 2. Deep Database Optimization
The PostgreSQL database is ready for indexations exclusively targeting heavily queried bounds (`userId`, `tradeDate`). As logging expands identically to real-world trading sizes, table partitioning isolates high-frequency rows natively.

### 3. Dedicated Caching Layer (Redis)
Injecting Redis inside the `services` layer prevents heavy DB read saturation on globally aggressive queries like `trade stats` or dashboard summaries. 

### 4. Load Balancing & Horizontal Containers
Because JWT sessions are fundamentally **stateless**, the Node server requires no sticky memory mapping. Replicas can be spun up across Docker/Kubernetes natively relying on an NGINX wildcard load balancer.

### 5. API Egress Optimizations
All fetching supports deep pagination (`page`, `limit`) restricting arbitrary database scrapes explicitly to prevent payload exhaustion (over-fetching).

### 6. Event-Driven Asynchronous Processing
Integrating Kafka or RabbitMQ would organically shift heavy predictive analytical computations completely off the main Express thread rendering API responses instantaneous globally.

---

## 📈 Future Improvements

* **WebSocket Architecture**: Binding bidirectional tracking updating dynamic data instantly to dashboards.
* **Complex Data Modeling**: Utilizing algorithmic analytics defining explicit Sharpe Ratios and maximum bounds of Drawdowns.
* **Multi-User Collaboration**: Mapping team execution models and shared portfolio visibility.
* **Native Cloud Deployment**: Fully migrating out to AWS EC2 or GCP Cloud Run architectures.
