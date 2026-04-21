import { Op } from 'sequelize';
import Booking from '../models/booking.model.js';
import Car from '../models/car.model.js';
import Location from '../models/location.model.js';

function generateReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'VLY-';
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

async function findOverlapping(carId, startDate, endDate, excludeId = null) {
  const where = {
    carId,
    status: { [Op.in]: ['pending', 'confirmed', 'active'] },
    startDate: { [Op.lte]: endDate },
    endDate: { [Op.gte]: startDate },
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Booking.findAll({ where });
}

export const getCarAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const bookings = await Booking.findAll({
      where: {
        carId: id,
        status: { [Op.in]: ['pending', 'confirmed', 'active'] },
        endDate: { [Op.gte]: new Date().toISOString().slice(0, 10) },
      },
      attributes: ['startDate', 'endDate', 'status'],
      order: [['startDate', 'ASC']],
    });

    const ranges = bookings.map((b) => ({
      from: b.startDate,
      to: b.endDate,
      status: b.status,
    }));

    res.json({ carId: id, blockedRanges: ranges });
  } catch (err) {
    console.error('getCarAvailability error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const user = req.user;
    const {
      carId,
      startDate,
      endDate,
      pickupLocationId,
      returnLocationId,
      extras = [],
      renterName,
      renterPhone,
      renterLicense,
      licenseImageUrl,
      notes,
    } = req.body;

    if (!carId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'carId, startDate and endDate are required' });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: 'startDate must be on or before endDate' });
    }

    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.rentalStatus === 'retired') {
      return res.status(400).json({ message: 'Car is not available for rental' });
    }

    const overlap = await findOverlapping(carId, startDate, endDate);
    if (overlap.length) {
      return res
        .status(409)
        .json({ message: 'Car is not available for the selected dates' });
    }

    const days = daysBetween(startDate, endDate);
    const daily = Number(car.dailyRate || 0);
    const subtotal = +(daily * days).toFixed(2);
    const extrasTotal = extras.reduce(
      (sum, e) => sum + Number(e.price || 0) * (e.quantity || 1),
      0
    );
    const fees = +(subtotal * 0.1).toFixed(2); // 10% service fee
    const deposit = Number(car.depositAmount || 0);
    const total = +(subtotal + extrasTotal + fees + deposit).toFixed(2);

    const booking = await Booking.create({
      reference: generateReference(),
      userId: user.id,
      carId,
      pickupLocationId,
      returnLocationId,
      startDate,
      endDate,
      status: 'pending',
      subtotal,
      extras,
      extrasTotal,
      fees,
      deposit,
      total,
      currency: 'USD',
      paymentStatus: 'pending',
      renterName,
      renterPhone,
      renterLicense,
      licenseImageUrl,
      notes,
    });

    const full = await Booking.findByPk(booking.id, {
      include: [
        { model: Car, as: 'car' },
        { model: Location, as: 'pickupLocation' },
        { model: Location, as: 'returnLocation' },
      ],
    });

    res.status(201).json(full);
  } catch (err) {
    console.error('createBooking error:', err);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
};

export const listMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Car, as: 'car' },
        { model: Location, as: 'pickupLocation' },
        { model: Location, as: 'returnLocation' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    console.error('listMyBookings error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Car, as: 'car' },
        { model: Location, as: 'pickupLocation' },
        { model: Location, as: 'returnLocation' },
      ],
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // User can view their own; admins can view any
    if (req.admin || booking.userId === req.user?.id) {
      return res.json(booking);
    }
    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    console.error('getBooking error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        message: `Cannot cancel a booking that is ${booking.status}`,
      });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('cancelBooking error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- Admin ---

export const adminListBookings = async (req, res) => {
  try {
    const { status, q, from, to, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (from && to) {
      where.startDate = { [Op.lte]: to };
      where.endDate = { [Op.gte]: from };
    }

    const { rows, count } = await Booking.findAndCountAll({
      where,
      include: [{ model: Car, as: 'car' }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    let filtered = rows;
    if (q) {
      const needle = String(q).toLowerCase();
      filtered = rows.filter(
        (b) =>
          b.reference?.toLowerCase().includes(needle) ||
          b.renterName?.toLowerCase().includes(needle) ||
          b.car?.make?.toLowerCase().includes(needle) ||
          b.car?.model?.toLowerCase().includes(needle)
      );
    }

    res.json({ total: count, items: filtered });
  } catch (err) {
    console.error('adminListBookings error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminUpdateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const allowed = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    const allowedPay = ['pending', 'paid', 'refunded', 'failed'];

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) {
      if (!allowed.includes(status))
        return res.status(400).json({ message: 'Invalid status' });
      booking.status = status;
    }
    if (paymentStatus) {
      if (!allowedPay.includes(paymentStatus))
        return res.status(400).json({ message: 'Invalid paymentStatus' });
      booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('adminUpdateBookingStatus error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminBookingMetrics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const [activeCount, monthCount, totalRevenueRow, upcomingCount] =
      await Promise.all([
        Booking.count({ where: { status: 'active' } }),
        Booking.count({
          where: {
            createdAt: { [Op.gte]: new Date(startOfMonth) },
            status: { [Op.ne]: 'cancelled' },
          },
        }),
        Booking.sum('total', {
          where: {
            createdAt: { [Op.gte]: new Date(startOfMonth) },
            status: { [Op.ne]: 'cancelled' },
          },
        }),
        Booking.count({
          where: {
            startDate: { [Op.gte]: now.toISOString().slice(0, 10) },
            status: { [Op.in]: ['pending', 'confirmed'] },
          },
        }),
      ]);

    res.json({
      activeRentals: activeCount,
      bookingsThisMonth: monthCount,
      revenueThisMonth: Number(totalRevenueRow || 0),
      upcomingPickups: upcomingCount,
    });
  } catch (err) {
    console.error('adminBookingMetrics error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
