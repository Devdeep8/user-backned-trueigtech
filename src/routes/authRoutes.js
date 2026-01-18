// routes/authRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import authController from '../controllers/auth.controller.js';

const authRoutes = express.Router();

// Public routes
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/refresh', authController.refresh);
authRoutes.get("/me", authMiddleware.authenticate, authController.me);

// Protected routes
authRoutes.post('/logout', authMiddleware.authenticate, authController.logout );

export default authRoutes;