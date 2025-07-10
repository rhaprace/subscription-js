import pool from '../database/postgresdb.js';

const createSubscriptionTable = `
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plan VARCHAR(50) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

export const findById = async (id) => {
    const query = 'SELECT * FROM subscriptions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const findByUserId = async (userId) => {
    const query = 'SELECT * FROM subscriptions WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const create = async (subscriptionData) => {
    const { user_id, plan, category, price, end_date } = subscriptionData;
    const query = `
        INSERT INTO subscriptions (user_id, plan, category, price, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, plan, category, price, end_date, status, created_at, updated_at
    `;
    const result = await pool.query(query, [user_id, plan, category, price, end_date]);
    return result.rows[0];
};

export const update = async (id, subscriptionData) => {
    const { plan, category, price, end_date, status } = subscriptionData;
    const query = `
        UPDATE subscriptions 
        SET plan = $1, category = $2, price = $3, end_date = $4, status = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
    `;
    const result = await pool.query(query, [plan, category, price, end_date, status, id]);
    return result.rows[0];
};

export const remove = async (id) => {
    const query = 'DELETE FROM subscriptions WHERE id = $1';
    await pool.query(query, [id]);
};

export {
    createSubscriptionTable
};