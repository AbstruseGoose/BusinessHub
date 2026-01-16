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
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  IntegrationInstructions as IntegrationIcon
} from '@mui/icons-material';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/theme/colors';
import axios from 'axios';

interface Department {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  integrations?: Array<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
  }>;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const DepartmentsPage: React.FC = () => {
  const { selectedBusinessId } = useBusinessStore();
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    managerId: ''
  });

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const canEdit = isAdmin || isManager;

  useEffect(() => {
    if (selectedBusinessId) {
      loadDepartments();
      loadUsers();
    }
  }, [selectedBusinessId]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/departments/business/${selectedBusinessId}`,
        { withCredentials: true }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/businesses/${selectedBusinessId}/users`,
        { withCredentials: true }
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name,
        description: department.description || '',
        phone: department.phone || '',
        email: department.email || '',
        managerId: department.managerId || ''
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        description: '',
        phone: '',
        email: '',
        managerId: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleSave = async () => {
    try {
      if (selectedDepartment) {
        await axios.put(
          `http://localhost:3001/api/departments/${selectedDepartment.id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/departments',
          { ...formData, businessId: selectedBusinessId },
          { withCredentials: true }
        );
      }
      handleCloseDialog();
      loadDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    try {
      await axios.delete(
        `http://localhost:3001/api/departments/${selectedDepartment.id}`,
        { withCredentials: true }
      );
      setDeleteDialogOpen(false);
      setSelectedDepartment(null);
      loadDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Departments
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: theme.colors.accent.primary,
              '&:hover': { backgroundColor: theme.colors.accent.hover }
            }}
          >
            Add Department
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} md={6} lg={4} key={department.id}>
            <Card
              sx={{
                height: '100%',
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows.md,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar
                      sx={{
                        backgroundColor: `${theme.colors.accent.primary}20`,
                        color: theme.colors.accent.primary,
                        mr: 2
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {department.name}
                    </Typography>
                  </Box>
                  {canEdit && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(department)}
                        sx={{ color: theme.colors.accent.primary }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {isAdmin && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Box>

                {department.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {department.description}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <List dense disablePadding>
                  {department.manager && (
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PersonIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Manager"
                        secondary={`${department.manager.firstName} ${department.manager.lastName}`}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                      />
                    </ListItem>
                  )}

                  {department.phone && (
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={department.phone}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                      />
                    </ListItem>
                  )}

                  {department.email && (
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmailIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={department.email}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                      />
                    </ListItem>
                  )}

                  {department.integrations && department.integrations.length > 0 && (
                    <ListItem disablePadding sx={{ mt: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <IntegrationIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Integrations"
                        secondary={
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {department.integrations.map((integration) => (
                              <Chip
                                key={integration.id}
                                label={integration.name}
                                size="small"
                                color={integration.isActive ? 'success' : 'default'}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        }
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
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
            <TextField
              label="Phone"
              fullWidth
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Manager"
              fullWidth
              select
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name}
          >
            {selectedDepartment ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Department?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentsPage;
