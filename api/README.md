# CareerCatalyst — API (Express + MongoDB)

This is the Node.js backend for CareerCatalyst.  
It connects to MongoDB, manages authentication, and proxies user interests to the ML microservice.

## Setup

```bash
cd api
npm install
npm run dev
```

## Endpoints

- `GET /health` → `{ ok: true }`
- `POST /auth/register` → `{ id, email }`
- `POST /auth/login` → `{ token }`
- `POST /ml/classify` (protected) → `{ role, probabilities, user }`

> Requires `Authorization: Bearer <token>` header.

## Environment Variables (.env)

```
MONGO_URI=mongodb://localhost:27017/careercatalyst
JWT_SECRET=supersecret
PORT=8080
ML_BASE_URL=http://localhost:8001
```

## Run

```bash
npm run dev
# API → http://localhost:8080
```