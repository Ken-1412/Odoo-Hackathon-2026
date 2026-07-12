// ─── Asset Repository ───────────────────────────────────────────────────────
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

class AssetRepository {
  async findAll(params: { skip?: number; take?: number; where?: Prisma.AssetWhereInput; orderBy?: Prisma.AssetOrderByWithRelationInput }) {
    const [data, total] = await Promise.all([
      prisma.asset.findMany({ ...params, include: { category: true, allocations: { where: { isActive: true }, include: { user: { select: { id: true, name: true, email: true } } } } } }),
      prisma.asset.count({ where: params.where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.asset.findUnique({ where: { id }, include: { category: true, allocations: { where: { isActive: true }, include: { user: true } }, history: { orderBy: { date: 'desc' }, take: 20, include: { user: { select: { id: true, name: true } } } }, maintenance: { orderBy: { createdAt: 'desc' }, take: 10 } } });
  }

  async findByTag(tag: string) { return prisma.asset.findUnique({ where: { tag }, include: { category: true } }); }

  async create(data: Prisma.AssetCreateInput) {
    return prisma.asset.create({ data, include: { category: true } });
  }

  async update(id: string, data: Prisma.AssetUpdateInput) {
    return prisma.asset.update({ where: { id }, data, include: { category: true } });
  }

  async delete(id: string) { return prisma.asset.delete({ where: { id } }); }

  async generateTag(): Promise<string> {
    const lastAsset = await prisma.asset.findFirst({ orderBy: { createdAt: 'desc' }, select: { tag: true } });
    if (!lastAsset) return 'AF-0001';
    const num = parseInt(lastAsset.tag.replace('AF-', '')) || 0;
    return `AF-${String(num + 1).padStart(4, '0')}`;
  }

  async getHistory(assetId: string) {
    return prisma.assetHistory.findMany({ where: { assetId }, orderBy: { date: 'desc' }, include: { user: { select: { id: true, name: true } } } });
  }

  async addHistory(data: { assetId: string; event: string; details?: string; userId?: string }) {
    return prisma.assetHistory.create({ data });
  }

  async countByStatus(status: string) { return prisma.asset.count({ where: { status: status as any } }); }
  async countAll() { return prisma.asset.count(); }
}

export default new AssetRepository();
