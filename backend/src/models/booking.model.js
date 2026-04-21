import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pickupLocationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    returnLocationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'active',
        'completed',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    extras: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    extrasTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    renterName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    renterPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    renterLicense: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['carId'] },
      { fields: ['status'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] },
      { unique: true, fields: ['reference'] },
    ],
  }
);

export default Booking;
