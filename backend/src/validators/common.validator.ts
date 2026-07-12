// ─── Common Validators ──────────────────────────────────────────────────────
import { z } from 'zod';

// ─── User Validators ────────────────────────────────────────────────────────
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  departmentId: z.string().optional().nullable(),
  avatar: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const assignRoleSchema = z.object({
  roleId: z.string().optional(),
  roleName: z.string().optional(),
}).refine(data => data.roleId || data.roleName, {
  message: 'Either roleId or roleName must be provided',
});

// ─── Department Validators ──────────────────────────────────────────────────
export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters').max(100),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  headId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// ─── Category Validators ───────────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  iconName: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  customFields: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['Text', 'Number', 'Date', 'Dropdown']),
    required: z.boolean().default(false),
  })).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Asset Validators ──────────────────────────────────────────────────────
export const createAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.string().optional()),
  purchaseCost: z.number().optional(),
  warrantyExpiry: z.string().datetime().optional().or(z.string().optional()),
});

export const updateAssetSchema = createAssetSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'ALLOCATED', 'MAINTENANCE', 'LOST', 'DISPOSED', 'RETIRED']).optional(),
});

// ─── Allocation Validators ─────────────────────────────────────────────────
export const createAllocationSchema = z.object({
  assetId: z.string().min(1),
  userId: z.string().min(1),
});

export const returnAllocationSchema = z.object({
  condition: z.string().optional(),
});

// ─── Transfer Validators ───────────────────────────────────────────────────
export const createTransferSchema = z.object({
  assetId: z.string().min(1),
  toUserId: z.string().min(1),
  reason: z.string().optional(),
});

// ─── Booking Validators ────────────────────────────────────────────────────
export const createBookingSchema = z.object({
  resourceName: z.string().min(1),
  resourceType: z.string().default('room'),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  notes: z.string().optional(),
  assetId: z.string().optional(),
});

// ─── Maintenance Validators ────────────────────────────────────────────────
export const createMaintenanceSchema = z.object({
  assetId: z.string().min(1),
  issue: z.string().min(1, 'Issue description is required'),
  notes: z.string().optional(),
});

export const advanceMaintenanceSchema = z.object({
  technicianName: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Audit Validators ──────────────────────────────────────────────────────
export const createAuditSchema = z.object({
  name: z.string().min(1),
  department: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  assetIds: z.array(z.string()).optional(),
  auditorIds: z.array(z.string()).optional(),
});

export const updateAuditItemSchema = z.object({
  status: z.enum(['VERIFIED', 'MISSING', 'DAMAGED']),
});
