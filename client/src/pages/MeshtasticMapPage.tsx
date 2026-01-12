import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Integration, MeshtasticNode } from '@businesshub/shared';
import { api } from '@/lib/api';

const MeshtasticMapPage: React.FC = () => {
  const { integrationId } = useParams<{ integrationId: string }>();
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [nodes, setNodes] = useState<MeshtasticNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegration();
    // Poll for node updates every 10 seconds
    const interval = setInterval(loadNodes, 10000);
    return () => clearInterval(interval);
  }, [integrationId]);

  const loadIntegration = async () => {
    try {
      const response = await api.get(`/integrations/${integrationId}`);
      setIntegration(response.data);
      await loadNodes();
    } catch (error) {
      console.error('Failed to load integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNodes = async () => {
    // TODO: Connect to actual Meshtastic server
    // For now, return mock data
    setNodes([
      {
        id: 'node1',
        name: 'Base Station',
        latitude: 36.7783,
        longitude: -81.6835,
        altitude: 945,
        batteryLevel: 95,
        snr: 8.5,
        lastHeard: new Date(),
        role: 'ROUTER'
      },
      {
        id: 'node2',
        name: 'Mobile Unit 1',
        latitude: 36.7850,
        longitude: -81.6900,
        altitude: 920,
        batteryLevel: 78,
        snr: 6.2,
        lastHeard: new Date(),
        role: 'CLIENT'
      }
    ]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const config = integration?.config as any;
  const center = {
    lat: config?.mapCenterLat || 36.7783,
    lng: config?.mapCenterLon || -81.6835,
  };
  const zoom = config?.mapZoom || 13;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5">{integration?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {nodes.length} nodes active
        </Typography>
      </Paper>

      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {nodes.map((node) => (
            <Marker key={node.id} position={[node.latitude, node.longitude]}>
              <Popup>
                <Box>
                  <Typography variant="subtitle2">{node.name}</Typography>
                  <Typography variant="caption">Role: {node.role}</Typography>
                  <br />
                  <Typography variant="caption">Battery: {node.batteryLevel}%</Typography>
                  <br />
                  <Typography variant="caption">SNR: {node.snr} dB</Typography>
                  <br />
                  <Typography variant="caption">Alt: {node.altitude}m</Typography>
                </Box>
              </Popup>
            </Marker>
          ))}

          {/* Draw lines between nodes to show mesh network */}
          {nodes.length > 1 && (
            <Polyline
              positions={nodes.map(n => [n.latitude, n.longitude])}
              color="#61AFEF"
              opacity={0.5}
            />
          )}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MeshtasticMapPage;
