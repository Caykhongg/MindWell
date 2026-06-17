import { type DiaryEntry, type NewDiaryEntry } from '../db/schema/diary-entries.js';
export declare class DiaryRepository {
    findByUserId(userId: number, page: number, limit: number): Promise<{
        entries: DiaryEntry[];
        total: number;
    }>;
    findById(id: number): Promise<DiaryEntry | undefined>;
    create(data: NewDiaryEntry): Promise<DiaryEntry>;
    update(id: number, data: Partial<NewDiaryEntry>): Promise<DiaryEntry | undefined>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=diary.repository.d.ts.map