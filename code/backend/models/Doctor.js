import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  speciality: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING, allowNull: false },
  phnum: { type: DataTypes.STRING, allowNull: false },
  fees: { type: DataTypes.INTEGER, allowNull: false },
  experience: { type: DataTypes.STRING, allowNull: false },
  about: { type: DataTypes.TEXT },
  address: { type: DataTypes.JSONB, defaultValue: {} },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  image: { type: DataTypes.STRING },
  slots_booked: { type: DataTypes.JSONB, defaultValue: {} },
}, { timestamps: true });

export default Doctor;
