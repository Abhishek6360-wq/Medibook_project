import 'dotenv/config';
import sequelize from './config/database.js';
import { loginUser } from './services/userService.js';

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');
    const res = await loginUser('guest@medibook.com', 'guestpassword123');
    console.log('Login success! Token:', res.token);
    process.exit(0);
  } catch (err) {
    console.error('Login failed:', err.message);
    process.exit(1);
  }
};

test();
