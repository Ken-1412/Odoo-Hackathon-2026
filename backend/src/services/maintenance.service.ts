// ─── Maintenance Service ────────────────────────────────────────────────────
import maintenanceRepo from '../repositories/maintenance.repository';
import activityLogRepo from '../repositories/activitylog.repository';
import notificationRepo from '../repositories/notification.repository';
import { AppError } from '../middlewares/errorHandler';
import { parsePagination } from '../utils/pagination';

class MaintenanceService {
  async getAll(query: Record<string, any>) {
    const { skip, take, orderBy } = parsePagination(query);
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.assetId) where.assetId = query.assetId;
    if (query.search) {
      where.OR = [
        { issue: { contains: query.search, mode: 'insensitive' } },
        { asset: { tag: { contains: query.search, mode: 'insensitive' } } },
      ];
    }
    return maintenanceRepo.findAll({ skip, take, where, orderBy });
  }

  async getById(id: string) {
    const ticket = await maintenanceRepo.findById(id);
    if (!ticket) throw new AppError('Maintenance request not found', 404);
    return ticket;
  }

  async create(data: any, userId: string) {
    const ticket = await maintenanceRepo.create({
      issue: data.issue,
      notes: data.notes,
      asset: { connect: { id: data.assetId } },
      requestedBy: { connect: { id: userId } },
    });

    await activityLogRepo.create({ action: 'MAINTENANCE_REQUESTED', targetResource: 'Maintenance', targetId: ticket.id, details: `Maintenance requested: "${data.issue}" for ${ticket.asset.tag}`, category: 'Alerts', userId });
    return ticket;
  }

  async advance(id: string, userId: string, technicianName?: string, notes?: string) {
    try {
      const ticket = await maintenanceRepo.advance(id, technicianName, notes);
      const statusLabel = ticket.status.toLowerCase().replace(/_/g, ' ');

      await activityLogRepo.create({ action: `MAINTENANCE_${ticket.status}`, targetResource: 'Maintenance', targetId: id, details: `Maintenance ticket ${ticket.asset.tag} advanced to: ${statusLabel}`, category: 'Alerts', userId });

      if (ticket.status === 'APPROVED') {
        await notificationRepo.create({ type: 'MAINTENANCE_APPROVED', message: `Maintenance request for ${ticket.asset.tag} has been approved`, userId: ticket.requestedById });
      } else if (ticket.status === 'RESOLVED') {
        await notificationRepo.create({ type: 'MAINTENANCE_RESOLVED', message: `Maintenance for ${ticket.asset.tag} has been resolved`, userId: ticket.requestedById });
      }

      return ticket;
    } catch (err: any) {
      throw new AppError(err.message || 'Failed to advance ticket', 400);
    }
  }
}

export default new MaintenanceService();
