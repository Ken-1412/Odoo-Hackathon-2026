// ─── Booking Service ────────────────────────────────────────────────────────
import bookingRepo from '../repositories/booking.repository';
import activityLogRepo from '../repositories/activitylog.repository';
import notificationRepo from '../repositories/notification.repository';
import { AppError } from '../middlewares/errorHandler';
import { parsePagination } from '../utils/pagination';

class BookingService {
  async getAll(query: Record<string, any>) {
    const { skip, take, orderBy } = parsePagination(query);
    const where: any = {};
    if (query.resourceName) where.resourceName = { contains: query.resourceName, mode: 'insensitive' };
    if (query.resourceType) where.resourceType = query.resourceType;
    if (query.status) where.status = query.status;
    if (query.date) where.date = new Date(query.date);
    if (query.userId) where.userId = query.userId;
    return bookingRepo.findAll({ skip, take, where, orderBy });
  }

  async getSlots(resourceName: string, date: string) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const bookings = await bookingRepo.getSlots(resourceName, d);

    // Generate slot grid (9 AM to 6 PM)
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
      const booking = bookings.find(b => b.startTime <= time && b.endTime > time);

      slots.push({
        time,
        endTime,
        isBooked: !!booking,
        conflict: false,
        text: booking ? `Booked - ${booking.user.name} - ${booking.startTime} to ${booking.endTime}` : 'Available',
        booking: booking || null,
      });
    }
    return slots;
  }

  async create(data: any, userId: string) {
    const date = new Date(data.date);
    date.setHours(0, 0, 0, 0);

    // Check for overlapping bookings
    const hasOverlap = await bookingRepo.checkOverlap(data.resourceName, date, data.startTime, data.endTime);
    if (hasOverlap) {
      throw new AppError(`Time slot ${data.startTime} to ${data.endTime} is already booked for ${data.resourceName}. Please choose a different slot.`, 409);
    }

    const booking = await bookingRepo.create({
      resourceName: data.resourceName,
      resourceType: data.resourceType || 'room',
      date,
      startTime: data.startTime,
      endTime: data.endTime,
      notes: data.notes,
      user: { connect: { id: userId } },
      ...(data.assetId && { asset: { connect: { id: data.assetId } } }),
    });

    await activityLogRepo.create({ action: 'BOOKING_CONFIRMED', targetResource: 'Booking', targetId: booking.id, details: `${data.resourceName} booked ${data.startTime} to ${data.endTime}`, category: 'Bookings', userId });
    await notificationRepo.create({ type: 'BOOKING_CONFIRMED', message: `Booking confirmed: ${data.resourceName} - ${data.startTime} to ${data.endTime}`, userId });
    return booking;
  }

  async cancel(id: string, userId: string) {
    const booking = await bookingRepo.findById(id);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.userId !== userId) throw new AppError('You can only cancel your own bookings', 403);
    if (booking.status !== 'CONFIRMED') throw new AppError('Only confirmed bookings can be cancelled', 400);

    const cancelled = await bookingRepo.cancel(id);
    await activityLogRepo.create({ action: 'BOOKING_CANCELLED', targetResource: 'Booking', targetId: id, details: `Booking cancelled: ${booking.resourceName}`, category: 'Bookings', userId });
    return cancelled;
  }
}

export default new BookingService();
