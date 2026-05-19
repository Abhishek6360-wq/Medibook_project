import User from './User.js';
import Doctor from './Doctor.js';
import Appointment from './Appointment.js';

// Define relationships
User.hasMany(Appointment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'UserId' });

Doctor.hasMany(Appointment, { foreignKey: 'DocId', onDelete: 'CASCADE' });
Appointment.belongsTo(Doctor, { foreignKey: 'DocId' });

export { User, Doctor, Appointment };
