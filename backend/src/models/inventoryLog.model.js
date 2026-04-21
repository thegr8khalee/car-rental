import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const InventoryLog = sequelize.define(
  'InventoryLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cars', // Matches tableName in Car model (default is pluralized)
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Admins', // Matches tableName in Admin model
        key: 'id',
      },
    },
    action: {
      type: DataTypes.ENUM(
        'CREATE',
        'UPDATE',
        'DELETE',
        'STATUS_CHANGE',
        'PRICE_CHANGE',
        'EXPENSE_ADDED',
        'LOCATION_CHANGE'
      ),
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON object storing changed fields (old vs new)',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Human readable description of the change',
    },
  },
  {
    timestamps: true,
    updatedAt: false, // Logs are immutable history
  }
);

export default InventoryLog;
