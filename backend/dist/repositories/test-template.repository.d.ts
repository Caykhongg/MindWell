import { type TestTemplate, type NewTestTemplate, type TestQuestion } from '../db/schema/test-templates.js';
export declare class TestTemplateRepository {
    findAll(): Promise<(TestTemplate & {
        questions: TestQuestion[];
    })[]>;
    findById(id: number): Promise<(TestTemplate & {
        questions: TestQuestion[];
    }) | undefined>;
    create(data: NewTestTemplate, questions: {
        questionText: string;
        options: {
            label: string;
            value: number;
        }[];
        orderIndex: number;
    }[]): Promise<({
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: TestQuestion[];
    }) | undefined>;
    update(id: number, data: Partial<NewTestTemplate>, questions?: {
        questionText: string;
        options: {
            label: string;
            value: number;
        }[];
        orderIndex: number;
    }[]): Promise<({
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        createdBy: number;
    } & {
        questions: TestQuestion[];
    }) | undefined>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=test-template.repository.d.ts.map