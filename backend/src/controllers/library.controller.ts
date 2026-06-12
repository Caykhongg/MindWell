import type { Response } from 'express';
import { LibraryService } from '../services/library.service.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const service = new LibraryService();

export const libraryController = {
  list: asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = req.query.category as string | undefined;
    const articles = await service.listPublished(category);
    res.json(success(articles));
  }),

  listAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const articles = await service.listAll();
    res.json(success(articles));
  }),

  detail: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const article = await service.getById(id);
    res.json(success(article));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, category, tags, status } = req.body;
    const article = await service.create({
      authorId: req.userId!,
      title,
      content,
      category: category || 'general',
      tags: tags || null,
      status: status || 'draft',
    });
    res.status(201).json(success(article));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const { title, content, category, tags, status } = req.body;
    const article = await service.update(id, req.userId!, req.userRole ?? 'patient', { title, content, category, tags, status });
    res.json(success(article));
  }),

  remove: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await service.delete(id, req.userId!, req.userRole ?? 'patient');
    res.json(success({ message: 'Đã xoá bài viết' }));
  }),

  categories: asyncHandler(async (_req: AuthRequest, res: Response) => {
    const cats = await service.getCategories();
    res.json(success(cats));
  }),
};
