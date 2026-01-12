import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Settings, Delete, OpenInNew } from '@mui/icons-material';
import { Integration, IntegrationType } from '@businesshub/shared';
import { api } from '@/lib/api';
import { useBusinessStore } from '@/stores/businessStore';

const IntegrationsPage: React.FC = () => {
  const { currentBusiness } = useBusinessStore();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: IntegrationType.CUSTOM_IFRAME,
    description: '',
    config: {} as any,
  });

  useEffect(() => {
    if (currentBusiness) {
      loadIntegrations();
    }
  }, [currentBusiness]);

  const loadIntegrations = async () => {
    try {
      const response = await api.get(`/integrations/business/${currentBusiness?.id}`);
      setIntegrations(response.data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  const handleOpenDialog = (integration?: Integration) => {
    if (integration) {
      setEditingIntegration(integration);
      setFormData({
        name: integration.name,
        type: integration.type,
        description: integration.description || '',
        config: integration.config,
      });
    } else {
      setEditingIntegration(null);
      setFormData({
        name: '',
        type: IntegrationType.CUSTOM_IFRAME,
        description: '',
        config: {},
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingIntegration) {
        await api.put(`/integrations/${editingIntegration.id}`, formData);
      } else {
        await api.post('/integrations', {
          ...formData,
          businessId: currentBusiness?.id,
        });
      }
      setDialogOpen(false);
      loadIntegrations();
    } catch (error) {
      console.error('Failed to save integration:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      try {
        await api.delete(`/integrations/${id}`);
        loadIntegrations();
      } catch (error) {
        console.error('Failed to delete integration:', error);
      }
    }
  };

  const openIntegration = (integration: Integration) => {
    const config = integration.config as any;
    
    if (integration.type === IntegrationType.MESHTASTIC_MAP) {
      window.open(`/integrations/meshtastic/${integration.id}`, '_blank');
    } else if (integration.type === IntegrationType.PROXY_PORTAL || integration.type === IntegrationType.CUSTOM_IFRAME) {
      window.open(`/integrations/portal/${integration.id}`, '_blank');
    } else if (config.portalUrl || config.iframeUrl) {
      window.open(config.portalUrl || config.iframeUrl, '_blank');
    }
  };

  const getIntegrationTypeColor = (type: IntegrationType) => {
    const colors: Record<IntegrationType, string> = {
      [IntegrationType.PROXY_PORTAL]: 'primary',
      [IntegrationType.MESHTASTIC_MAP]: 'success',
      [IntegrationType.PROTON_EMAIL]: 'info',
      [IntegrationType.SIP_PHONE]: 'warning',
      [IntegrationType.CUSTOM_IFRAME]: 'secondary',
      [IntegrationType.API_INTEGRATION]: 'error',
      [IntegrationType.NETWORK_DRIVE]: 'default',
    };
    return colors[type] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Integrations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage custom integrations for {currentBusiness?.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Integration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} sm={6} md={4} key={integration.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{integration.name}</Typography>
                  <Chip
                    label={integration.type.replace('_', ' ')}
                    size="small"
                    color={getIntegrationTypeColor(integration.type) as any}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {integration.description || 'No description'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<OpenInNew />}
                  onClick={() => openIntegration(integration)}
                >
                  Open
                </Button>
                <Button
                  size="small"
                  startIcon={<Settings />}
                  onClick={() => handleOpenDialog(integration)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(integration.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIntegration ? 'Edit Integration' : 'Add Integration'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as IntegrationType })}
            margin="normal"
          >
            {Object.values(IntegrationType).map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />

          {/* Configuration fields based on type */}
          {(formData.type === IntegrationType.PROXY_PORTAL || formData.type === IntegrationType.CUSTOM_IFRAME) && (
            <TextField
              fullWidth
              label="Portal URL"
              value={formData.config.portalUrl || formData.config.iframeUrl || ''}
              onChange={(e) => setFormData({
                ...formData,
                config: { ...formData.config, portalUrl: e.target.value, iframeUrl: e.target.value }
              })}
              margin="normal"
            />
          )}

          {formData.type === IntegrationType.MESHTASTIC_MAP && (
            <>
              <TextField
                fullWidth
                label="Meshtastic Server URL"
                value={formData.config.meshtasticServerUrl || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, meshtasticServerUrl: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="API Key"
                value={formData.config.meshtasticApiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, meshtasticApiKey: e.target.value }
                })}
                margin="normal"
                type="password"
              />
            </>
          )}

          {formData.type === IntegrationType.PROXY_PORTAL && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.config.autoLoginEnabled || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, autoLoginEnabled: e.target.checked }
                  })}
                />
              }
              label="Enable Auto-Login"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntegrationsPage;
