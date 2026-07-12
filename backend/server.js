import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/db.js';
import registerSocketHandlers from './socket/socketService.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

registerSocketHandlers(io);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Server] Shutting down gracefully...');
  server.close(() => process.exit(0));
});
