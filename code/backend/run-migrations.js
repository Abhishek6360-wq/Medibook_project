import 'dotenv/config';
import { runMigrations } from './config/migrate.js';

const execute = async () => {
  try {
    await runMigrations();
    process.exit(0);
  } catch (err) {
    console.error('Error running migrations command:', err);
    process.exit(1);
  }
};

execute();
