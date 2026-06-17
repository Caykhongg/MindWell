export declare function success<T>(data: T, meta?: Record<string, unknown>): {
    meta?: Record<string, unknown> | undefined;
    success: true;
    data: T;
};
export declare function paginated<T>(data: T[], total: number, page: number, limit: number): {
    success: true;
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
export declare function errorResponse(code: string, message: string, details?: unknown): {
    success: false;
    error: {
        details?: {} | undefined;
        code: string;
        message: string;
    };
};
//# sourceMappingURL=response.d.ts.map