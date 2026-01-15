import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PersonAdd,
} from '@mui/icons-material';
import { theme } from '@/theme/colors';
import { api } from '@/lib/api';
import { User, Business, UserRole } from '@businesshub/shared';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';

const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const { businesses, setBusinesses } = useBusinessStore();
  const [users, setUsers] = useState<User[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openBusinessDialog, setOpenBusinessDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessForm, setBusinessForm] = useState({
    name: '',
    description: '',
    color: '#61AFEF',
  });

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      fetchUsers();
      fetchBusinesses();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    }
  };

  const handleCreateBusiness = async () => {
    try {
      const response = await api.post('/businesses', businessForm);
      setBusinesses([...businesses, response.data]);
      setOpenBusinessDialog(false);
      setBusinessForm({ name: '', description: '', color: '#61AFEF' });
    } catch (error) {
      console.error('Failed to create business:', error);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!editingBusiness) return;
    try {
      const response = await api.put(`/businesses/${editingBusiness.id}`, businessForm);
      setBusinesses(businesses.map(b => b.id === editingBusiness.id ? response.data : b));
      setOpenBusinessDialog(false);
      setEditingBusiness(null);
      setBusinessForm({ name: '', description: '', color: '#61AFEF' });
    } catch (error) {
      console.error('Failed to update business:', error);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    try {
      await api.delete(`/businesses/${id}`);
      setBusinesses(businesses.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete business:', error);
    }
  };

  const openEditDialog = (business: Business) => {
    setEditingBusiness(business);
    setBusinessForm({
      name: business.name,
      description: business.description || '',
      color: business.color,
    });
    setOpenBusinessDialog(true);
  };

  if (user?.role !== UserRole.ADMIN) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="textSecondary">
          You don't have permission to access this page
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Panel
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Businesses" />
        <Tab label="Users & Permissions" />
        <Tab label="Settings" />
      </Tabs>

      {/* Businesses Tab */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Businesses</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingBusiness(null);
                setBusinessForm({ name: '', description: '', color: '#61AFEF' });
                setOpenBusinessDialog(true);
              }}
            >
              Add Business
            </Button>
          </Box>

          <Grid container spacing={3}>
            {businesses.map((business) => (
              <Grid item xs={12} sm={6} md={4} key={business.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: business.color,
                          mr: 2,
                        }}
                      />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {business.name}
                      </Typography>
                      <IconButton size="small" onClick={() => openEditDialog(business)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteBusiness(business.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {business.description || 'No description'}
                    </Typography>
                    <Chip
                      label={business.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ mt: 2 }}
                      color={business.isActive ? 'success' : 'default'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Users Tab */}
      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Users</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setOpenUserDialog(true)}
            >
              Add User
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Settings Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              System Settings
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Additional settings will be available here
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Business Dialog */}
      <Dialog
        open={openBusinessDialog}
        onClose={() => setOpenBusinessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingBusiness ? 'Edit Business' : 'Create New Business'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Business Name"
            value={businessForm.name}
            onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={businessForm.description}
            onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Brand Color
            </Typography>
            <input
              type="color"
              value={businessForm.color}
              onChange={(e) => setBusinessForm({ ...businessForm, color: e.target.value })}
              style={{
                width: '100%',
                height: '50px',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBusinessDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editingBusiness ? handleUpdateBusiness : handleCreateBusiness}
          >
            {editingBusiness ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
