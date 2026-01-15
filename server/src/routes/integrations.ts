import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Integration, Business } from '../models';
import { UserRole } from '@businesshub/shared';
import { encryptIntegrationCredentials, decryptIntegrationCredentials } from '../utils/encryption';
import { integrationLimiter } from '../middleware/rateLimiter';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const router = Router();

// Get integrations for a business
router.get('/business/:businessId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { businessId } = req.params;

    const integrations = await Integration.findAll({
      where: { businessId, isActive: true }
    });

    // Return without decrypting credentials for security
    res.json(integrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Get single integration with decrypted credentials (for iframe viewer)
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const integration = await Integration.findByPk(id);
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Decrypt credentials for viewer
    const decryptedConfig = decryptIntegrationCredentials(integration.config);
    
    res.json({
      ...integration.toJSON(),
      config: decryptedConfig
    });
  } catch (error) {
    console.error('Get integration error:', error);
    res.status(500).json({ error: 'Failed to fetch integration' });
  }
});

// Create integration (admin/manager only)
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, name, type, description, config } = req.body;

    // Verify business exists
    const business = await Business.findByPk(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Encrypt sensitive credentials
    const encryptedConfig = encryptIntegrationCredentials(config);

    const integration = await Integration.create({
      businessId,
      name,
      type,
      description,
      config: encryptedConfig,
      isActive: true
    });

    res.status(201).json(integration);
  } catch (error) {
    console.error('Create integration error:', error);
    res.status(500).json({ error: 'Failed to create integration' });
  }
});

// Update integration - with rate limiting
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), integrationLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, config, isActive } = req.body;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Encrypt sensitive credentials
    const encryptedConfig = encryptIntegrationCredentials(config);

    await integration.update({
      name,
      description,
      config: encryptedConfig,
      isActive
    });

    res.json(integration);
  } catch (error) {
    console.error('Update integration error:', error);
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

// Delete integration
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    await integration.destroy();
    res.json({ message: 'Integration deleted successfully' });
  } catch (error) {
    console.error('Delete integration error:', error);
    res.status(500).json({ error: 'Failed to delete integration' });
  }
});

// Proxy endpoint for auto-login to external portals
router.post('/:id/proxy-login', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const integration = await Integration.findByPk(id);
    if (!integration || integration.type !== 'PROXY_PORTAL') {
      return res.status(404).json({ error: 'Proxy portal integration not found' });
    }

    // Return the iframe URL with auto-login token
    // In production, this would generate a secure token and handle the auto-login
    const config = integration.config as any;
    
    res.json({
      iframeUrl: config.portalUrl,
      autoLoginUrl: config.loginUrl,
      sessionToken: 'generated-session-token-here' // TODO: Implement secure token generation
    });
  } catch (error) {
    console.error('Proxy login error:', error);
    res.status(500).json({ error: 'Failed to proxy login' });
  }
});

export default router;
