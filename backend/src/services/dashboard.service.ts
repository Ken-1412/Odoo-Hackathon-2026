// ─── Dashboard Service ──────────────────────────────────────────────────────
import prisma from '../config/database';
import assetRepo from '../repositories/asset.repository';
import bookingRepo from '../repositories/booking.repository';
import allocationRepo from '../repositories/allocation.repository';
import maintenanceRepo from '../repositories/maintenance.repository';
import departmentRepo from '../repositories/department.repository';
import categoryRepo from '../repositories/category.repository';
import userRepo from '../repositories/user.repository';

class DashboardService {
  async getEmployeeStats() {
    const [availableHardware, allocated, activeBookings, pendingTransfers, maintenanceToday] = await Promise.all([
      assetRepo.countByStatus('AVAILABLE'),
      assetRepo.countByStatus('ALLOCATED'),
      bookingRepo.countActive(),
      allocationRepo.countPendingTransfers(),
      maintenanceRepo.countToday(),
    ]);

    // Count available rooms (bookable resources without a booking today)
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const totalRooms = 4; // Could be configurable
    const bookedRoomsToday = await prisma.booking.groupBy({
      by: ['resourceName'],
      where: { date: { gte: today }, status: 'CONFIRMED', resourceType: 'room' },
    });
    const availableRooms = Math.max(0, totalRooms - bookedRoomsToday.length);

    // Upcoming returns (assets allocated > 30 days ago)
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const upcomingReturns = await prisma.assetAllocation.count({
      where: { isActive: true, allocatedAt: { lte: thirtyDaysAgo } },
    });

    return {
      availableHardware,
      allocated,
      availableRooms,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      maintenanceToday,
    };
  }

  async getAdminStats() {
    const [departmentCount, employeeCount, categoryCount, activeUsersCount, deptHeadsCount, assetManagersCount, administratorsCount] = await Promise.all([
      departmentRepo.count(),
      prisma.user.count(),
      categoryRepo.count(),
      userRepo.countActive(),
      userRepo.countByRole('Department Head'),
      userRepo.countByRole('Asset Manager'),
      userRepo.countByRole('Administrator'),
    ]);

    return { departmentCount, employeeCount, categoryCount, activeUsersCount, deptHeadsCount, assetManagersCount, administratorsCount };
  }

  async getUtilizationByDepartment() {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { employees: true } },
        employees: {
          include: { allocatedAssets: { where: { isActive: true } } },
        },
      },
    });

    return departments.map(dept => ({
      department: dept.name,
      employeeCount: dept._count.employees,
      allocatedAssets: dept.employees.reduce((sum, emp) => sum + emp.allocatedAssets.length, 0),
    }));
  }

  async getMaintenanceFrequency() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthly = await prisma.maintenanceRequest.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: sixMonthsAgo } },
      _count: { id: true },
    });

    // Aggregate by month
    const monthlyMap: Record<string, number> = {};
    monthly.forEach(m => {
      const key = new Date(m.createdAt).toISOString().slice(0, 7);
      monthlyMap[key] = (monthlyMap[key] || 0) + m._count.id;
    });

    return Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));
  }

  async getMostUsedAssets() {
    const bookings = await prisma.booking.groupBy({
      by: ['resourceName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    return bookings.map(b => ({ resource: b.resourceName, bookings: b._count.id }));
  }

  async getRecentActivity(userId?: string, limit = 20) {
    const where: any = {};
    if (userId) where.userId = userId;

    return prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true } } },
    });
  }
}

export default new DashboardService();
