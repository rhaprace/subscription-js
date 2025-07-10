import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '../config/env.js';
import * as User from '../models/user.model.js';
import pool from '../database/postgresdb.js';

export const signUp = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            throw { 
                statusCode: 400, 
                message: 'Username, email and password are required' 
            };
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw { 
                statusCode: 400, 
                message: 'User already exists' 
            };
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

 
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

  
        const token = jwt.sign(
            { userId: newUser.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: newUser.id,
            token
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        });
    } finally {
        client.release();
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

  
        if (!email || !password) {
            throw { 
                statusCode: 400, 
                message: 'Email and password are required' 
            };
        }


        const user = await User.findByEmail(email);
        if (!user) {
            throw { 
                statusCode: 401, 
                message: 'Invalid credentials' 
            };
        }


        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw { 
                statusCode: 401, 
                message: 'Invalid credentials' 
            };
        }


        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully signed in',
            userId: user.id,
            token
        });
    } catch (error) {
        next({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        });
    }
};

export const signOut = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Successfully signed out'
    });
};