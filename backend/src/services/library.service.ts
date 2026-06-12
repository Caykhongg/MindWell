import { eq, desc, and } from 'drizzle-orm';
import { db } from '../config/database.js';
import { libraryArticles, type LibraryArticle, type NewLibraryArticle } from '../db/schema/library-articles.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export class LibraryService {
  async listPublished(category?: string) {
    const conditions = [eq(libraryArticles.status, 'published')];
    if (category) conditions.push(eq(libraryArticles.category, category));

    return db
      .select()
      .from(libraryArticles)
      .where(and(...conditions))
      .orderBy(desc(libraryArticles.createdAt));
  }

  async listAll() {
    return db
      .select()
      .from(libraryArticles)
      .orderBy(desc(libraryArticles.createdAt));
  }

  async getById(id: number) {
    const article = await db
      .select()
      .from(libraryArticles)
      .where(eq(libraryArticles.id, id))
      .limit(1);

    if (!article[0]) throw new NotFoundError('bài viết');
    return article[0];
  }

  async create(data: NewLibraryArticle) {
    const result = await db.insert(libraryArticles).values(data).returning();
    return result[0];
  }

  async update(id: number, userId: number, role: string, data: Partial<NewLibraryArticle>) {
    const article = await this.getById(id);
    if (article.authorId !== userId && role !== 'admin') {
      throw new ForbiddenError('Bạn không có quyền sửa bài viết này');
    }

    const result = await db
      .update(libraryArticles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(libraryArticles.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number, userId: number, role: string) {
    const article = await this.getById(id);
    if (article.authorId !== userId && role !== 'admin') {
      throw new ForbiddenError('Bạn không có quyền xoá bài viết này');
    }

    await db.delete(libraryArticles).where(eq(libraryArticles.id, id));
  }

  async getCategories() {
    const result = await db
      .select({ category: libraryArticles.category })
      .from(libraryArticles)
      .where(eq(libraryArticles.status, 'published'))
      .groupBy(libraryArticles.category);
    return result.map(r => r.category);
  }
}
