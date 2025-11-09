# Zylectra Monorepo

This repository contains the full-stack Zylectra application, including:

- **Web Dashboard** (`React`)
- **Mobile App** (`React Native CLI`)
- **Backend API** (`Hono.js`)
- **ML Backend / FastAPI** (`Python`, `FastAPI`, `PyTorch`)

The project is organized as a **monorepo** with Docker Compose support for local development.

---

## Repository Structure

```

apps/
    ├─ web/
    └─ mobile/
services/
    ├─ backend-api/
    └─ ml-backend/
docker-compose.yml

```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (for local React Native builds)
- Android/iOS emulator or device (for React Native CLI)

---

### 1. Clone the repo

```bash
git clone <REPO_URL>
cd zylectra
```

---

### 2. Start all services with Docker Compose

```bash
docker-compose up --build
```

This will start:

- **Web dashboard** → [http://localhost:3000](http://localhost:3000)
- **React Native Metro bundler** → [http://localhost:8081](http://localhost:8081)
- **Backend API (Hono.js)** → [http://localhost:8080](http://localhost:8080)
- **ML Backend (FastAPI)** → [http://localhost:8000](http://localhost:8000)

> ⚠️ For the mobile app, you still need to run `react-native run-android` or `react-native run-ios` locally. Make sure your device/emulator can connect to the Metro bundler on `localhost:8081`.

---

### 3. Development Notes

- **Hot-reload** is enabled for web, backend-api, and ML backend via Docker volumes.
- **Mobile app** code changes are detected by Metro bundler; rebuilds require running on a device/emulator.

---

## Tech Stack

| Layer            | Tech Stack                                     |
| ---------------- | ---------------------------------------------- |
| Frontend Web     | React, TailwindCSS, JavaScript/TypeScript      |
| Mobile App       | React Native CLI, TypeScript                   |
| Backend API      | Hono.js, Node.js, Bun                          |
| ML Backend / API | Python, FastAPI, PyTorch, Pandas, Scikit-learn |

---

## Docker

- **Dockerfiles** are in each service folder (`apps/*/Dockerfile`, `services/*/Dockerfile`).
- Docker Compose runs all services together.
- Volumes are configured for hot-reload in development.

---

## Usage

- To rebuild containers:

```bash
docker-compose up --build
```

- To stop containers:

```bash
docker-compose down
```

- To view logs:

```bash
docker-compose logs -f
```

---

## Git

- `.gitignore` covers node_modules, build folders, Docker artifacts, Python caches, and OS/editor files.
- Make sure to stage only the necessary files before pushing.

---

## References

- [React](https://reactjs.org/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Hono.js](https://hono.dev/)
- [Docker](https://www.docker.com/)
