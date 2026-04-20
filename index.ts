import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/user.route';
import boardRoutes from './routes/board.route';
import cardRoutes from './routes/card.route';
import testDataRoutes from './routes/test-data.route';
import listRoutes from './routes/list.route';
import invitationRoutes from './routes/invitation.route';
import notificationRoutes from './routes/notification.route';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocket } from './service/socket.service';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
    }
});

app.use(express.json());
app.use(cors({
    origin: "*"
}))

// Initialize socket.io handlers
initializeSocket(io);

app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/cards', cardRoutes);
app.use('/test-data', testDataRoutes);
app.use('/lists', listRoutes);
app.use('/groups', invitationRoutes);
app.use('/notifications', notificationRoutes);

// Make io globally accessible for notification worker
global.io = io;

httpServer.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'))
