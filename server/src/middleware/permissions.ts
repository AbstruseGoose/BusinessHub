import { Request, Response, NextFunction } from 'express';
import { Permission } from '../models/Permission';
import { UserRole } from '@businesshub/shared';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Permission types
export enum PermissionType {
  ACCESS_EMAILS = 'canAccessEmails',
  ACCESS_CALENDAR = 'canAccessCalendar',
  ACCESS_DOCUMENTS = 'canAccessDocuments',
  ACCESS_PHONE = 'canAccessPhone',
  MANAGE_TASKS = 'canManageTasks',
  ACCESS_INTEGRATIONS = 'canAccessIntegrations',
  MANAGE_DEPARTMENTS = 'canManageDepartments',
}

/**
 * Middleware to check if user has specific permission for a business
 * Admins always have full access
 */
export const requirePermission = (permissionType: PermissionType, businessIdParam: string = 'businessId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Admins have all permissions
      if (user.role === UserRole.ADMIN) {
        return next();
      }

      // Get business ID from params, query, or body
      const businessId = req.params[businessIdParam] || req.query[businessIdParam] || req.body[businessIdParam];
      
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      // Check user's permissions for this business
      const permission = await Permission.findOne({
        where: {
          userId: user.id,
          businessId: businessId
        }
      });

      if (!permission) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permissions for this business'
        });
      }

      // Check specific permission
      if (!permission[permissionType]) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: `You do not have permission to ${permissionType.replace('can', '').replace(/([A-Z])/g, ' $1').toLowerCase()}`
        });
      }

      // User has the required permission
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

/**
 * Middleware to check if user has ANY of the specified permissions
 */
export const requireAnyPermission = (permissionTypes: PermissionType[], businessIdParam: string = 'businessId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Admins have all permissions
      if (user.role === UserRole.ADMIN) {
        return next();
      }

      const businessId = req.params[businessIdParam] || req.query[businessIdParam] || req.body[businessIdParam];
      
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      const permission = await Permission.findOne({
        where: {
          userId: user.id,
          businessId: businessId
        }
      });

      if (!permission) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permissions for this business'
        });
      }

      // Check if user has any of the required permissions
      const hasPermission = permissionTypes.some(permType => permission[permType]);

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have any of the required permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

/**
 * Middleware to check if user has ALL of the specified permissions
 */
export const requireAllPermissions = (permissionTypes: PermissionType[], businessIdParam: string = 'businessId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Admins have all permissions
      if (user.role === UserRole.ADMIN) {
        return next();
      }

      const businessId = req.params[businessIdParam] || req.query[businessIdParam] || req.body[businessIdParam];
      
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      const permission = await Permission.findOne({
        where: {
          userId: user.id,
          businessId: businessId
        }
      });

      if (!permission) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permissions for this business'
        });
      }

      // Check if user has all required permissions
      const hasAllPermissions = permissionTypes.every(permType => permission[permType]);

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have all required permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

/**
 * Attach user's permissions for a business to the request object
 * Useful for checking permissions in route handlers
 */
export const attachPermissions = (businessIdParam: string = 'businessId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return next();
      }

      const businessId = req.params[businessIdParam] || req.query[businessIdParam] || req.body[businessIdParam];
      
      if (!businessId) {
        return next();
      }

      // Admins have all permissions
      if (user.role === UserRole.ADMIN) {
        (req as any).permissions = {
          canAccessEmails: true,
          canAccessCalendar: true,
          canAccessDocuments: true,
          canAccessPhone: true,
          canManageTasks: true,
          canAccessIntegrations: true,
          canManageDepartments: true,
        };
        return next();
      }

      const permission = await Permission.findOne({
        where: {
          userId: user.id,
          businessId: businessId
        }
      });

      if (permission) {
        (req as any).permissions = {
          canAccessEmails: permission.canAccessEmails,
          canAccessCalendar: permission.canAccessCalendar,
          canAccessDocuments: permission.canAccessDocuments,
          canAccessPhone: permission.canAccessPhone,
          canManageTasks: permission.canManageTasks,
          canAccessIntegrations: permission.canAccessIntegrations,
          canManageDepartments: permission.canManageDepartments,
        };
      }

      next();
    } catch (error) {
      console.error('Error attaching permissions:', error);
      next();
    }
  };
};
