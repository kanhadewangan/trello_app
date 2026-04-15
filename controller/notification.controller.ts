import type { Request, Response } from 'express';
import prisma from '../prisma/prisma';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const offset = parseInt(req.query.offset as string) || 0;

        const notifications = await prisma.notifications.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const count = await prisma.notifications.count({
            where: {
                userId,
                read: false,
            },
        });

        res.status(200).json({ count });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const notificationId = Array.isArray(req.params.notificationId) 
            ? req.params.notificationId[0] 
            : req.params.notificationId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const notification = await prisma.notifications.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        const updated = await prisma.notifications.update({
            where: { id: notificationId },
            data: { read: true },
        });

        res.status(200).json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await prisma.notifications.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const notificationId = Array.isArray(req.params.notificationId) 
            ? req.params.notificationId[0] 
            : req.params.notificationId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const notification = await prisma.notifications.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        await prisma.notifications.delete({
            where: { id: notificationId },
        });

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await prisma.notifications.deleteMany({
            where: { userId },
        });

        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
