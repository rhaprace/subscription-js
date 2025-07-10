import pool from './postgresdb.js';
import { createUsersTable } from '../models/user.model.js';
import { createSubscriptionTable } from '../models/subscription.model.js';

async function initializeDatabase() {
    try {
        await pool.query(createUsersTable);
        console.log('Users table created successfully');

        await pool.query(createSubscriptionTable);
        console.log('Subscriptions table created successfully');

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initializeDatabase();
