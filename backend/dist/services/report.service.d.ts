export declare class ReportService {
    create(reporterId: number, data: {
        postId: number;
        reason: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        reason: string;
        postId: number;
        reporterId: number;
        isResolved: boolean;
    }>;
    list(): Promise<{
        id: number;
        postId: number;
        reporterId: number;
        reason: string;
        isResolved: boolean;
        createdAt: Date;
    }[]>;
    resolve(id: number, action: 'delete' | 'dismiss'): Promise<{
        id: number;
        postId: number;
        reporterId: number;
        reason: string;
        isResolved: boolean;
        createdAt: Date;
    } | null>;
}
//# sourceMappingURL=report.service.d.ts.map