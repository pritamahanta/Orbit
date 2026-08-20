# Orbit

Orbit is a full-stack job portal and recruitment platform built with a separated frontend and backend architecture. It supports user registration, JWT-based authentication, company and job management, applicant tracking, file uploads via Cloudinary, and request rate limiting through Redis.

## Overview

This project is structured as a modern SaaS-style job platform with:
- React + Vite frontend for the UI
- Express + Node.js backend for APIs
- MongoDB as the primary database
- Redis for rate limiting and in-memory request tracking
- Cloudinary for image upload storage
- Docker Compose for local orchestration

## Core Features
- User signup/login with JWT authentication
- Protected admin routes and authenticated access control
- Company creation and management
- Job posting, browsing, and filtering
- Job application flow with applicant tracking
- User profile updates and image upload support
- Redis-backed rate limiting to prevent abuse
- Dockerized local development setup

## Tech Stack
- Frontend: React, Vite, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Cache / rate limiting: Redis
- Authentication: JWT
- File storage: Cloudinary
- Containerization: Docker + Docker Compose

## Project Structure

```text
orbit/
├── backend/
│   ├── config/
│   │   └── redis.js
│   ├── controllers/
│   ├── middlewares/
│   │   ├── isAuthenticated.js
│   │   ├── multer.js
│   │   └── rateLimiter.js
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── datauri.js
│   │   └── db.js
│   ├── .env
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Prerequisites

Before running the app locally, ensure you have:
- Node.js 18+ or newer
- npm
- Docker and Docker Compose
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account
- Redis (optional if using Docker Compose)

## Environment Variables

### Backend
Create a `.env` file inside `backend/`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
REDIS_URL=redis://redis:6379
```

Notes:
- `PORT` is the Express server port.
- `MONGODB_URI` connects the backend to MongoDB.
- `SECRET_KEY` is used to sign JWT tokens.
- `REDIS_URL` is required for Redis-backed rate limiting.
- Cloudinary values are used for image uploads.

### Frontend
Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

This is used by the React app to call the backend API.

## Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Redis: localhost:6379

To stop services:

```bash
docker compose down
```

## Run Manually

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on port `8000` by default.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

The frontend is served on:
- http://localhost:5173

## API Base URL

```text
http://localhost:8000/api/v1
```

Main route groups:
- `/api/v1/user`
- `/api/v1/company`
- `/api/v1/job`
- `/api/v1/application`

## Docker Files

The repository includes container setup for both app layers:
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

The backend Dockerfile runs the Express app directly, while the frontend Dockerfile runs the Vite dev server for local development.

## Important Implementation Notes

- Redis is initialized in `backend/config/redis.js` and used in `backend/middlewares/rateLimiter.js`.
- The app uses `ioredis` with `REDIS_URL` configured for request throttling.
- Authentication middleware is enforced for protected company, job, and application routes.
- File uploads are handled with Multer and Cloudinary integration.
- CORS is configured to allow the frontend origin: `http://localhost:5173`.

## Current Status

This project is configured for local development and Docker-based orchestration. There is no production deployment configuration or automated test suite configured in the repo at the moment.

## Recommended Workflow

1. Copy the required `.env` values into both backend and frontend.
2. Start dependencies with Docker Compose or Redis + MongoDB manually.
3. Start backend and frontend.
4. Access the app at http://localhost:5173.
5. Use the backend API at http://localhost:8000/api/v1.

## License

This project currently does not specify a license file. Add one before production use if you plan to distribute the code publicly.

