// ─── Allocation & Transfer Service ──────────────────────────────────────────
import allocationRepo from '../repositories/allocation.repository';
import activityLogRepo from '../repositories/activitylog.repository';
import notificationRepo from '../repositories/notification.repository';
import { AppError } from '../middlewares/errorHandler';
import { parsePagination } from '../utils/pagination';

class AllocationService {
  async allocate(data: { assetId: string; userId: string }, performedBy: string) {
    try {
      const allocation = await allocationRepo.allocate(data);
      await activityLogRepo.create({ action: 'ASSET_ALLOCATED', targetResource: 'Asset', targetId: data.assetId, details: `Asset allocated to ${allocation.user.name}`, category: 'Approvals', userId: performedBy });
      await notificationRepo.create({ type: 'ASSET_ASSIGNED', message: `Asset ${allocation.asset.tag} has been assigned to you`, userId: data.userId });
      return allocation;
    } catch (err: any) {
      throw new AppError(err.message || 'Allocation failed', 400);
    }
  }

  async returnAsset(assetId: string, condition: string | undefined, performedBy: string) {
    try {
      const allocation = await allocationRepo.returnAsset(assetId, condition);
      await activityLogRepo.create({ action: 'ASSET_RETURNED', targetResource: 'Asset', targetId: assetId, details: `Asset returned by ${allocation.user.name} - condition: ${condition || 'good'}`, category: 'Approvals', userId: performedBy });
      await notificationRepo.create({ type: 'ASSET_RETURNED', message: `Asset has been returned successfully`, userId: allocation.userId });
      return allocation;
    } catch (err: any) {
      throw new AppError(err.message || 'Return failed', 400);
    }
  }

  async getAllocationHistory(assetId: string) {
    return allocationRepo.getHistoryByAsset(assetId);
  }

  // ─── Transfers ────────────────────────────────────────────────────────────
  async createTransfer(data: { assetId: string; toUserId: string; reason?: string }, fromUserId: string) {
    const transfer = await allocationRepo.createTransfer({ ...data, fromUserId });
    await activityLogRepo.create({ action: 'TRANSFER_REQUESTED', targetResource: 'Transfer', targetId: transfer.id, details: `Transfer requested: ${transfer.asset.tag} from ${transfer.fromUser.name} to ${transfer.toUser.name}`, category: 'Approvals', userId: fromUserId });
    await notificationRepo.create({ type: 'TRANSFER_REQUESTED', message: `Transfer request for asset ${transfer.asset.tag}`, userId: data.toUserId });
    return transfer;
  }

  async getTransfers(query: Record<string, any>) {
    const { skip, take, orderBy } = parsePagination(query);
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.assetId) where.assetId = query.assetId;
    return allocationRepo.findTransfers({ skip, take, where, orderBy });
  }

  async approveTransfer(transferId: string, approverId: string, approverRole: string) {
    try {
      // Determine the right next status based on role
      let newStatus: string;
      if (approverRole === 'Department Head') {
        newStatus = 'DEPT_HEAD_APPROVED';
      } else if (approverRole === 'Asset Manager' || approverRole === 'Administrator') {
        newStatus = 'TRANSFERRED'; // Final approval executes transfer
      } else {
        throw new AppError('You do not have permission to approve transfers', 403);
      }

      const transfer = await allocationRepo.approveTransfer(transferId, approverId, newStatus);
      await activityLogRepo.create({ action: 'TRANSFER_APPROVED', targetResource: 'Transfer', targetId: transferId, details: `Transfer ${newStatus === 'TRANSFERRED' ? 'completed' : 'approved'}: ${transfer.asset.tag}`, category: 'Approvals', userId: approverId });
      await notificationRepo.create({ type: 'TRANSFER_APPROVED', message: `Transfer for ${transfer.asset.tag} has been ${newStatus === 'TRANSFERRED' ? 'completed' : 'approved'}`, userId: transfer.fromUserId });
      return transfer;
    } catch (err: any) {
      throw new AppError(err.message || 'Approval failed', 400);
    }
  }

  async rejectTransfer(transferId: string, approverId: string) {
    const transfer = await allocationRepo.rejectTransfer(transferId, approverId);
    await activityLogRepo.create({ action: 'TRANSFER_REJECTED', targetResource: 'Transfer', targetId: transferId, details: `Transfer rejected: ${transfer.asset.tag}`, category: 'Approvals', userId: approverId });
    await notificationRepo.create({ type: 'TRANSFER_REJECTED', message: `Transfer for ${transfer.asset.tag} has been rejected`, userId: transfer.fromUserId });
    return transfer;
  }
}

export default new AllocationService();
