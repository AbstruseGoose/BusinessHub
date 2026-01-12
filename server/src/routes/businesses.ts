import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Business, Permission } from '../models';
import { UserRole } from '@businesshub/shared';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const router = Router();

// Get all businesses (filtered by user permissions)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === UserRole.ADMIN) {
      const businesses = await Business.findAll({
        where: { isActive: true }
      });
      return res.json(businesses);
    }

    // For non-admin users, get only businesses they have access to
    const permissions = await Permission.findAll({
      where: { userId: req.user?.id },
      include: [Business]
    });

    const businesses = permissions
      .map(p => p.get('Business'))
      .filter((b: any) => b && b.isActive);

    res.json(businesses);
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// Create business (admin only)
router.post('/', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { name, description, logoUrl, color } = req.body;
    
    const business = await Business.create({
      name,
      description,
      logoUrl,
      color: color || '#61AFEF'
    });

    res.status(201).json(business);
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

// Update business (admin only)
router.put('/:id', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logoUrl, color, isActive } = req.body;

    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    await business.update({
      name,
      description,
      logoUrl,
      color,
      isActive
    });

    res.json(business);
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ error: 'Failed to update business' });
  }
});

// Delete business (admin only)
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    await business.destroy();
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

export default router;
