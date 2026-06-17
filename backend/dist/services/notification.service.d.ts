import { type NewNotification } from '../db/schema/notifications.js';
export declare class NotificationService {
    list(userId: number): Promise<{
        id: number;
        userId: number;
        type: string;
        title: string;
        message: string | null;
        relatedId: number | null;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    create(data: NewNotification): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        type: string;
        title: string;
        message: string | null;
        relatedId: number | null;
        isRead: boolean;
    }>;
    markRead(id: number, userId: number): Promise<void>;
    markAllRead(userId: number): Promise<void>;
    unreadCount(userId: number): Promise<number>;
}
//# sourceMappingURL=notification.service.d.ts.map