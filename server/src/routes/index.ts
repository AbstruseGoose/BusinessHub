import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';
import businessesRoutes from './businesses';

const router = Router();

// Health check route
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BusinessHub API is running' });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/businesses', businessesRoutes);

// Placeholder routes for other features
router.use('/emails', (req, res) => res.json({ message: 'Email routes coming soon' }));
router.use('/calendar', (req, res) => res.json({ message: 'Calendar routes coming soon' }));
router.use('/documents', (req, res) => res.json({ message: 'Document routes coming soon' }));
router.use('/phone', (req, res) => res.json({ message: 'Phone routes coming soon' }));
router.use('/tasks', (req, res) => res.json({ message: 'Task routes coming soon' }));

export default router;
