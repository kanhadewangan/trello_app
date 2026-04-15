import { Queue } from "bullmq";
import redis from "./init";
import prisma from "../../prisma/prisma";

export interface NotificationPayload {
    userId: string;
  type: string;
  message: string;
  data?: object;
}




const notificationQueue = new Queue("notifications", {
    connection: redis,
    defaultJobOptions: {
       attempts: 3,
       backoff: {
         type: "exponential",
         delay: 5000
       },
         removeOnComplete: true,
         removeOnFail: false
      }
    })


export default notificationQueue;