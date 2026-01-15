import { Router } from 'express';
import { DashboardConfig } from '../models/DashboardConfig';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get dashboard config for a business (user-specific or default)
router.get('/business/:businessId', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = (req as any).user.id;

    // Try to find user-specific config first
    let config = await DashboardConfig.findOne({
      where: { businessId, userId }
    });

    // If not found, try to find default business config
    if (!config) {
      config = await DashboardConfig.findOne({
        where: { businessId, userId: null }
      });
    }

    // If still not found, return default config
    if (!config) {
      return res.json({
        businessId,
        userId: null,
        config: {
          widgets: ['stats', 'recent_tasks', 'calendar', 'emails'],
          statsToShow: ['unread_emails', 'todays_meetings', 'pending_tasks', 'missed_calls']
        }
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard config' });
  }
});

// Save/Update dashboard config
router.post('/business/:businessId', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = (req as any).user.id;
    const { config, isDefault } = req.body;

    const targetUserId = isDefault ? null : userId;

    const [dashboardConfig, created] = await DashboardConfig.findOrCreate({
      where: { businessId, userId: targetUserId },
      defaults: { businessId, userId: targetUserId, config }
    });

    if (!created) {
      await dashboardConfig.update({ config });
    }

    res.json(dashboardConfig);
  } catch (error) {
    console.error('Error saving dashboard config:', error);
    res.status(500).json({ error: 'Failed to save dashboard config' });
  }
});

export default router;
