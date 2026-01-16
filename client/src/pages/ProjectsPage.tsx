import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/theme/colors';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  progress: number;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDepartmentId } = useDepartmentStore();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: '',
    endDate: '',
    progress: 0,
  });

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const canEdit = isAdmin || isManager;

  useEffect(() => {
    if (selectedDepartmentId) {
      loadProjects();
    }
  }, [selectedDepartmentId]);

  const loadProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/projects/department/${selectedDepartmentId}`,
        { withCredentials: true }
      );
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        startDate: project.startDate?.split('T')[0] || '',
        endDate: project.endDate?.split('T')[0] || '',
        progress: project.progress,
      });
    } else {
      setSelectedProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        startDate: '',
        endDate: '',
        progress: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedProject) {
        await axios.put(
          `http://localhost:3001/api/projects/${selectedProject.id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/projects',
          { ...formData, departmentId: selectedDepartmentId },
          { withCredentials: true }
        );
      }
      setDialogOpen(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      URGENT: '#f44336',
      HIGH: '#ff9800',
      MEDIUM: '#2196f3',
      LOW: '#4caf50',
    };
    return colors[priority] || '#999';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      PLANNING: '#9c27b0',
      IN_PROGRESS: '#2196f3',
      ON_HOLD: '#ff9800',
      COMPLETED: '#4caf50',
      CANCELLED: '#f44336',
    };
    return colors[status] || '#999';
  };

  if (!selectedDepartmentId) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Please select a department to view projects
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Projects
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Project
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows.md,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {project.name}
                  </Typography>
                  {canEdit && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(project);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  <Chip
                    label={project.status.replace('_', ' ')}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(project.status)}20`,
                      color: getStatusColor(project.status),
                    }}
                  />
                  <Chip
                    label={project.priority}
                    size="small"
                    sx={{
                      backgroundColor: `${getPriorityColor(project.priority)}20`,
                      color: getPriorityColor(project.priority),
                    }}
                  />
                </Box>

                {project.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description.substring(0, 100)}
                    {project.description.length > 100 ? '...' : ''}
                  </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {project.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={project.progress} sx={{ height: 6, borderRadius: 3 }} />
                </Box>

                {project.manager && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {project.manager.firstName[0]}
                    </Avatar>
                    <Typography variant="caption">
                      {project.manager.firstName} {project.manager.lastName}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Project Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProject ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Status"
                select
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="PLANNING">Planning</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="ON_HOLD">On Hold</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </TextField>
              <TextField
                label="Priority"
                select
                fullWidth
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </Box>
            <TextField
              label="Progress (%)"
              type="number"
              fullWidth
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.name}>
            {selectedProject ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
