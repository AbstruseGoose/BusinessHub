import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Close, Refresh, OpenInNew } from '@mui/icons-material';
import { Integration, IntegrationType } from '@businesshub/shared';
import { api } from '@/lib/api';
import { theme } from '@/theme/colors';

const IntegrationViewerPage: React.FC = () => {
  const { integrationId, businessId } = useParams<{ integrationId: string; businessId: string }>();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIntegration();
  }, [integrationId]);

  const loadIntegration = async () => {
    try {
      const response = await api.get(`/integrations/${integrationId}`);
      setIntegration(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load integration:', error);
      setError('Failed to load integration');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    const url = getIntegrationUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getIntegrationUrl = (): string => {
    if (!integration) return '';
    
    const config = integration.config as any;
    
    // Handle special cases
    if (integration.type === IntegrationType.MESHTASTIC_MAP) {
      // Redirect to dedicated Meshtastic map page
      return '';
    }
    
    return config.url || config.portalUrl || config.iframeUrl || config.meshtasticServerUrl || '';
  };

  const handleAutoLogin = () => {
    const config = integration?.config as any;
    if (!config.autoLogin || !config.credentials || !iframeRef.current) return;

    // Inject auto-login script
    try {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) return;

          // Create and inject auto-login script
          const script = iframeDoc.createElement('script');
          script.textContent = `
            (function() {
              try {
                const usernameField = document.querySelector('${config.usernameField || 'input[name="username"], input[type="email"]'}');
                const passwordField = document.querySelector('${config.passwordField || 'input[name="password"], input[type="password"]'}');
                const submitButton = document.querySelector('${config.submitButtonSelector || 'button[type="submit"], input[type="submit"]'}');
                
                if (usernameField) usernameField.value = '${config.credentials.username || config.credentials.email || ''}';
                if (passwordField) passwordField.value = '${config.credentials.password || ''}';
                
                if (submitButton) {
                  setTimeout(() => submitButton.click(), 500);
                }
              } catch (e) {
                console.error('Auto-login failed:', e);
              }
            })();
          `;
          iframeDoc.body.appendChild(script);
        } catch (e) {
          console.error('Cross-origin frame access denied:', e);
        }
      };
    } catch (e) {
      console.error('Auto-login setup failed:', e);
    }
  };

  useEffect(() => {
    const config = integration?.config as any;
    if (config?.autoLogin) {
      handleAutoLogin();
    }
  }, [integration]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !integration) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Integration not found'}</Alert>
      </Box>
    );
  }

  // Special handling for Meshtastic - redirect to dedicated map page
  if (integration.type === IntegrationType.MESHTASTIC_MAP) {
    const mapRoute = businessId 
      ? `/business/${businessId}/integrations/meshtastic/${integration.id}`
      : `/integrations/meshtastic/${integration.id}`;
    navigate(mapRoute, { replace: true });
    return null;
  }

  // Special handling for Network Drive - show connection info
  if (integration.type === IntegrationType.NETWORK_DRIVE) {
    const config = integration.config as any;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: theme.colors.background.secondary }}>
          <Toolbar variant="dense">
            <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <Close />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {integration.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: 3, backgroundColor: theme.colors.background.primary }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Network drive configuration. Use the connection details below to mount this drive on your system.
          </Alert>
          <Box sx={{ backgroundColor: theme.colors.background.secondary, p: 3, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Connection Details</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Protocol:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{config.protocol || 'SMB'}</Typography>
              
              <Typography variant="body2" color="text.secondary">Server Address:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{config.serverAddress || 'Not configured'}</Typography>
              
              <Typography variant="body2" color="text.secondary">Share Path:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{config.sharePath || 'Not configured'}</Typography>
              
              <Typography variant="body2" color="text.secondary">Mount Point:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{config.mountPoint || 'Not configured'}</Typography>
              
              {config.port && (
                <>
                  <Typography variant="body2" color="text.secondary">Port:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{config.port}</Typography>
                </>
              )}
              
              {config.domain && (
                <>
                  <Typography variant="body2" color="text.secondary">Domain:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{config.domain}</Typography>
                </>
              )}
              
              <Typography variant="body2" color="text.secondary">Username:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{config.credentials?.username || 'Not configured'}</Typography>
            </Box>
            
            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Windows:</strong> Use "Map Network Drive" in File Explorer with:<br />
                <code>\\{config.serverAddress}\{config.sharePath?.replace(/^\//, '')}</code>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>macOS:</strong> Use "Connect to Server" in Finder with:<br />
                <code>{config.protocol?.toLowerCase()}://{config.serverAddress}{config.sharePath}</code>
              </Typography>
              <Typography variant="body2">
                <strong>Linux:</strong> Mount using:<br />
                <code>sudo mount -t {config.protocol?.toLowerCase()} //{config.serverAddress}{config.sharePath} {config.mountPoint}</code>
              </Typography>
            </Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  const integrationUrl = getIntegrationUrl();
  const iframeHeight = (integration.config as any).iframeHeight || '100%';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Integration Toolbar */}
      <AppBar position="static" sx={{ backgroundColor: theme.colors.background.secondary }}>
        <Toolbar variant="dense">
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {integration.name}
          </Typography>
          <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
            <Refresh />
          </IconButton>
          <IconButton onClick={handleOpenExternal}>
            <OpenInNew />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Integration Iframe */}
      <Box sx={{ flex: 1, position: 'relative', backgroundColor: theme.colors.background.primary }}>
        {integrationUrl ? (
          <iframe
            ref={iframeRef}
            src={integrationUrl}
            title={integration.name}
            style={{
              width: '100%',
              height: iframeHeight === '100%' ? '100%' : iframeHeight,
              border: 'none',
            }}
            allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        ) : (
          <Box sx={{ p: 3 }}>
            <Alert severity="warning">No URL configured for this integration</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default IntegrationViewerPage;
