import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Ensure you have PG_URI in your .env file
// Example: PG_URI='postgres://username:password@localhost:5432/medibook'
const sequelize = new Sequelize(process.env.PG_URI || 'postgres://postgres:password@localhost:5432/medibook', {
  dialect: 'postgres',
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
