import { Router } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@businesshub/shared';

const router = Router();

// Get all projects for a department
router.get('/department/:departmentId', authenticate, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const projects = await Project.findAll({
      where: { departmentId },
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a single project
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req, res) => {
  try {
    const { departmentId, name, description, status, priority, startDate, endDate, managerId, progress } = req.body;
    const project = await Project.create({
      departmentId,
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      managerId,
      progress: progress || 0
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, priority, startDate, endDate, managerId, progress } = req.body;
    
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.update({
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      managerId,
      progress
    });
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
