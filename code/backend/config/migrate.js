import { Umzug } from 'umzug';
import sequelize from './database.js';

export const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      // dynamically import the ES module
      return {
        name,
        up: async () => {
          const module = await import(`file://${path}`);
          return module.up({ context });
        },
        down: async () => {
          const module = await import(`file://${path}`);
          return module.down({ context });
        },
      };
    },
  },
  context: sequelize,
  storage: {
    async executed({ context: sequelize }) {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
          name VARCHAR(255) PRIMARY KEY
        );
      `);
      const [results] = await sequelize.query(`SELECT name FROM "SequelizeMeta"`);
      return results.map(r => r.name);
    },
    async logMigration({ name, context: sequelize }) {
      await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES (?)`, {
        replacements: [name],
      });
    },
    async unlogMigration({ name, context: sequelize }) {
      await sequelize.query(`DELETE FROM "SequelizeMeta" WHERE name = ?`, {
        replacements: [name],
      });
    }
  },
  logger: console,
});

export const runMigrations = async () => {
  try {
    await migrator.up();
    console.log('All migrations performed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};
