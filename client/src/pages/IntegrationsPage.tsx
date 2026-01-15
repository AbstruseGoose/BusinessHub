import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { businessId } = useParams<{ businessId?: string }>();
  const navigate = useNavigate();
  const { businesses, selectedBusinessId } = useBusinessStore();
  const effectiveBusinessId = businessId || selectedBusinessId;
  const currentBusiness = businesses.find(b => b.id === effectiveBusinessId);
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
    // Use iframe viewer for all integrations - never redirect away
    navigate(`/business/${effectiveBusinessId}/integrations/view/${integration.id}`);
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
      [IntegrationType.QUICKBOOKS]: 'success',
      [IntegrationType.SHOPIFY]: 'primary',
      [IntegrationType.STRIPE]: 'secondary',
      [IntegrationType.GOOGLE_WORKSPACE]: 'info',
      [IntegrationType.MICROSOFT_365]: 'primary',
      [IntegrationType.SLACK]: 'secondary',
      [IntegrationType.ZOOM]: 'primary',
      [IntegrationType.TRELLO]: 'info',
      [IntegrationType.ASANA]: 'error',
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

          {/* URL Configuration */}
          {(
            formData.type === IntegrationType.PROXY_PORTAL ||
            formData.type === IntegrationType.CUSTOM_IFRAME ||
            formData.type === IntegrationType.QUICKBOOKS ||
            formData.type === IntegrationType.SHOPIFY ||
            formData.type === IntegrationType.STRIPE ||
            formData.type === IntegrationType.GOOGLE_WORKSPACE ||
            formData.type === IntegrationType.MICROSOFT_365 ||
            formData.type === IntegrationType.SLACK ||
            formData.type === IntegrationType.ZOOM ||
            formData.type === IntegrationType.TRELLO ||
            formData.type === IntegrationType.ASANA
          ) && (
            <TextField
              fullWidth
              label="URL"
              value={formData.config.url || formData.config.portalUrl || formData.config.iframeUrl || ''}
              onChange={(e) => setFormData({
                ...formData,
                config: { ...formData.config, url: e.target.value }
              })}
              margin="normal"
              placeholder="https://example.com"
            />
          )}

          {/* Meshtastic specific */}
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

          {/* Network Drive specific */}
          {formData.type === IntegrationType.NETWORK_DRIVE && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Network Drive Configuration
              </Typography>
              <TextField
                fullWidth
                select
                label="Protocol"
                value={formData.config.protocol || 'SMB'}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, protocol: e.target.value as any }
                })}
                margin="normal"
              >
                <MenuItem value="SMB">SMB/CIFS (Windows Share)</MenuItem>
                <MenuItem value="NFS">NFS (Unix/Linux)</MenuItem>
                <MenuItem value="WebDAV">WebDAV</MenuItem>
                <MenuItem value="FTP">FTP</MenuItem>
                <MenuItem value="SFTP">SFTP</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Server Address"
                value={formData.config.serverAddress || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, serverAddress: e.target.value }
                })}
                margin="normal"
                placeholder="e.g., 192.168.1.100 or server.example.com"
              />
              <TextField
                fullWidth
                label="Share Path"
                value={formData.config.sharePath || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, sharePath: e.target.value }
                })}
                margin="normal"
                placeholder="e.g., /shared or \\shared"
              />
              <TextField
                fullWidth
                label="Mount Point / Local Path"
                value={formData.config.mountPoint || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, mountPoint: e.target.value }
                })}
                margin="normal"
                placeholder="e.g., /mnt/network or Z:"
              />
              <TextField
                fullWidth
                label="Port (optional)"
                type="number"
                value={formData.config.port || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, port: parseInt(e.target.value) || undefined }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Domain (optional)"
                value={formData.config.domain || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, domain: e.target.value }
                })}
                margin="normal"
                placeholder="For Windows domains"
              />
              <TextField
                fullWidth
                label="Username"
                value={formData.config.credentials?.username || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, username: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.config.credentials?.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, password: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Proton Email specific */}
          {formData.type === IntegrationType.PROTON_EMAIL && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Proton Mail Configuration
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                value={formData.config.credentials?.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, email: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password / Bridge Password"
                type="password"
                value={formData.config.credentials?.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, password: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="IMAP Server"
                value={formData.config.imapServer || '127.0.0.1'}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, imapServer: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="IMAP Port"
                type="number"
                value={formData.config.imapPort || 1143}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, imapPort: parseInt(e.target.value) }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SMTP Server"
                value={formData.config.smtpServer || '127.0.0.1'}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, smtpServer: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SMTP Port"
                type="number"
                value={formData.config.smtpPort || 1025}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, smtpPort: parseInt(e.target.value) }
                })}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.config.useTLS !== false}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, useTLS: e.target.checked }
                    })}
                  />
                }
                label="Use TLS/SSL"
              />
            </Box>
          )}

          {/* SIP Phone specific */}
          {formData.type === IntegrationType.SIP_PHONE && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                SIP Phone Configuration
              </Typography>
              <TextField
                fullWidth
                label="SIP Server"
                value={formData.config.sipServer || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, sipServer: e.target.value }
                })}
                margin="normal"
                placeholder="sip.example.com"
              />
              <TextField
                fullWidth
                label="SIP Port"
                type="number"
                value={formData.config.sipPort || 5060}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, sipPort: parseInt(e.target.value) }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Extension / Username"
                value={formData.config.extension || formData.config.credentials?.username || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    extension: e.target.value,
                    credentials: { ...formData.config.credentials, username: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.config.credentials?.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, password: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Codec (optional)"
                value={formData.config.codec || 'PCMU'}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, codec: e.target.value }
                })}
                margin="normal"
                placeholder="PCMU, PCMA, G722, etc."
              />
              <TextField
                fullWidth
                label="STUN Server (optional)"
                value={formData.config.stunServer || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, stunServer: e.target.value }
                })}
                margin="normal"
                placeholder="stun:stun.l.google.com:19302"
              />
            </Box>
          )}

          {/* API Integration specific */}
          {formData.type === IntegrationType.API_INTEGRATION && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                API Configuration
              </Typography>
              <TextField
                fullWidth
                label="API Endpoint"
                value={formData.config.apiEndpoint || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, apiEndpoint: e.target.value }
                })}
                margin="normal"
                placeholder="https://api.example.com"
              />
              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={formData.config.credentials?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiKey: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="API Secret (optional)"
                type="password"
                value={formData.config.credentials?.apiSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* QuickBooks specific */}
          {formData.type === IntegrationType.QUICKBOOKS && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                QuickBooks Configuration
              </Typography>
              <TextField
                fullWidth
                select
                label="Environment"
                value={formData.config.environment || 'production'}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, environment: e.target.value as any }
                })}
                margin="normal"
              >
                <MenuItem value="sandbox">Sandbox</MenuItem>
                <MenuItem value="production">Production</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Realm ID / Company ID"
                value={formData.config.realmId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, realmId: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Client ID"
                value={formData.config.credentials?.clientId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientId: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Client Secret"
                type="password"
                value={formData.config.credentials?.clientSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Shopify specific */}
          {formData.type === IntegrationType.SHOPIFY && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Shopify Configuration
              </Typography>
              <TextField
                fullWidth
                label="Store Name"
                value={formData.config.storeName || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, storeName: e.target.value }
                })}
                margin="normal"
                placeholder="your-store"
                helperText="Will be used as: your-store.myshopify.com"
              />
              <TextField
                fullWidth
                label="API Key"
                value={formData.config.credentials?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiKey: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="API Secret"
                type="password"
                value={formData.config.credentials?.apiSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Access Token"
                type="password"
                value={formData.config.credentials?.accessToken || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, accessToken: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Stripe specific */}
          {formData.type === IntegrationType.STRIPE && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Stripe Configuration
              </Typography>
              <TextField
                fullWidth
                label="Publishable Key"
                value={formData.config.publishableKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, publishableKey: e.target.value }
                })}
                margin="normal"
                placeholder="pk_live_..."
              />
              <TextField
                fullWidth
                label="Secret Key"
                type="password"
                value={formData.config.credentials?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiKey: e.target.value }
                  }
                })}
                margin="normal"
                placeholder="sk_live_..."
              />
              <TextField
                fullWidth
                label="Webhook Secret (optional)"
                type="password"
                value={formData.config.credentials?.webhookSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, webhookSecret: e.target.value }
                  }
                })}
                margin="normal"
                placeholder="whsec_..."
              />
            </Box>
          )}

          {/* Google Workspace specific */}
          {formData.type === IntegrationType.GOOGLE_WORKSPACE && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Google Workspace Configuration
              </Typography>
              <TextField
                fullWidth
                label="Client ID"
                value={formData.config.credentials?.clientId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientId: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Client Secret"
                type="password"
                value={formData.config.credentials?.clientSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Microsoft 365 specific */}
          {formData.type === IntegrationType.MICROSOFT_365 && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Microsoft 365 Configuration
              </Typography>
              <TextField
                fullWidth
                label="Tenant ID"
                value={formData.config.credentials?.tenantId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, tenantId: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Client ID"
                value={formData.config.credentials?.clientId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientId: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Client Secret"
                type="password"
                value={formData.config.credentials?.clientSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, clientSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Redirect URI"
                value={formData.config.redirectUri || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, redirectUri: e.target.value }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Slack specific */}
          {formData.type === IntegrationType.SLACK && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Slack Configuration
              </Typography>
              <TextField
                fullWidth
                label="Workspace ID"
                value={formData.config.slackWorkspaceId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, slackWorkspaceId: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bot Token"
                type="password"
                value={formData.config.botToken || formData.config.credentials?.token || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    botToken: e.target.value,
                    credentials: { ...formData.config.credentials, token: e.target.value }
                  }
                })}
                margin="normal"
                placeholder="xoxb-..."
              />
              <TextField
                fullWidth
                label="Default Channel ID (optional)"
                value={formData.config.channelId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, channelId: e.target.value }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Zoom specific */}
          {formData.type === IntegrationType.ZOOM && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Zoom Configuration
              </Typography>
              <TextField
                fullWidth
                label="SDK Key / API Key"
                value={formData.config.sdkKey || formData.config.credentials?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    sdkKey: e.target.value,
                    credentials: { ...formData.config.credentials, apiKey: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SDK Secret / API Secret"
                type="password"
                value={formData.config.sdkSecret || formData.config.credentials?.apiSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    sdkSecret: e.target.value,
                    credentials: { ...formData.config.credentials, apiSecret: e.target.value }
                  }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Trello specific */}
          {formData.type === IntegrationType.TRELLO && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Trello Configuration
              </Typography>
              <TextField
                fullWidth
                label="API Key"
                value={formData.config.credentials?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, apiKey: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Token"
                type="password"
                value={formData.config.credentials?.token || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, token: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Board ID (optional)"
                value={formData.config.boardId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, boardId: e.target.value }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Asana specific */}
          {formData.type === IntegrationType.ASANA && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Asana Configuration
              </Typography>
              <TextField
                fullWidth
                label="Personal Access Token"
                type="password"
                value={formData.config.credentials?.accessToken || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, accessToken: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Workspace ID (optional)"
                value={formData.config.asanaWorkspaceId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, asanaWorkspaceId: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Project ID (optional)"
                value={formData.config.projectId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, projectId: e.target.value }
                })}
                margin="normal"
              />
            </Box>
          )}

          {/* Auto-login toggle */}
          {(
            formData.type === IntegrationType.PROXY_PORTAL ||
            formData.type === IntegrationType.CUSTOM_IFRAME
          ) && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.config.autoLogin || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, autoLogin: e.target.checked }
                  })}
                />
              }
              label="Enable Auto-Login"
            />
          )}

          {/* Credentials Section for Proxy Portal */}
          {formData.config.autoLogin && formData.type === IntegrationType.PROXY_PORTAL && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Login Credentials
              </Typography>
              <TextField
                fullWidth
                label="Username or Email"
                value={formData.config.credentials?.username || formData.config.credentials?.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, username: e.target.value, email: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.config.credentials?.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    credentials: { ...formData.config.credentials, password: e.target.value }
                  }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Login URL (optional)"
                value={formData.config.loginUrl || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, loginUrl: e.target.value }
                })}
                margin="normal"
                placeholder="If different from main URL"
              />
              <TextField
                fullWidth
                label="Username Field Selector (optional)"
                value={formData.config.usernameField || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, usernameField: e.target.value }
                })}
                margin="normal"
                placeholder="e.g., input[name='username']"
              />
              <TextField
                fullWidth
                label="Password Field Selector (optional)"
                value={formData.config.passwordField || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, passwordField: e.target.value }
                })}
                margin="normal"
                placeholder="e.g., input[name='password']"
              />
            </Box>
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
