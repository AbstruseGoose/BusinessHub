import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { User, Business, Permission } from '../models';
import { UserRole } from '@businesshub/shared';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: Permission,
          include: [Business]
        }
      ]
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Users can only view themselves unless they're admin
    if (req.user?.role !== UserRole.ADMIN && req.user?.id !== id) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: Permission,
          include: [Business]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (admin only or self for limited fields)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Non-admin users can only update their own name
    if (req.user?.role !== UserRole.ADMIN) {
      if (req.user?.id !== id) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      await user.update({ name });
    } else {
      // Admin can update everything
      await user.update({ name, role, isActive });
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Grant permissions to user (admin only)
router.post('/:userId/permissions', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      businessId,
      canAccessEmails,
      canAccessCalendar,
      canAccessDocuments,
      canAccessPhone,
      canManageTasks
    } = req.body;

    const [permission, created] = await Permission.findOrCreate({
      where: { userId, businessId },
      defaults: {
        canAccessEmails,
        canAccessCalendar,
        canAccessDocuments,
        canAccessPhone,
        canManageTasks
      }
    });

    if (!created) {
      await permission.update({
        canAccessEmails,
        canAccessCalendar,
        canAccessDocuments,
        canAccessPhone,
        canManageTasks
      });
    }

    res.json(permission);
  } catch (error) {
    console.error('Grant permission error:', error);
    res.status(500).json({ error: 'Failed to grant permissions' });
  }
});

// Revoke permissions (admin only)
router.delete('/:userId/permissions/:businessId', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { userId, businessId } = req.params;

    await Permission.destroy({
      where: { userId, businessId }
    });

    res.json({ message: 'Permissions revoked successfully' });
  } catch (error) {
    console.error('Revoke permission error:', error);
    res.status(500).json({ error: 'Failed to revoke permissions' });
  }
});

export default router;
