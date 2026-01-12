// Integration Types
export enum IntegrationType {
  PROXY_PORTAL = 'PROXY_PORTAL',
  MESHTASTIC_MAP = 'MESHTASTIC_MAP',
  PROTON_EMAIL = 'PROTON_EMAIL',
  SIP_PHONE = 'SIP_PHONE',
  CUSTOM_IFRAME = 'CUSTOM_IFRAME',
  API_INTEGRATION = 'API_INTEGRATION',
  NETWORK_DRIVE = 'NETWORK_DRIVE'
}

export interface Integration {
  id: string;
  businessId: string;
  name: string;
  type: IntegrationType;
  description?: string;
  config: IntegrationConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfig {
  // Proxy Portal Config
  portalUrl?: string;
  autoLoginEnabled?: boolean;
  loginUrl?: string;
  usernameField?: string;
  passwordField?: string;
  credentials?: {
    username: string;
    passwordEncrypted: string;
  };

  // Meshtastic Config
  meshtasticServerUrl?: string;
  meshtasticApiKey?: string;
  mapCenterLat?: number;
  mapCenterLon?: number;
  mapZoom?: number;

  // Custom Iframe Config
  iframeUrl?: string;
  iframeHeight?: string;
  allowFullscreen?: boolean;
  sandbox?: string[];

  // API Integration Config
  apiEndpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  authType?: 'bearer' | 'basic' | 'oauth2' | 'custom';

  // Network Drive Config
  drivePath?: string;
  driveProtocol?: 'smb' | 'nfs' | 'webdav';
  driveCredentials?: {
    username: string;
    domain?: string;
  };
}

export interface MeshtasticNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  batteryLevel?: number;
  snr?: number;
  lastHeard?: Date;
  role?: string;
}

export interface MeshtasticMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  channel?: string;
}
