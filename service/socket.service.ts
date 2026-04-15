import { Server, Socket } from "socket.io";

interface NotificationPayload {
    userId: string;
    type: string;
    message: string;
    data?: object;
}

export function initializeSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);
        
        // Handle user joining their notification room
        socket.on("join", (userId: string) => {
            socket.join(`user:${userId}`);
            console.log(`User ${userId} joined notification room`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

/**
 * Send a notification to a specific user in real-time
 * @param io Socket.io server instance
 * @param notification Notification payload with userId, type, message, data
 */
export function sendNotificationToUser(io: Server, notification: NotificationPayload) {
    // Send to specific user's room
    io.to(`user:${notification.userId}`).emit("notification", {
        type: notification.type,
        message: notification.message,
        data: notification.data,
        timestamp: new Date(),
    });
    console.log(`Notification sent to user ${notification.userId}: ${notification.message}`);
}

/**
 * Broadcast a notification to multiple users
 * @param io Socket.io server instance
 * @param userIds Array of user IDs to notify
 * @param notification Notification payload
 */
export function broadcastNotification(io: Server, userIds: string[], notification: Omit<NotificationPayload, 'userId'>) {
    userIds.forEach(userId => {
        sendNotificationToUser(io, { ...notification, userId });
    });
}