import { type NewLibraryArticle } from '../db/schema/library-articles.js';
export declare class LibraryService {
    listPublished(category?: string): Promise<{
        id: number;
        authorId: number;
        title: string;
        content: string;
        category: string;
        status: string;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    listAll(): Promise<{
        id: number;
        authorId: number;
        title: string;
        content: string;
        category: string;
        status: string;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        authorId: number;
        title: string;
        content: string;
        category: string;
        status: string;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: NewLibraryArticle): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        content: string;
        tags: string | null;
        authorId: number;
        category: string;
    }>;
    update(id: number, userId: number, role: string, data: Partial<NewLibraryArticle>): Promise<{
        id: number;
        authorId: number;
        title: string;
        content: string;
        category: string;
        status: string;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: number, userId: number, role: string): Promise<void>;
    getCategories(): Promise<string[]>;
}
//# sourceMappingURL=library.service.d.ts.map