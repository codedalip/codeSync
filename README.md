# CodeSync — Real-Time Collaborative IDE Platform

CodeSync is a high-performance, fullstack real-time collaborative code editor and pair-programming platform built with React, Monaco Editor, Node.js, Express, Socket.IO, and MongoDB.

Designed for modern engineering teams, CodeSync allows multiple developers to edit code simultaneously in shared workspaces, view live remote cursors, execute multi-language source code in integrated terminals, communicate via dedicated room streams, and leverage integrated AI assistance.

---

## Key Features

- **Real-Time Multi-User Pair Programming**: Live collaborative editing powered by WebSockets. Includes remote cursor tracking, selection highlighting, line-shift delta calculations, and collision-free state synchronization.
- **Multi-Language Sandbox Compiler**: Execute C++, Python, JavaScript, and Java directly within the browser with live STDIN/STDOUT execution output and compilation diagnostics.
- **Workspace & Room Management**: Create and join collaborative rooms using secure join codes. Features active user presence tracking and dedicated room chat channels.
- **Integrated AI Code Assistant**: Sidebar AI co-pilot powered by Gemini API for code generation, bug fixing, and algorithmic refactoring.
- **Persistent View & Session Routing**: Session-based navigation preservation allowing page reloads without losing active workspace states or landing page scroll positions.
- **Monochrome Design System**: Professional dark mode and light mode interfaces with glassmorphic elements and high-contrast typography.

---

## Tech Stack & Architecture

### Frontend
- **Framework**: React 18, Vite
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **State Management**: Zustand
- **Real-Time Transport**: Socket.IO Client
- **Animations & Layout**: Framer Motion, Tailwind CSS, Lucide Icons

### Backend
- **Runtime & Server**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO
- **Database & ORM**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js

---

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster (Optional: built-in in-memory fallback enabled for local testing)

---

## Installation & Setup

### 1. Repository Setup

```bash
git clone https://github.com/codedalip/codeSync.git
cd codeSync
```

### 2. Backend Installation & Execution

```bash
cd backend
npm install
npm run dev
```

The backend server will initialize on `http://localhost:5000`.

### 3. Frontend Installation & Execution

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.

---

## Environment Configuration

### Backend Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codesync
JWT_SECRET=your_production_jwt_secret_key
NODE_ENV=development
```

### Frontend Environment Variables (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Production Deployment

### Backend Deployment (Render / Railway)

1. Deploy the `backend/` directory as a Web Service.
2. Set `Build Command` to `npm install`.
3. Set `Start Command` to `node server.js`.
4. Configure environment variables `PORT`, `JWT_SECRET`, and `NODE_ENV=production`.

### Frontend Deployment (Vercel / Netlify)

1. Import the repository and set the root directory to `frontend/`.
2. Set build command to `npm run build` and output directory to `dist`.
3. Configure `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your deployed backend URL.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
