import { Router } from 'express';
import { Department } from '../models/Department';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Get all departments for a business
router.get('/business/:businessId', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const departments = await Department.findAll({
      where: { businessId },
      order: [['name', 'ASC']]
    });
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Create a new department
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { businessId, name, description } = req.body;
    const department = await Department.create({
      businessId,
      name,
      description
    });
    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// Update a department
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await department.update({ name, description });
    res.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// Delete a department
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;
