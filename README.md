# ChatSphere — Real-Time Chat Application

A full-stack, real-time 1-to-1 chat application built with React (Vite) on the frontend and Node.js/Express/Socket.io/MongoDB on the backend. Authentication is passwordless — sign in with a unique username or a 10-digit mobile number.

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Socket.io Client, Tailwind CSS
**Backend:** Node.js, Express.js, Socket.io, MongoDB, Mongoose

## Features

- Passwordless login (username or mobile number) — auto-registers new users, auto-logs-in existing ones
- Real-time messaging via Socket.io (no polling, no SSE, no Firebase)
- Persistent chat history stored in MongoDB, reloaded on refresh
- Online/offline presence, updated live
- Typing indicators ("X is typing…")
- Message status ticks: Sent → Delivered → Read
- Emoji picker
- Auto-scroll to newest message, chronological ordering
- Empty-message validation, friendly error banners for network/socket failures
- Graceful reconnect handling and duplicate-connection cleanup
- Responsive: mobile, tablet, and desktop layouts
- Basic security: Helmet, CORS, input validation, request sanitization, environment variables

## Project Structure

```
chat-app/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handler logic
│   ├── models/          # Mongoose schemas (User, Message)
│   ├── routes/          # Express routers
│   ├── middleware/      # Error handling
│   ├── socket/          # Socket.io event handlers
│   ├── utils/           # asyncHandler, ApiError
│   ├── validators/      # Request validation
│   ├── constants/       # Shared socket event names
│   ├── app.js           # Express app configuration
│   ├── server.js        # Entry point (HTTP + Socket.io + DB bootstrap)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/          # Axios client
    │   ├── services/     # API call wrappers (auth, users, messages)
    │   ├── context/      # AuthContext, SocketContext
    │   ├── hooks/         # useAuth, useSocket, useConversation, useUserList, useTypingIndicator
    │   ├── components/    # Sidebar, Chat, common
    │   ├── pages/         # Login, ChatPage
    │   ├── layouts/       # MainLayout (nav rail + content)
    │   ├── utils/         # formatTime, validators
    │   ├── constants/     # socketEvents, appConstants
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MONGO_URI if not using the local default
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` by default.

### 3. Try it out

Open two browser windows (or a normal + incognito window) at `http://localhost:5173`, log in with two different usernames, and start chatting — messages, typing indicators, and online status all update in real time.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/realtime-chat-app
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## REST API Reference

| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| POST   | /api/auth/login         | Login or auto-register by username/mobile |
| POST   | /api/auth/logout        | Mark user offline                    |
| GET    | /api/users               | List all users (except `exclude`)    |
| GET    | /api/users/online         | List currently online users          |
| GET    | /api/messages?userId=&withUser= | Fetch chat history between two users |
| POST   | /api/messages             | Persist a new message                |
| PATCH  | /api/messages/read        | Mark a conversation as read          |

## Socket.io Events

`join`, `send-message`, `receive-message`, `typing`, `stop-typing`, `user-online`, `user-offline`, `message-delivered`, `message-read`, plus standard `connection` / `disconnect`.
