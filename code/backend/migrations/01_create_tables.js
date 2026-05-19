import { Sequelize } from 'sequelize';

export const up = async ({ context: sequelize }) => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "Users" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "phno" VARCHAR(50) NOT NULL,
      "dob" DATE,
      "age" INTEGER,
      "gender" VARCHAR(50),
      "Address" JSONB DEFAULT '{}',
      "image" VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "Doctors" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "speciality" VARCHAR(255) NOT NULL,
      "degree" VARCHAR(255) NOT NULL,
      "phnum" VARCHAR(50) NOT NULL,
      "fees" INTEGER NOT NULL,
      "experience" VARCHAR(50) NOT NULL,
      "about" TEXT,
      "address" JSONB DEFAULT '{}',
      "available" BOOLEAN DEFAULT TRUE,
      "image" VARCHAR(255),
      "slots_booked" JSONB DEFAULT '{}',
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "Appointments" (
      "id" SERIAL PRIMARY KEY,
      "UserId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "DocId" INTEGER NOT NULL REFERENCES "Doctors" ("id") ON DELETE CASCADE,
      "userData" JSONB NOT NULL,
      "docData" JSONB NOT NULL,
      "amount" INTEGER NOT NULL,
      "slotTime" VARCHAR(50) NOT NULL,
      "slotDate" VARCHAR(50) NOT NULL,
      "date" BIGINT NOT NULL,
      "cancelled" BOOLEAN DEFAULT FALSE,
      "payment" BOOLEAN DEFAULT FALSE,
      "isComplete" BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = async ({ context: sequelize }) => {
  await sequelize.query(`DROP TABLE IF EXISTS "Appointments";`);
  await sequelize.query(`DROP TABLE IF EXISTS "Doctors";`);
  await sequelize.query(`DROP TABLE IF EXISTS "Users";`);
};
