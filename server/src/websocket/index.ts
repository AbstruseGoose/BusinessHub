import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { WebSocketEvent } from '@businesshub/shared';

export const initializeWebSocket = (io: Server) => {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.email}`);

    // Join user to their business rooms
    socket.on('join-business', (businessId: string) => {
      socket.join(`business:${businessId}`);
      console.log(`User ${socket.data.user.email} joined business ${businessId}`);
    });

    // Leave business room
    socket.on('leave-business', (businessId: string) => {
      socket.leave(`business:${businessId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.email}`);
    });
  });

  return io;
};

// Helper functions to emit events
export const emitNewEmail = (io: Server, businessId: string, emailData: any) => {
  io.to(`business:${businessId}`).emit(WebSocketEvent.NEW_EMAIL, emailData);
};

export const emitNewCall = (io: Server, businessId: string, callData: any) => {
  io.to(`business:${businessId}`).emit(WebSocketEvent.NEW_CALL, callData);
};

export const emitCalendarUpdate = (io: Server, businessId: string, eventData: any) => {
  io.to(`business:${businessId}`).emit(WebSocketEvent.CALENDAR_UPDATE, eventData);
};

export const emitTaskUpdate = (io: Server, businessId: string, taskData: any) => {
  io.to(`business:${businessId}`).emit(WebSocketEvent.TASK_UPDATE, taskData);
};
