// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

class AuthMiddleware {
    authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AppError('No token provided', 401);
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            req.user = {
                userId: decoded.userId,
                role: decoded.role
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(new AppError('Token expired', 401));
            }
            next(new AppError('Invalid token', 401));
        }
    }

    isAdmin(req, res, next) {
        if (req.user.role !== 'admin') {
            return next(new AppError('Admin access required', 403));
        }
        next();
    }

    isPlayer(req, res, next) {
        if (req.user.role !== 'player') {
            return next(new AppError('Player access required', 403));
        }
        next();
    }
}

export default new AuthMiddleware();