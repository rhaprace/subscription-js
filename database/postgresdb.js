import pkg from 'pg';
import { DB_CONFIG } from '../config/env.js';
import process from 'process';
const { Pool } = pkg;

const pool = new Pool(DB_CONFIG);

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const checkDatabaseConnection = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

export default pool;