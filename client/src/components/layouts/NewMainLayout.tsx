import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Logout,
  Business as BusinessIcon,
  Phone,
  Email,
  Notifications,
  Settings,
  ExpandLess,
  ExpandMore,
  Dashboard,
  FolderOpen,
  People,
  IntegrationInstructions,
  AdminPanelSettings,
  AccountTree,
} from '@mui/icons-material';
import { theme } from '@/theme/colors';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useDepartmentStore } from '@/stores/departmentStore';
import { UserRole } from '@businesshub/shared';
import { api } from '@/lib/api';
import { socketService } from '@/lib/socket';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 60;

const NewMainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, token } = useAuthStore();
  const { businesses, setBusinesses, selectedBusinessId, selectBusiness } = useBusinessStore();
  const { departments, setDepartments, selectedDepartmentId, selectDepartment } = useDepartmentStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [businessMenuAnchor, setBusinessMenuAnchor] = useState<null | HTMLElement>(null);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(true);
  
  const isMobile = useMediaQuery('(max-width:768px)');
  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    api.get('/businesses').then((res) => {
      setBusinesses(res.data);
      if (res.data.length > 0 && !selectedBusinessId) {
        selectBusiness(res.data[0].id);
      }
    });

    if (token) {
      socketService.connect(token);
    }
  }, [token]);

  useEffect(() => {
    if (selectedBusinessId) {
      socketService.joinBusiness(selectedBusinessId);
      loadDepartments();
    }
  }, [selectedBusinessId]);

  const loadDepartments = async () => {
    if (!selectedBusinessId) return;
    try {
      const response = await api.get(`/departments/business/${selectedBusinessId}`);
      setDepartments(response.data);
      if (response.data.length > 0 && !selectedDepartmentId) {
        selectDepartment(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const selectedDept = departments.find((d) => d.id === selectedDepartmentId);

  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.background.primary }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.colors.background.secondary,
          borderBottom: `1px solid ${theme.colors.border}`,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '48px !important', py: 0.5 }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => {
                if (sidebarCollapsed) {
                  setSidebarCollapsed(false);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
            >
              {sidebarOpen && !sidebarCollapsed ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: theme.colors.accent.primary,
              }}
            >
              BusinessHub
            </Typography>

            {selectedDept && (
              <>
                <ChevronRight fontSize="small" sx={{ color: theme.colors.text.secondary }} />
                <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
                  {selectedDept.name}
                </Typography>
              </>
            )}
          </Box>

          {/* Center Section - Business Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              startIcon={<BusinessIcon />}
              onClick={(e) => setBusinessMenuAnchor(e.currentTarget)}
              sx={{
                backgroundColor: selectedBusiness?.color,
                color: '#fff',
                '&:hover': { backgroundColor: selectedBusiness?.color, opacity: 0.9 },
                textTransform: 'none',
                px: 2,
              }}
            >
              {selectedBusiness?.name || 'Select Business'}
            </Button>
            <Menu
              anchorEl={businessMenuAnchor}
              open={Boolean(businessMenuAnchor)}
              onClose={() => setBusinessMenuAnchor(null)}
            >
              {businesses.map((business) => (
                <MenuItem
                  key={business.id}
                  selected={business.id === selectedBusinessId}
                  onClick={() => {
                    selectBusiness(business.id);
                    setBusinessMenuAnchor(null);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: business.color,
                      }}
                    />
                    {business.name}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Right Section - Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Phone">
              <IconButton
                size="small"
                onClick={() => navigate(`/business/${selectedBusinessId}/phone`)}
              >
                <Phone fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Email">
              <IconButton
                size="small"
                onClick={() => navigate(`/business/${selectedBusinessId}/emails`)}
              >
                <Email fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton size="small">
                <Badge badgeContent={0} color="error">
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <IconButton
              size="small"
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.875rem',
                  bgcolor: theme.colors.accent.primary,
                }}
              >
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={() => setUserMenuAnchor(null)}
            >
              <MenuItem disabled>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.colors.background.secondary,
            borderRight: `1px solid ${theme.colors.border}`,
            transition: 'width 0.2s',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important' }} />
        <Box sx={{ overflow: 'auto', pt: 1 }}>
          {/* Collapse Toggle */}
          {!isMobile && (
            <Box sx={{ px: 1, mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                sx={{ width: '100%' }}
              >
                {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </Box>
          )}

          <List dense>
            {/* Dashboard */}
            <ListItemButton
              selected={location.pathname === '/'}
              onClick={() => {
                navigate('/');
                if (isMobile) setSidebarOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.colors.selected,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Dashboard" />}
            </ListItemButton>

            {/* Departments Section */}
            <Divider sx={{ my: 1 }} />
            
            <ListItemButton
              onClick={() => setDepartmentsExpanded(!departmentsExpanded)}
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <AccountTree fontSize="small" />
              </ListItemIcon>
              {!sidebarCollapsed && (
                <>
                  <ListItemText primary="Departments" />
                  {departmentsExpanded ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>

            <Collapse in={departmentsExpanded && !sidebarCollapsed} timeout="auto">
              <List component="div" disablePadding>
                {departments.map((dept) => (
                  <ListItemButton
                    key={dept.id}
                    selected={dept.id === selectedDepartmentId}
                    onClick={() => {
                      selectDepartment(dept.id);
                      navigate('/');
                      if (isMobile) setSidebarOpen(false);
                    }}
                    sx={{
                      pl: 5,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: theme.colors.selected,
                      },
                    }}
                  >
                    <ListItemText
                      primary={dept.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />

            {/* Projects */}
            <ListItemButton
              selected={location.pathname === '/projects'}
              onClick={() => {
                navigate('/projects');
                if (isMobile) setSidebarOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.colors.selected,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderOpen fontSize="small" />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Projects" />}
            </ListItemButton>

            {/* Team */}
            <ListItemButton
              selected={location.pathname === '/team'}
              onClick={() => {
                navigate('/team');
                if (isMobile) setSidebarOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.colors.selected,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <People fontSize="small" />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Team" />}
            </ListItemButton>

            {/* Integrations */}
            <ListItemButton
              selected={location.pathname.includes('/integrations')}
              onClick={() => {
                navigate(`/business/${selectedBusinessId}/integrations`);
                if (isMobile) setSidebarOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.colors.selected,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <IntegrationInstructions fontSize="small" />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Integrations" />}
            </ListItemButton>

            {isAdmin && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItemButton
                  selected={location.pathname === '/admin'}
                  onClick={() => {
                    navigate('/admin');
                    if (isMobile) setSidebarOpen(false);
                  }}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: theme.colors.selected,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AdminPanelSettings fontSize="small" />
                  </ListItemIcon>
                  {!sidebarCollapsed && <ListItemText primary="Admin" />}
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '48px',
          marginLeft: sidebarOpen && !isMobile ? 0 : `-${sidebarWidth}px`,
          transition: 'margin 0.2s',
          backgroundColor: theme.colors.background.primary,
          minHeight: 'calc(100vh - 48px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default NewMainLayout;
