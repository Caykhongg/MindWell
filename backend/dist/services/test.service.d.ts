import { TestRepository } from '../repositories/test.repository.js';
export declare class TestService {
    private testRepo;
    constructor(testRepo: TestRepository);
    getEntries(userId: number, page: number, limit: number): Promise<{
        entries: {
            answers: any;
            id: number;
            createdAt: Date;
            userId: number;
            result: string;
            score: number;
            testType: string;
        }[];
        total: number;
    }>;
    getEntry(id: number, userId: number): Promise<{
        answers: any;
        id: number;
        createdAt: Date;
        userId: number;
        result: string;
        score: number;
        testType: string;
    }>;
    createEntry(userId: number, data: {
        answers: number[];
        testType: string;
    }): Promise<{
        answers: number[];
        id: number;
        createdAt: Date;
        userId: number;
        result: string;
        score: number;
        testType: string;
    }>;
}
//# sourceMappingURL=test.service.d.ts.map