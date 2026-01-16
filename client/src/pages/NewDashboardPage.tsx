import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Schedule,
  Person,
  Phone,
  Email,
  Folder,
  IntegrationInstructions,
  Add,
  MoreVert,
  CalendarToday,
  Assignment,
} from '@mui/icons-material';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useBusinessStore } from '@/stores/businessStore';
import { theme } from '@/theme/colors';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Stats {
  activeProjects: number;
  completedProjects: number;
  teamMembers: number;
  pendingTasks: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
  priority: string;
  progress: number;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

const NewDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDepartmentId, departments } = useDepartmentStore();
  const { selectedBusinessId } = useBusinessStore();
  const [stats, setStats] = useState<Stats>({
    activeProjects: 0,
    completedProjects: 0,
    teamMembers: 0,
    pendingTasks: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDept = departments.find((d) => d.id === selectedDepartmentId);

  useEffect(() => {
    if (selectedDepartmentId) {
      loadDepartmentData();
    }
  }, [selectedDepartmentId]);

  const loadDepartmentData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsRes = await api.get(`/projects/department/${selectedDepartmentId}`);
      setProjects(projectsRes.data);
      
      // Calculate stats
      const activeProjects = projectsRes.data.filter((p: any) => p.status === 'IN_PROGRESS').length;
      const completedProjects = projectsRes.data.filter((p: any) => p.status === 'COMPLETED').length;
      
      // Load integrations
      const integrationsRes = await api.get(`/integrations/business/${selectedBusinessId}`);
      const deptIntegrations = integrationsRes.data.filter((i: any) => i.departmentId === selectedDepartmentId);
      setIntegrations(deptIntegrations);
      
      setStats({
        activeProjects,
        completedProjects,
        teamMembers: 0, // TODO: Load from API
        pendingTasks: 0, // TODO: Load from API
      });
    } catch (error) {
      console.error('Failed to load department data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, change, color }: any) => (
    <Card sx={{ height: '100%', border: `1px solid ${theme.colors.border}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {change > 0 ? (
                  <TrendingUp fontSize="small" color="success" />
                ) : (
                  <TrendingDown fontSize="small" color="error" />
                )}
                <Typography variant="caption" color={change > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(change)}% vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      URGENT: theme.colors.error,
      HIGH: '#ff9800',
      MEDIUM: '#2196f3',
      LOW: '#4caf50',
    };
    return colors[priority] || '#999';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      IN_PROGRESS: '#2196f3',
      COMPLETED: '#4caf50',
      ON_HOLD: '#ff9800',
      PLANNING: '#9c27b0',
      CANCELLED: '#f44336',
    };
    return colors[status] || '#999';
  };

  if (!selectedDept) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Please select a department
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Department Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {selectedDept.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedDept.description || 'Department Dashboard'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedDept.phone && (
              <Chip icon={<Phone />} label={selectedDept.phone} variant="outlined" />
            )}
            {selectedDept.email && (
              <Chip icon={<Email />} label={selectedDept.email} variant="outlined" />
            )}
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Folder />}
            label="Active Projects"
            value={stats.activeProjects}
            change={12}
            color={theme.colors.accent.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircle />}
            label="Completed Projects"
            value={stats.completedProjects}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Person />}
            label="Team Members"
            value={stats.teamMembers}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Assignment />}
            label="Pending Tasks"
            value={stats.pendingTasks}
            change={-5}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Projects Section */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ border: `1px solid ${theme.colors.border}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Active Projects
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => navigate('/projects')}
                >
                  New Project
                </Button>
              </Box>
              
              <List disablePadding>
                {projects.slice(0, 5).map((project, index) => (
                  <React.Fragment key={project.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 2,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: theme.colors.hover },
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      secondaryAction={
                        <IconButton edge="end" size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                              {project.name}
                            </Typography>
                            <Chip
                              label={project.status.replace('_', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(project.status)}20`,
                                color: getStatusColor(project.status),
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                            <Chip
                              label={project.priority}
                              size="small"
                              sx={{
                                backgroundColor: `${getPriorityColor(project.priority)}20`,
                                color: getPriorityColor(project.priority),
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Progress: {project.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
                {projects.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No projects yet"
                      secondary="Create your first project to get started"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar - Integrations & Quick Actions */}
        <Grid item xs={12} lg={4}>
          {/* Integrations */}
          <Card sx={{ mb: 3, border: `1px solid ${theme.colors.border}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Integrations
                </Typography>
                <IconButton size="small" onClick={() => navigate(`/business/${selectedBusinessId}/integrations`)}>
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              
              <List disablePadding>
                {integrations.map((integration, index) => (
                  <React.Fragment key={integration.id}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <IntegrationInstructions fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={integration.name}
                        secondary={integration.type.replace('_', ' ')}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Chip
                        label={integration.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={integration.isActive ? 'success' : 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
                {integrations.length === 0 && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="No integrations"
                      secondary="Add integrations to enhance your workflow"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ border: `1px solid ${theme.colors.border}` }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  onClick={() => navigate(`/business/${selectedBusinessId}/calendar`)}
                >
                  View Calendar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  onClick={() => navigate('/tasks')}
                >
                  Manage Tasks
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Folder />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  onClick={() => navigate(`/business/${selectedBusinessId}/documents`)}
                >
                  Documents
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewDashboardPage;
