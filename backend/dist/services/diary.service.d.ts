import { DiaryRepository } from '../repositories/diary.repository.js';
export declare class DiaryService {
    private diaryRepo;
    constructor(diaryRepo: DiaryRepository);
    getEntries(userId: number, page: number, limit: number): Promise<{
        entries: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            content: string;
            mood: string;
            tags: string | null;
        }[];
        total: number;
    }>;
    getEntry(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        mood: string;
        tags: string | null;
    }>;
    createEntry(userId: number, data: {
        content: string;
        mood: string;
        tags?: string[];
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        mood: string;
        tags: string | null;
    }>;
    updateEntry(id: number, userId: number, data: Partial<{
        content: string;
        mood: string;
        tags?: string[];
    }>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        mood: string;
        tags: string | null;
    }>;
    deleteEntry(id: number, userId: number): Promise<void>;
}
//# sourceMappingURL=diary.service.d.ts.map