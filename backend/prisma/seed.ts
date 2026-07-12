// ─── AssetFlow Database Seed ────────────────────────────────────────────────
// Seeds roles, departments, categories, users, assets, and sample data
// matching the existing frontend mock data for seamless transition.

import { PrismaClient, AssetStatus, MaintenanceStatus, AuditItemStatus, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AssetFlow database...\n');

  // ─── 1. Roles ───────────────────────────────────────────────────────────────
  console.log('  → Creating roles...');
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'Administrator' }, update: {}, create: { name: 'Administrator' } }),
    prisma.role.upsert({ where: { name: 'Asset Manager' }, update: {}, create: { name: 'Asset Manager' } }),
    prisma.role.upsert({ where: { name: 'Department Head' }, update: {}, create: { name: 'Department Head' } }),
    prisma.role.upsert({ where: { name: 'Employee' }, update: {}, create: { name: 'Employee' } }),
  ]);
  const [adminRole, assetMgrRole, deptHeadRole, employeeRole] = roles;

  // ─── 2. Departments (without heads first) ───────────────────────────────────
  console.log('  → Creating departments...');
  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' }, update: {},
    create: { name: 'Engineering', description: 'Core product development and software engineering team.', status: 'ACTIVE' }
  });
  const facilities = await prisma.department.upsert({
    where: { name: 'Facilities' }, update: {},
    create: { name: 'Facilities', description: 'Office space, equipment maintenance, and facility resources.', status: 'ACTIVE' }
  });
  const fieldOps = await prisma.department.upsert({
    where: { name: 'Field Ops' }, update: {},
    create: { name: 'Field Ops', description: 'External technician logistics and client on-site visits.', status: 'INACTIVE' }
  });
  const hr = await prisma.department.upsert({
    where: { name: 'HR' }, update: {},
    create: { name: 'HR', description: 'Human resources, employee engagement, and onboarding.', status: 'ACTIVE' }
  });
  const finance = await prisma.department.upsert({
    where: { name: 'Finance' }, update: {},
    create: { name: 'Finance', description: 'Corporate accounting, treasury, audits, and budgeting.', status: 'ACTIVE' }
  });
  const marketing = await prisma.department.upsert({
    where: { name: 'Marketing' }, update: {},
    create: { name: 'Marketing', description: 'Brand awareness, B2B sales pipelines, and outreach.', status: 'ACTIVE' }
  });
  // Sub-departments
  const backend = await prisma.department.upsert({
    where: { name: 'Backend' }, update: {},
    create: { name: 'Backend', description: 'Server-side logic, APIs, databases, and microservices.', status: 'ACTIVE', parentId: engineering.id }
  });
  const frontend = await prisma.department.upsert({
    where: { name: 'Frontend' }, update: {},
    create: { name: 'Frontend', description: 'User interface, client-side applications, and customer portals.', status: 'ACTIVE', parentId: engineering.id }
  });

  // ─── 3. Users ───────────────────────────────────────────────────────────────
  console.log('  → Creating users...');
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const empPasswordHash = await bcrypt.hash('Employee@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetflow.com' }, update: {},
    create: {
      name: 'Ketan Singh', email: 'admin@assetflow.com', password: passwordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ketan',
      roleId: adminRole.id, departmentId: engineering.id, status: 'ACTIVE'
    }
  });

  const aditi = await prisma.user.upsert({
    where: { email: 'aditi@systems.core' }, update: {},
    create: {
      name: 'Aditi Rao', email: 'aditi@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aditi',
      roleId: deptHeadRole.id, departmentId: engineering.id, status: 'ACTIVE'
    }
  });

  const rohan = await prisma.user.upsert({
    where: { email: 'rohan@systems.core' }, update: {},
    create: {
      name: 'Rohan Mehta', email: 'rohan@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan',
      roleId: deptHeadRole.id, departmentId: facilities.id, status: 'ACTIVE'
    }
  });

  const sana = await prisma.user.upsert({
    where: { email: 'sana@systems.core' }, update: {},
    create: {
      name: 'Sana Iqbal', email: 'sana@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sana',
      roleId: deptHeadRole.id, departmentId: fieldOps.id, status: 'INACTIVE'
    }
  });

  const arjun = await prisma.user.upsert({
    where: { email: 'arjun@systems.core' }, update: {},
    create: {
      name: 'Arjun Nair', email: 'arjun@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun',
      roleId: assetMgrRole.id, departmentId: backend.id, status: 'ACTIVE'
    }
  });

  const priya = await prisma.user.upsert({
    where: { email: 'priya@systems.core' }, update: {},
    create: {
      name: 'Priya Shah', email: 'priya@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
      roleId: employeeRole.id, departmentId: frontend.id, status: 'ACTIVE'
    }
  });

  const vikram = await prisma.user.upsert({
    where: { email: 'vikram@systems.core' }, update: {},
    create: {
      name: 'Vikram Malhotra', email: 'vikram@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram',
      roleId: employeeRole.id, departmentId: finance.id, status: 'ACTIVE'
    }
  });

  const neha = await prisma.user.upsert({
    where: { email: 'neha@systems.core' }, update: {},
    create: {
      name: 'Neha Gupta', email: 'neha@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Neha',
      roleId: employeeRole.id, departmentId: hr.id, status: 'ACTIVE'
    }
  });

  const kabir = await prisma.user.upsert({
    where: { email: 'kabir@systems.core' }, update: {},
    create: {
      name: 'Kabir Sharma', email: 'kabir@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kabir',
      roleId: employeeRole.id, departmentId: engineering.id, status: 'ACTIVE'
    }
  });

  const aisha = await prisma.user.upsert({
    where: { email: 'aisha@systems.core' }, update: {},
    create: {
      name: 'Aisha Khan', email: 'aisha@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha',
      roleId: employeeRole.id, departmentId: marketing.id, status: 'ACTIVE'
    }
  });

  const rahul = await prisma.user.upsert({
    where: { email: 'rahul@systems.core' }, update: {},
    create: {
      name: 'Rahul Verma', email: 'rahul@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
      roleId: employeeRole.id, departmentId: facilities.id, status: 'ACTIVE'
    }
  });

  const meera = await prisma.user.upsert({
    where: { email: 'meera@systems.core' }, update: {},
    create: {
      name: 'Meera Nair', email: 'meera@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Meera',
      roleId: employeeRole.id, departmentId: finance.id, status: 'ACTIVE'
    }
  });

  const dev = await prisma.user.upsert({
    where: { email: 'dev@systems.core' }, update: {},
    create: {
      name: 'Dev Patel', email: 'dev@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dev',
      roleId: employeeRole.id, departmentId: backend.id, status: 'INACTIVE'
    }
  });

  const riya = await prisma.user.upsert({
    where: { email: 'riya@systems.core' }, update: {},
    create: {
      name: 'Riya Sen', email: 'riya@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Riya',
      roleId: employeeRole.id, departmentId: hr.id, status: 'ACTIVE'
    }
  });

  const ananya = await prisma.user.upsert({
    where: { email: 'ananya@systems.core' }, update: {},
    create: {
      name: 'Ananya Das', email: 'ananya@systems.core', password: empPasswordHash,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya',
      roleId: employeeRole.id, departmentId: marketing.id, status: 'ACTIVE'
    }
  });

  // ─── Update department heads ────────────────────────────────────────────────
  console.log('  → Linking department heads...');
  await prisma.department.update({ where: { id: engineering.id }, data: { headId: aditi.id } });
  await prisma.department.update({ where: { id: facilities.id }, data: { headId: rohan.id } });
  await prisma.department.update({ where: { id: fieldOps.id }, data: { headId: sana.id } });
  await prisma.department.update({ where: { id: hr.id }, data: { headId: neha.id } });
  await prisma.department.update({ where: { id: finance.id }, data: { headId: vikram.id } });
  await prisma.department.update({ where: { id: marketing.id }, data: { headId: aisha.id } });
  await prisma.department.update({ where: { id: backend.id }, data: { headId: arjun.id } });
  await prisma.department.update({ where: { id: frontend.id }, data: { headId: priya.id } });

  // ─── 4. Asset Categories ────────────────────────────────────────────────────
  console.log('  → Creating asset categories...');
  const electronics = await prisma.assetCategory.upsert({
    where: { name: 'Electronics' }, update: {},
    create: { name: 'Electronics', description: 'Laptops, servers, monitors, and other core IT devices.', iconName: 'Laptop', status: 'ACTIVE' }
  });
  const furniture = await prisma.assetCategory.upsert({
    where: { name: 'Furniture' }, update: {},
    create: { name: 'Furniture', description: 'Desks, chairs, and other office workstations.', iconName: 'Armchair', status: 'ACTIVE' }
  });
  const vehicles = await prisma.assetCategory.upsert({
    where: { name: 'Vehicles' }, update: {},
    create: { name: 'Vehicles', description: 'Utility vehicles and company fleet logistics.', iconName: 'Car', status: 'ACTIVE' }
  });
  const networking = await prisma.assetCategory.upsert({
    where: { name: 'Networking' }, update: {},
    create: { name: 'Networking', description: 'Routers, switches, access points, and server cabinets.', iconName: 'Network', status: 'ACTIVE' }
  });
  const accessories = await prisma.assetCategory.upsert({
    where: { name: 'Accessories' }, update: {},
    create: { name: 'Accessories', description: 'Adapters, docking stations, keypads, and mice.', iconName: 'Cable', status: 'ACTIVE' }
  });
  const officeEquip = await prisma.assetCategory.upsert({
    where: { name: 'Office Equipment' }, update: {},
    create: { name: 'Office Equipment', description: 'Printers, projectors, and shared scanners.', iconName: 'Printer', status: 'ACTIVE' }
  });

  // Custom fields for Electronics
  await prisma.customField.createMany({
    data: [
      { name: 'Serial Number', type: 'Text', required: true, categoryId: electronics.id },
      { name: 'Warranty Expiry', type: 'Date', required: true, categoryId: electronics.id },
    ],
    skipDuplicates: true,
  });

  // ─── 5. Assets ──────────────────────────────────────────────────────────────
  console.log('  → Creating assets...');
  const assetsData = [
    { tag: 'AF-0012', name: 'Dell Laptop', serialNumber: 'DL-2024-0012', status: AssetStatus.ALLOCATED, location: 'Bengaluru', categoryId: electronics.id },
    { tag: 'AF-0062', name: 'Projector', serialNumber: 'PJ-2024-0062', status: AssetStatus.MAINTENANCE, location: 'HQ Floor 2', categoryId: officeEquip.id },
    { tag: 'AF-0201', name: 'Office Chair', serialNumber: 'OC-2024-0201', status: AssetStatus.AVAILABLE, location: 'Warehouse', categoryId: furniture.id },
    { tag: 'AF-0114', name: 'Dell Laptop Pro', serialNumber: 'DLP-2024-0114', status: AssetStatus.ALLOCATED, location: 'Bengaluru', categoryId: electronics.id },
    { tag: 'AF-003', name: 'Dell Laptop 15', serialNumber: 'DL-2024-003', status: AssetStatus.AVAILABLE, location: 'Desk E12', categoryId: electronics.id },
    { tag: 'AF-9921', name: 'Office Chair Pro', serialNumber: 'OCP-2024-9921', status: AssetStatus.AVAILABLE, location: 'Desk E14', categoryId: furniture.id },
    { tag: 'AF-9838', name: 'Monitor 27"', serialNumber: 'MN-2024-9838', status: AssetStatus.AVAILABLE, location: 'Desk E15', categoryId: electronics.id },
    { tag: 'AF-0033', name: 'Standing Desk', serialNumber: 'SD-2024-0033', status: AssetStatus.ALLOCATED, location: 'Engineering Bay', categoryId: furniture.id },
    { tag: 'AF-0055', name: 'MacBook Air M3', serialNumber: 'MBA-2024-0055', status: AssetStatus.AVAILABLE, location: 'IT Store', categoryId: electronics.id },
    { tag: 'AF-0078', name: 'Forklift', serialNumber: 'FK-2024-0078', status: AssetStatus.MAINTENANCE, location: 'Warehouse', categoryId: vehicles.id },
    { tag: 'AF-0087', name: 'Forklift Heavy', serialNumber: 'FKH-2024-0087', status: AssetStatus.AVAILABLE, location: 'Warehouse', categoryId: vehicles.id },
    { tag: 'AF-0020', name: 'Laptop Legacy', serialNumber: 'LL-2020-0020', status: AssetStatus.AVAILABLE, location: 'IT Store', categoryId: electronics.id, purchaseDate: new Date('2022-01-15') },
    { tag: 'AF-343', name: 'Company Van', serialNumber: 'VN-2024-343', status: AssetStatus.AVAILABLE, location: 'Parking Lot A', categoryId: vehicles.id },
    { tag: 'AF-335', name: 'Projector HD', serialNumber: 'PJH-2024-335', status: AssetStatus.AVAILABLE, location: 'Meeting Room A', categoryId: officeEquip.id },
    { tag: 'AF-0021', name: 'Dell Monitor 24"', serialNumber: 'DM-2024-0021', status: AssetStatus.ALLOCATED, location: 'Desk B4', categoryId: electronics.id },
    { tag: 'AF-0088', name: 'Cisco Switch 48', serialNumber: 'CS-2024-0088', status: AssetStatus.AVAILABLE, location: 'Server Room', categoryId: networking.id },
    { tag: 'AF-0014', name: 'Laptop ThinkPad', serialNumber: 'TP-2024-0014', status: AssetStatus.ALLOCATED, location: 'Desk A2', categoryId: electronics.id },
    { tag: 'AF-897', name: 'HP Printer', serialNumber: 'HP-2024-897', status: AssetStatus.MAINTENANCE, location: 'Print Station', categoryId: officeEquip.id },
    { tag: 'AF-873', name: 'Ergonomic Chair', serialNumber: 'EC-2024-873', status: AssetStatus.AVAILABLE, location: 'Facilities Store', categoryId: furniture.id },
    { tag: 'AF-0100', name: 'USB-C Hub', serialNumber: 'UH-2024-0100', status: AssetStatus.AVAILABLE, location: 'IT Store', categoryId: accessories.id },
  ];

  for (const a of assetsData) {
    await prisma.asset.upsert({
      where: { tag: a.tag },
      update: {},
      create: a,
    });
  }

  // ─── 6. Asset Allocations ───────────────────────────────────────────────────
  console.log('  → Creating asset allocations...');
  const af0012 = await prisma.asset.findUnique({ where: { tag: 'AF-0012' } });
  const af0114 = await prisma.asset.findUnique({ where: { tag: 'AF-0114' } });
  const af0033 = await prisma.asset.findUnique({ where: { tag: 'AF-0033' } });
  const af0021 = await prisma.asset.findUnique({ where: { tag: 'AF-0021' } });
  const af0014 = await prisma.asset.findUnique({ where: { tag: 'AF-0014' } });

  if (af0012 && af0114 && af0033 && af0021 && af0014) {
    const allocs = [
      { assetId: af0012.id, userId: priya.id },
      { assetId: af0114.id, userId: priya.id },
      { assetId: af0033.id, userId: arjun.id },
      { assetId: af0021.id, userId: kabir.id },
      { assetId: af0014.id, userId: priya.id },
    ];
    for (const alloc of allocs) {
      const existing = await prisma.assetAllocation.findFirst({
        where: { assetId: alloc.assetId, isActive: true }
      });
      if (!existing) {
        await prisma.assetAllocation.create({ data: alloc });
        await prisma.asset.update({ where: { id: alloc.assetId }, data: { allocatedToId: alloc.userId } });
      }
    }
  }

  // ─── 7. Asset History ───────────────────────────────────────────────────────
  console.log('  → Creating asset history...');
  if (af0114) {
    await prisma.assetHistory.createMany({
      data: [
        { assetId: af0114.id, event: 'Allocated to Priya Shah - Engineering', userId: priya.id, date: new Date('2026-03-12') },
        { assetId: af0114.id, event: 'Returned by Arjun Nair - condition: good', userId: arjun.id, date: new Date('2026-01-04') },
      ]
    });
  }

  // ─── 8. Maintenance Requests ────────────────────────────────────────────────
  console.log('  → Creating maintenance requests...');
  const af0062 = await prisma.asset.findUnique({ where: { tag: 'AF-0062' } });
  const af003 = await prisma.asset.findUnique({ where: { tag: 'AF-003' } });
  const af0078 = await prisma.asset.findUnique({ where: { tag: 'AF-0078' } });
  const af897 = await prisma.asset.findUnique({ where: { tag: 'AF-897' } });
  const af873 = await prisma.asset.findUnique({ where: { tag: 'AF-873' } });

  const maintenanceData = [
    { issue: 'Projector bulb not turning on', status: MaintenanceStatus.PENDING, assetId: af0062?.id, requestedById: rohan.id },
    { issue: 'AC unit noisy compressor', status: MaintenanceStatus.APPROVED, assetId: af003?.id, requestedById: aditi.id },
    { issue: 'Forklift hydraulic issue', status: MaintenanceStatus.TECHNICIAN_ASSIGNED, assetId: af0078?.id, requestedById: rahul.id, technicianName: 'R Varma' },
    { issue: 'Printer jam - parts ordered', status: MaintenanceStatus.IN_PROGRESS, assetId: af897?.id, requestedById: neha.id },
    { issue: 'Chair repair resolved 7 Jul', status: MaintenanceStatus.RESOLVED, assetId: af873?.id, requestedById: kabir.id, resolvedAt: new Date('2026-07-07') },
  ];

  for (const m of maintenanceData) {
    if (m.assetId) {
      await prisma.maintenanceRequest.create({ data: m as any });
    }
  }

  // ─── 9. Bookings ───────────────────────────────────────────────────────────
  console.log('  → Creating bookings...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.booking.createMany({
    data: [
      { resourceName: 'Conference Room B2', resourceType: 'room', date: today, startTime: '09:00', endTime: '10:00', status: BookingStatus.CONFIRMED, userId: aditi.id, notes: 'Procurement Team meeting' },
      { resourceName: 'Conference Room B2', resourceType: 'room', date: today, startTime: '14:00', endTime: '15:00', status: BookingStatus.CONFIRMED, userId: priya.id },
      { resourceName: 'Tesla Model 3', resourceType: 'vehicle', date: today, startTime: '10:00', endTime: '16:00', status: BookingStatus.CONFIRMED, userId: rohan.id },
      { resourceName: 'R&D Testing Lab', resourceType: 'room', date: today, startTime: '11:00', endTime: '13:00', status: BookingStatus.CONFIRMED, userId: arjun.id },
    ]
  });

  // ─── 10. Audit Cycle ───────────────────────────────────────────────────────
  console.log('  → Creating audit cycle...');
  const auditCycle = await prisma.auditCycle.create({
    data: {
      name: 'Q3 audit: Engineering dept - 1-15 Jul',
      department: 'Engineering',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-15'),
      isOpen: true,
      auditors: { connect: [{ id: aditi.id }, { id: sana.id }] }
    }
  });

  // Audit items matching frontend mock
  if (af003 && af0012) {
    const af9921 = await prisma.asset.findUnique({ where: { tag: 'AF-9921' } });
    const af9838 = await prisma.asset.findUnique({ where: { tag: 'AF-9838' } });

    const auditItems = [
      { status: AuditItemStatus.VERIFIED, assetId: af003.id, auditCycleId: auditCycle.id },
      { status: AuditItemStatus.MISSING, assetId: af9921?.id, auditCycleId: auditCycle.id },
      { status: AuditItemStatus.DAMAGED, assetId: af9838?.id, auditCycleId: auditCycle.id },
    ];

    for (const item of auditItems) {
      if (item.assetId) {
        await prisma.auditItem.create({ data: item as any });
      }
    }
  }

  // ─── 11. Notifications ─────────────────────────────────────────────────────
  console.log('  → Creating notifications...');
  await prisma.notification.createMany({
    data: [
      { type: 'OVERDUE_RETURN', message: '3 assets overdue for return - flagged for follow-up', userId: admin.id },
      { type: 'ASSET_ASSIGNED', message: 'Laptop AF-0114 assigned to Priya Shah', userId: priya.id },
      { type: 'MAINTENANCE_APPROVED', message: 'Maintenance request AF-0055 approved', userId: arjun.id },
      { type: 'BOOKING_CONFIRMED', message: 'Booking confirmed: Room B2 - 2:00 to 3:00 PM', userId: priya.id },
      { type: 'TRANSFER_APPROVED', message: 'Transfer approved: AF-0033 to Facilities dept', userId: rohan.id },
    ]
  });

  // ─── 12. Activity Logs ─────────────────────────────────────────────────────
  console.log('  → Creating activity logs...');
  await prisma.activityLog.createMany({
    data: [
      { action: 'ASSET_ALLOCATED', targetResource: 'Asset', targetId: af0114?.id, details: 'Laptop AF-0114 allocated to Priya Shah - IT dept', category: 'Approvals', userId: admin.id },
      { action: 'BOOKING_CONFIRMED', targetResource: 'Booking', details: 'Room B2 - booking confirmed - 2:00 to 3:00 PM', category: 'Bookings', userId: priya.id },
      { action: 'MAINTENANCE_RESOLVED', targetResource: 'Maintenance', details: 'Projector AF-0062 - maintenance resolved', category: 'Alerts', userId: rohan.id },
      { action: 'ROLE_ASSIGNED', targetResource: 'User', targetId: priya.id, details: 'Role Assigned: Priya Shah updated to Employee by Ketan Singh', category: 'Approvals', userId: admin.id },
      { action: 'CATEGORY_CREATED', targetResource: 'AssetCategory', details: 'New Category Added: Networking registered by Administrator', category: 'Approvals', userId: admin.id },
      { action: 'DEPARTMENT_CREATED', targetResource: 'Department', targetId: frontend.id, details: 'Department Created: Frontend department approved under Engineering', category: 'Approvals', userId: admin.id },
      { action: 'OVERDUE_RETURN', targetResource: 'Asset', targetId: af0021?.id, details: 'Overdue return: AF-0021 was due 3 days ago', category: 'Alerts', userId: admin.id },
      { action: 'AUDIT_DISCREPANCY', targetResource: 'Audit', details: 'Audit discrepancy flagged: AF-0088 damaged', category: 'Alerts', userId: aditi.id },
    ]
  });

  console.log('\n✅ Seeding complete!');
  console.log('   Admin login: admin@assetflow.com / Admin@123');
  console.log('   Employee login: priya@systems.core / Employee@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
