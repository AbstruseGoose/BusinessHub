import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  Email,
  CalendarMonth,
  Folder,
  Phone,
  CheckCircle,
  AdminPanelSettings,
  Logout,
  ChevronLeft,
} from '@mui/icons-material';
import { theme } from '@/theme/colors';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { UserRole } from '@businesshub/shared';
import { api } from '@/lib/api';
import { socketService } from '@/lib/socket';

const DRAWER_WIDTH = 280;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, token } = useAuthStore();
  const { businesses, setBusinesses, selectedBusinessId, selectBusiness } = useBusinessStore();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // Fetch businesses
    api.get('/businesses').then((res) => {
      setBusinesses(res.data);
      if (res.data.length > 0 && !selectedBusinessId) {
        selectBusiness(res.data[0].id);
      }
    });

    // Connect to WebSocket
    if (token) {
      socketService.connect(token);
    }
  }, [token]);

  useEffect(() => {
    if (selectedBusinessId) {
      socketService.joinBusiness(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/businesses', label: 'Businesses', icon: <Business /> },
    { path: '/emails', label: 'Emails', icon: <Email /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarMonth /> },
    { path: '/documents', label: 'Documents', icon: <Folder /> },
    { path: '/phone', label: 'Phone', icon: <Phone /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckCircle /> },
    { path: '/integrations', label: 'Integrations', icon: <Extension /> },
  ];

  if (user?.role === UserRole.ADMIN) {
    menuItems.push({ path: '/admin', label: 'Admin', icon: <AdminPanelSettings /> });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.colors.background.secondary,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: theme.colors.accent.primary }}>
            BusinessHub
          </Typography>

          {selectedBusiness && (
            <Chip
              label={selectedBusiness.name}
              sx={{
                mr: 2,
                backgroundColor: selectedBusiness.color,
                color: '#fff',
                fontWeight: 600,
              }}
            />
          )}

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: theme.colors.accent.primary }}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="textSecondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: theme.colors.background.secondary,
            borderRight: `1px solid ${theme.colors.border}`,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setDrawerOpen(false);
                }}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: theme.borderRadius.md,
                  '&.Mui-selected': {
                    backgroundColor: theme.colors.selected,
                    '&:hover': {
                      backgroundColor: theme.colors.selected,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.colors.accent.primary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {businesses.length > 0 && (
            <>
              <Divider sx={{ my: 2, mx: 2 }} />
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  py: 1,
                  display: 'block',
                  color: theme.colors.text.secondary,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Quick Switch
              </Typography>
              <List dense>
                {businesses.map((business) => (
                  <ListItemButton
                    key={business.id}
                    selected={selectedBusinessId === business.id}
                    onClick={() => selectBusiness(business.id)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: theme.borderRadius.sm,
                      '&.Mui-selected': {
                        backgroundColor: theme.colors.selected,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: business.color,
                        mr: 2,
                      }}
                    />
                    <ListItemText
                      primary={business.name}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.colors.background.primary,
          minHeight: '100vh',
          transition: 'margin 0.3s',
          marginLeft: isMobile ? 0 : drawerOpen ? 0 : `-${DRAWER_WIDTH}px`,
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
