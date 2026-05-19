import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  DocId: { type: DataTypes.INTEGER, allowNull: false },
  userData: { type: DataTypes.JSONB, allowNull: false },
  docData: { type: DataTypes.JSONB, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  slotTime: { type: DataTypes.STRING, allowNull: false },
  slotDate: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.BIGINT, allowNull: false },
  cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  payment: { type: DataTypes.BOOLEAN, defaultValue: false },
  isComplete: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

export default Appointment;
