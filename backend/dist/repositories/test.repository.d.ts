import { type MentalTest, type NewMentalTest } from '../db/schema/mental-tests.js';
export declare class TestRepository {
    findByUserId(userId: number, page: number, limit: number): Promise<{
        entries: MentalTest[];
        total: number;
    }>;
    findById(id: number): Promise<MentalTest | undefined>;
    create(data: NewMentalTest): Promise<MentalTest>;
}
//# sourceMappingURL=test.repository.d.ts.map