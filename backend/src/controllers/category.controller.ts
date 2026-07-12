// ─── Category Controller ────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createCategorySchema, updateCategorySchema } from '../validators/common.validator';
import { parsePagination } from '../utils/pagination';
import { getParam } from '../utils/params';

class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const { data, total } = await categoryService.getAll(req.query);
      sendPaginated(res, data, total, page, limit);
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.getById(getParam(req, 'id'));
      sendSuccess(res, cat);
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCategorySchema.parse(req.body);
      const cat = await categoryService.create(data, req.user!.id);
      sendSuccess(res, cat, 'Category created', 201);
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCategorySchema.parse(req.body);
      const cat = await categoryService.update(getParam(req, 'id'), data, req.user!.id);
      sendSuccess(res, cat, 'Category updated');
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(getParam(req, 'id'), req.user!.id);
      sendSuccess(res, null, 'Category deleted');
    } catch (error) { next(error); }
  }
}

export default new CategoryController();
