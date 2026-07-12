// ─── Asset Service ──────────────────────────────────────────────────────────
import assetRepo from '../repositories/asset.repository';
import activityLogRepo from '../repositories/activitylog.repository';
import notificationRepo from '../repositories/notification.repository';
import { AppError } from '../middlewares/errorHandler';
import { parsePagination } from '../utils/pagination';

class AssetService {
  async getAll(query: Record<string, any>) {
    const { skip, take, orderBy } = parsePagination(query);
    const where: any = {};

    if (query.search) {
      where.OR = [
        { tag: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { serialNumber: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status && query.status !== 'All') where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.category && query.category !== 'All') {
      where.category = { name: { equals: query.category, mode: 'insensitive' } };
    }
    if (query.location) where.location = { contains: query.location, mode: 'insensitive' };

    return assetRepo.findAll({ skip, take, where, orderBy });
  }

  async getById(id: string) {
    const asset = await assetRepo.findById(id);
    if (!asset) throw new AppError('Asset not found', 404);
    return asset;
  }

  async create(data: any, userId: string) {
    const tag = await assetRepo.generateTag();

    const createData: any = {
      tag,
      name: data.name,
      serialNumber: data.serialNumber,
      location: data.location || 'Warehouse',
      category: { connect: { id: data.categoryId } },
    };
    if (data.purchaseDate) createData.purchaseDate = new Date(data.purchaseDate);
    if (data.purchaseCost) createData.purchaseCost = data.purchaseCost;
    if (data.warrantyExpiry) createData.warrantyExpiry = new Date(data.warrantyExpiry);

    const asset = await assetRepo.create(createData);
    await assetRepo.addHistory({ assetId: asset.id, event: `Asset registered: ${asset.name} (${asset.tag})`, userId });
    await activityLogRepo.create({ action: 'ASSET_CREATED', targetResource: 'Asset', targetId: asset.id, details: `${asset.name} (${asset.tag}) registered`, category: 'Approvals', userId });
    return asset;
  }

  async update(id: string, data: any, userId: string) {
    const asset = await assetRepo.findById(id);
    if (!asset) throw new AppError('Asset not found', 404);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.serialNumber !== undefined) updateData.serialNumber = data.serialNumber;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };
    if (data.purchaseDate) updateData.purchaseDate = new Date(data.purchaseDate);
    if (data.purchaseCost !== undefined) updateData.purchaseCost = data.purchaseCost;
    if (data.warrantyExpiry) updateData.warrantyExpiry = new Date(data.warrantyExpiry);

    const updated = await assetRepo.update(id, updateData);
    await assetRepo.addHistory({ assetId: id, event: `Asset updated`, userId });
    await activityLogRepo.create({ action: 'ASSET_UPDATED', targetResource: 'Asset', targetId: id, details: `Asset ${updated.tag} updated`, category: 'Approvals', userId });
    return updated;
  }

  async delete(id: string, userId: string) {
    const asset = await assetRepo.findById(id);
    if (!asset) throw new AppError('Asset not found', 404);
    if (asset.status === 'ALLOCATED') throw new AppError('Cannot delete an allocated asset. Return it first.', 400);
    await assetRepo.delete(id);
    await activityLogRepo.create({ action: 'ASSET_DELETED', targetResource: 'Asset', targetId: id, details: `Asset ${asset.tag} deleted`, category: 'Approvals', userId });
  }

  async getHistory(assetId: string) {
    return assetRepo.getHistory(assetId);
  }

  async updateImage(id: string, imageUrl: string, userId: string) {
    const asset = await assetRepo.findById(id);
    if (!asset) throw new AppError('Asset not found', 404);
    return assetRepo.update(id, { imageUrl });
  }
}

export default new AssetService();
