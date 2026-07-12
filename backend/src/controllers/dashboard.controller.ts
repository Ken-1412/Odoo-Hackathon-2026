// ─── Dashboard Controller ───────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getEmployeeStats();
      sendSuccess(res, stats);
    } catch (error) { next(error); }
  }

  async getAdminStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getAdminStats();
      sendSuccess(res, stats);
    } catch (error) { next(error); }
  }

  async getUtilization(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getUtilizationByDepartment();
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getMaintenanceFrequency(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getMaintenanceFrequency();
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getMostUsed(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getMostUsedAssets();
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await dashboardService.getRecentActivity(undefined, limit);
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }
}

export default new DashboardController();
