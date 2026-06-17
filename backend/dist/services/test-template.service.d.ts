import { TestTemplateRepository } from '../repositories/test-template.repository.js';
export declare class TestTemplateService {
    private repo;
    constructor(repo: TestTemplateRepository);
    list(): Promise<({
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: import("../db/schema/test-templates.js").TestQuestion[];
    })[]>;
    getById(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: import("../db/schema/test-templates.js").TestQuestion[];
    }>;
    create(userId: number, data: {
        title: string;
        description?: string;
        questions: {
            questionText: string;
            options: {
                label: string;
                value: number;
            }[];
            orderIndex: number;
        }[];
    }): Promise<({
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: import("../db/schema/test-templates.js").TestQuestion[];
    }) | undefined>;
    update(id: number, userId: number, role: string, data: {
        title?: string;
        description?: string;
        questions?: {
            questionText: string;
            options: {
                label: string;
                value: number;
            }[];
            orderIndex: number;
        }[];
    }): Promise<({
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: import("../db/schema/test-templates.js").TestQuestion[];
    }) | undefined>;
    delete(id: number, userId: number, role: string): Promise<void>;
}
//# sourceMappingURL=test-template.service.d.ts.map