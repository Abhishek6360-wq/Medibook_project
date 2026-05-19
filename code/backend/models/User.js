import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phno: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  Address: { type: DataTypes.JSONB, defaultValue: {} },
  image: { type: DataTypes.STRING },
}, { timestamps: true });

export default User;
