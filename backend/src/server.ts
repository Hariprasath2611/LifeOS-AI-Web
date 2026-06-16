import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes imports
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import habitRoutes from './routes/habit.routes.js';
import goalRoutes from './routes/goal.routes.js';
import noteRoutes from './routes/note.routes.js';
import learningRoutes from './routes/learning.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io integration
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from frontend dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Mount APIs
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`📡 Socket client connected: ${socket.id}`);

  // Mock AI coaching typing status simulator
  socket.on('ai_typing_start', () => {
    socket.broadcast.emit('ai_typing_state', { typing: true });
  });

  socket.on('ai_typing_stop', () => {
    socket.broadcast.emit('ai_typing_state', { typing: false });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 LifeOS AI server executing on port ${PORT}`);
});
