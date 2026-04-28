# Pokerinee

A high-performance, real-time multiplayer Poker engine. This project features a distributed architecture that separates the heavy game logic from the user-facing API to ensure sub-millisecond state synchronization and high availability.

## 🏗 Architecture

The system is split into three primary layers to ensure scalability and type safety:

- **Game Server (Bun)**: A high-speed engine utilizing `@ws-kit/bun` for real-time WebSocket communication and `@pokertools/evaluator` for heavy hand-evaluation logic.
- **Backend (Node.js/Bun)**: A runtime-agnostic API handling session management, authentication, and persistence. Built with **tRPC** for a 100% type-safe bridge between the server and client.
- **Frontend (React)**: A responsive interface built with **Vite**, using **Zustand** for local state management and `@ws-kit/client` for low-latency game feeds.

## 🛠 Tech Stack

- **Runtimes**: Bun (Game logic & speed), Node.js (Standard API support)
- **Communication**: tRPC (Internal API), @ws-kit (WebSocket Protocol)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod (End-to-end schema validation across the full stack)
- **State**: Zustand (Frontend store)

## 🚀 Key Engineering Highlights

### 1. Unified Type Safety
By using **Zod** and **tRPC**, every data structure—from the database schema to the WebSocket message payload—is shared. This eliminates runtime errors during complex game actions (e.g., betting rounds, hand showdowns).

### 2. High-Performance WebSocket Protocol
The project migrated from Socket.io to **@ws-kit** to leverage the native speed of the Bun runtime and to implement a more lightweight, schema-based communication layer that reduces overhead during high production load.

### 3. Distributed Persistence
The engine handles high-concurrency game states in memory while periodically persisting critical session data to **PostgreSQL** via **Prisma**, ensuring that the system is resilient to restarts without sacrificing gameplay speed.
