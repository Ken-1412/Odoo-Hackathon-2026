// ─── Maintenance Controller ─────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import maintenanceService from '../services/maintenance.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { createMaintenanceSchema, advanceMaintenanceSchema } from '../validators/common.validator';
import { parsePagination } from '../utils/pagination';
import { getParam } from '../utils/params';
import { uploadToCloudinary } from '../middlewares/upload';
import prisma from '../config/database';

class MaintenanceController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const { data, total } = await maintenanceService.getAll(req.query);
      sendPaginated(res, data, total, page, limit);
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await maintenanceService.getById(getParam(req, 'id'));
      sendSuccess(res, ticket);
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createMaintenanceSchema.parse(req.body);
      const ticket = await maintenanceService.create(data, req.user!.id);
      sendSuccess(res, ticket, 'Maintenance request created', 201);
    } catch (error) { next(error); }
  }

  async advance(req: Request, res: Response, next: NextFunction) {
    try {
      const data = advanceMaintenanceSchema.parse(req.body);
      const id = getParam(req, 'id');
      const ticket = await maintenanceService.advance(id, req.user!.id, data.technicianName, data.notes);
      sendSuccess(res, ticket, 'Maintenance ticket advanced');
    } catch (error) { next(error); }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('No file uploaded');
      const id = getParam(req, 'id');
      const imageUrl = await uploadToCloudinary(req.file.path, 'assetflow/maintenance');
      const updated = await prisma.maintenanceRequest.update({ where: { id }, data: { imageUrl } });
      sendSuccess(res, updated, 'Image uploaded');
    } catch (error) { next(error); }
  }
}

export default new MaintenanceController();
