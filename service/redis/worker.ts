import { Worker, Job } from "bullmq";
import redis from "./init";
import prisma from "../../prisma/prisma";
import notificationQueue from "./producer";
import { sendNotificationToUser } from "../socket.service";

const notificationWorker = new Worker("notifications", async (job: Job) => {
    const { userId, type, message, data } = job.data;
    try {
        const user = await prisma.users.findFirst({
            where: {
                id: userId
            }
        });
        
        if (user) {
            // Save to database
            await prisma.notifications.create({
                data: {
                    userId,
                    type,
                    message,
                    data: JSON.stringify(data || {})
                }
            });

            // Send real-time notification via Socket.io
            if (global.io) {
                sendNotificationToUser(global.io, { userId, type, message, data });
            }
        }
    } catch (error) {
        console.error("Error processing notification job:", error);
        throw error;
    }
}, {
    connection: redis,
    concurrency: 5
});

notificationWorker.on("completed", (job) => {
    console.log(`Notification job ${job?.id} completed successfully.`);
});

notificationWorker.on("failed", (job, err) => {
    if (job) {
        console.error(`Notification job ${job.id} failed with error:`, err);
    } else {
        console.error("A notification job failed without a job reference:", err);
    }
});

export default notificationWorker;
