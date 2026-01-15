import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
} from '@mui/material';
import {
  Email,
  CalendarMonth,
  Phone,
  CheckCircle,
  TrendingUp,
  Settings,
  Link as LinkIcon,
  Refresh,
} from '@mui/icons-material';
import { theme } from '@/theme/colors';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface DashboardConfig {
  widgets: string[];
  statsToShow: string[];
  integrationsToShow: string[];
}

interface Integration {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  config: any;
}

const DashboardPage: React.FC = () => {
  const { businesses, selectedBusinessId } = useBusinessStore();
  const { user } = useAuthStore();
  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    widgets: ['stats', 'recent_tasks', 'calendar', 'emails', 'integrations'],
    statsToShow: ['unread_emails', 'todays_meetings', 'pending_tasks', 'missed_calls'],
    integrationsToShow: [],
  });
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBusinessId) {
      loadDashboardConfig();
      loadIntegrations();
    }
  }, [selectedBusinessId]);

  const loadDashboardConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/dashboard-config/business/${selectedBusinessId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.config) {
        setDashboardConfig({
          ...response.data.config,
          integrationsToShow: response.data.config.integrationsToShow || [],
        });
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/integrations/business/${selectedBusinessId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIntegrations(response.data);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const saveDashboardConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/dashboard-config/business/${selectedBusinessId}`,
        { config: dashboardConfig },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConfigDialogOpen(false);
    } catch (error) {
      console.error('Error saving dashboard config:', error);
    }
  };

  const handleWidgetToggle = (widget: string) => {
    setDashboardConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.includes(widget)
        ? prev.widgets.filter((w) => w !== widget)
        : [...prev.widgets, widget],
    }));
  };

  const handleStatToggle = (stat: string) => {
    setDashboardConfig((prev) => ({
      ...prev,
      statsToShow: prev.statsToShow.includes(stat)
        ? prev.statsToShow.filter((s) => s !== stat)
        : [...prev.statsToShow, stat],
    }));
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setDashboardConfig((prev) => ({
      ...prev,
      integrationsToShow: prev.integrationsToShow.includes(integrationId)
        ? prev.integrationsToShow.filter((id) => id !== integrationId)
        : [...prev.integrationsToShow, integrationId],
    }));
  };

  const availableWidgets = [
    { id: 'stats', label: 'Statistics' },
    { id: 'recent_tasks', label: 'Recent Tasks' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'emails', label: 'Emails' },
    { id: 'integrations', label: 'Active Integrations' },
    { id: 'quick_stats', label: 'Quick Stats' },
  ];

  const availableStats = [
    { id: 'unread_emails', label: 'Unread Emails' },
    { id: 'todays_meetings', label: "Today's Meetings" },
    { id: 'pending_tasks', label: 'Pending Tasks' },
    { id: 'missed_calls', label: 'Missed Calls' },
  ];

  const stats = [
    { id: 'unread_emails', label: 'Unread Emails', value: 23, icon: <Email />, color: theme.colors.syntax.blue },
    { id: 'todays_meetings', label: 'Today\'s Meetings', value: 5, icon: <CalendarMonth />, color: theme.colors.syntax.purple },
    { id: 'missed_calls', label: 'Missed Calls', value: 3, icon: <Phone />, color: theme.colors.syntax.red },
    { id: 'pending_tasks', label: 'Pending Tasks', value: 12, icon: <CheckCircle />, color: theme.colors.syntax.yellow },
  ].filter((stat) => dashboardConfig.statsToShow.includes(stat.id));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <IconButton
          onClick={() => setConfigDialogOpen(true)}
          sx={{
            backgroundColor: theme.colors.background.secondary,
            '&:hover': { backgroundColor: theme.colors.background.tertiary },
          }}
        >
          <Settings />
        </IconButton>
      </Box>

      {selectedBusiness && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme.colors.background.secondary,
            borderLeft: `4px solid ${selectedBusiness.color}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {selectedBusiness.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedBusiness.description || 'No description available'}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Stats Widget */}
        {dashboardConfig.widgets.includes('stats') && (
          <>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows.md,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: theme.borderRadius.md,
                          backgroundColor: `${stat.color}20`,
                          color: stat.color,
                          mr: 2,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {stat.label}
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}

        {/* Active Integrations Widget */}
        {dashboardConfig.widgets.includes('integrations') && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinkIcon sx={{ color: theme.colors.accent.primary, mr: 1 }} />
                    <Typography variant="h6">Active Integrations</Typography>
                  </Box>
                  <IconButton size="small" onClick={loadIntegrations}>
                    <Refresh />
                  </IconButton>
                </Box>
                
                {integrations.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No integrations configured yet. Set up integrations to see them here.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {integrations
                      .filter((integration) =>
                        dashboardConfig.integrationsToShow.length === 0 ||
                        dashboardConfig.integrationsToShow.includes(integration.id)
                      )
                      .map((integration) => (
                        <Grid item xs={12} sm={6} md={4} key={integration.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: theme.colors.accent.primary,
                                boxShadow: theme.shadows.md,
                              },
                            }}
                            onClick={() => window.location.href = `/integrations/${integration.id}`}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                  {integration.name}
                                </Typography>
                                <Chip
                                  label={integration.isActive ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={integration.isActive ? 'success' : 'default'}
                                />
                              </Box>
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                                {integration.type.replace(/_/g, ' ')}
                              </Typography>
                              {integration.description && (
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                                  {integration.description}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Stats Widget */}
        {dashboardConfig.widgets.includes('quick_stats') && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ color: theme.colors.accent.primary, mr: 1 }} />
                  <Typography variant="h6">Quick Stats</Typography>
                </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Email Response Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    87%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={87}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.syntax.green,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tasks Completed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    64%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={64}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.accent.primary,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Call Answer Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    92%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.syntax.purple,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        )}

        {/* Recent Activity Widget */}
        {dashboardConfig.widgets.includes('emails') && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Recent Activity
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { time: '10 min ago', action: 'New email from client@example.com', type: 'email' },
                    { time: '25 min ago', action: 'Missed call from +1 234 567 8900', type: 'call' },
                    { time: '1 hour ago', action: 'Meeting scheduled for tomorrow', type: 'calendar' },
                    { time: '2 hours ago', action: 'Document uploaded: Q4_Report.pdf', type: 'document' },
                  ].map((activity, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background.tertiary,
                        borderLeft: `3px solid ${theme.colors.accent.primary}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Dashboard Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure Dashboard</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Widgets to Display
            </Typography>
            <FormGroup>
              {availableWidgets.map((widget) => (
                <FormControlLabel
                  key={widget.id}
                  control={
                    <Checkbox
                      checked={dashboardConfig.widgets.includes(widget.id)}
                      onChange={() => handleWidgetToggle(widget.id)}
                    />
                  }
                  label={widget.label}
                />
              ))}
            </FormGroup>
          </Box>

          {dashboardConfig.widgets.includes('stats') && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Statistics to Show
              </Typography>
              <FormGroup>
                {availableStats.map((stat) => (
                  <FormControlLabel
                    key={stat.id}
                    control={
                      <Checkbox
                        checked={dashboardConfig.statsToShow.includes(stat.id)}
                        onChange={() => handleStatToggle(stat.id)}
                      />
                    }
                    label={stat.label}
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          {dashboardConfig.widgets.includes('integrations') && integrations.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Integrations to Display
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                Leave all unchecked to show all integrations
              </Typography>
              <FormGroup>
                {integrations.map((integration) => (
                  <FormControlLabel
                    key={integration.id}
                    control={
                      <Checkbox
                        checked={dashboardConfig.integrationsToShow.includes(integration.id)}
                        onChange={() => handleIntegrationToggle(integration.id)}
                      />
                    }
                    label={`${integration.name} (${integration.type.replace(/_/g, ' ')})`}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveDashboardConfig} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
