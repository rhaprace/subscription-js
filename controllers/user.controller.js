import { createUsersTable } from '../models/user.model.js';
import pool from '../database/postgresdb.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await pool.query('SELECT id, username, email, created_at FROM users');
        res.json({
            success: true,
            data: users.rows
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await createUsersTable.findById(id)
        
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const updatedUser = await createUsersTable.update(id, { username, email });
        
        if (!updatedUser) {
            throw { statusCode: 404, message: 'User not found' };
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await createUsersTable.remove(id);
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};