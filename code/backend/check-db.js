import 'dotenv/config';
import sequelize from './config/database.js';
import { User, Doctor } from './models/index.js';

const check = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const users = await User.findAll({ raw: true });
    console.log('\n--- USERS IN DATABASE ---');
    console.log(users);

    const doctors = await Doctor.findAll({ raw: true });
    console.log('\n--- DOCTORS IN DATABASE ---');
    console.log(doctors);

    process.exit(0);
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
};

check();
