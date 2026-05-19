import sequelize from '../config/database.js';

/**
 * Concurrency & Concurrence Lock Engine (ACID Transaction Wrapper)
 * 
 * INTERVIEW TOPIC: Race Conditions & Row-Level Locking
 * 
 * Problem:
 * When two concurrent requests try to book the exact same slot for the same doctor at the same time,
 * they both read the slots_booked state, see it as free, write the appointment, and update the doctor row.
 * One of the bookings will overwrite the other, resulting in a double-booking race condition.
 * 
 * Solution:
 * We execute the read-and-write operations within a database TRANSACTION and apply a row-level write lock
 * ('FOR UPDATE' in PostgreSQL, or `lock: transaction.LOCK.UPDATE` in Sequelize) on the Doctor record.
 * 
 * Behavior:
 * 1. Request A begins transaction and acquires the lock on Doctor ID 1.
 * 2. Request B attempts to select Doctor ID 1 with a lock, but is blocked and placed in a wait state by PostgreSQL.
 * 3. Request A completes slot checking, creates the appointment, updates the doctor's slots, and commits.
 * 4. The lock is released. Request B resumes, reads the updated slots (which now shows the slot is taken),
 *    correctly throws a "slot not available" error, and aborts safely.
 */
export const runInTransaction = async (callback) => {
  return await sequelize.transaction(async (transaction) => {
    return await callback(transaction);
  });
};
