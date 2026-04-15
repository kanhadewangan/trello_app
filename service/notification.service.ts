import notificationQueue from './redis/producer';
import type { NotificationPayload } from './redis/producer';

export interface NotificationEvent {
    userId: string;
    type: 'BOARD_INVITATION' | 'GROUP_INVITATION' | 'CARD_ASSIGNED' | 'CARD_MOVED' | 'COMMENT_ADDED' | 'CARD_DUE_SOON';
    message: string;
    data?: {
        boardId?: string;
        cardId?: string;
        listId?: string;
        groupId?: string;
        actorId?: string;
        actorName?: string;
        [key: string]: any;
    };
}

class NotificationService {
    /**
     * Send notification (queues it for processing)
     */
    async sendNotification(event: NotificationEvent): Promise<void> {
        try {
            await notificationQueue.add('notification', {
                userId: event.userId,
                type: event.type,
                message: event.message,
                data: event.data,
            });
        } catch (error) {
            console.error('Error queuing notification:', error);
            throw error;
        }
    }

    /**
     * Send notifications to multiple users
     */
    async broadcastNotification(userIds: string[], event: Omit<NotificationEvent, 'userId'>): Promise<void> {
        try {
            const jobs = userIds.map(userId =>
                notificationQueue.add('notification', {
                    userId,
                    type: event.type,
                    message: event.message,
                    data: event.data,
                })
            );
            await Promise.all(jobs);
        } catch (error) {
            console.error('Error broadcasting notifications:', error);
            throw error;
        }
    }

    /**
     * Board Invitation
     */
    async notifyBoardInvitation(invitedUserId: string, invitarName: string, boardTitle: string, boardId: string): Promise<void> {
        await this.sendNotification({
            userId: invitedUserId,
            type: 'BOARD_INVITATION',
            message: `${invitarName} invited you to "${boardTitle}"`,
            data: { boardId }
        });
    }

    /**
     * Group Invitation
     */
    async notifyGroupInvitation(invitedUserId: string, inviterName: string, groupName: string, groupId: string): Promise<void> {
        await this.sendNotification({
            userId: invitedUserId,
            type: 'GROUP_INVITATION',
            message: `${inviterName} invited you to group "${groupName}"`,
            data: { groupId }
        });
    }

    /**
     * Card Assignment
     */
    async notifyCardAssignment(userId: string, assignerName: string, cardTitle: string, boardTitle: string, cardId: string, boardId: string): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'CARD_ASSIGNED',
            message: `${assignerName} assigned you to "${cardTitle}" in "${boardTitle}"`,
            data: { cardId, boardId }
        });
    }

    /**
     * Card Moved
     */
    async notifyCardMoved(userId: string, moverName: string, cardTitle: string, fromList: string, toList: string, boardTitle: string, boardId: string, cardId: string): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'CARD_MOVED',
            message: `${moverName} moved "${cardTitle}" from "${fromList}" to "${toList}" in "${boardTitle}"`,
            data: { cardId, boardId }
        });
    }

    /**
     * Comment Added to Card
     */
    async notifyCommentAdded(userId: string, commenterName: string, cardTitle: string, boardTitle: string, cardId: string, boardId: string): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'COMMENT_ADDED',
            message: `${commenterName} commented on "${cardTitle}" in "${boardTitle}"`,
            data: { cardId, boardId }
        });
    }

    /**
     * Card Due Soon
     */
    async notifyCardDueSoon(userId: string, cardTitle: string, boardTitle: string, dueDate: string, cardId: string, boardId: string): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'CARD_DUE_SOON',
            message: `"${cardTitle}" in "${boardTitle}" is due on ${new Date(dueDate).toLocaleDateString()}`,
            data: { cardId, boardId }
        });
    }
}

export default new NotificationService();
