import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { findById } from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized access, user not found'
            });
        }

        req.user = user; // Attach user to request object
        next();
        
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized access',
            error: error.message
        });
    }
};

export default authorize;