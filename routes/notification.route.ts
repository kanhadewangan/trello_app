import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from '../controller/notification.controller';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/:notificationId', authenticateToken, deleteNotification);
router.delete('/clear-all', authenticateToken, clearAllNotifications);

export default router;
