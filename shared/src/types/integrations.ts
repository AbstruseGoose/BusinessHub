// Integration Types
export enum IntegrationType {
  PROXY_PORTAL = 'PROXY_PORTAL',
  MESHTASTIC_MAP = 'MESHTASTIC_MAP',
  PROTON_EMAIL = 'PROTON_EMAIL',
  SIP_PHONE = 'SIP_PHONE',
  CUSTOM_IFRAME = 'CUSTOM_IFRAME',
  API_INTEGRATION = 'API_INTEGRATION',
  NETWORK_DRIVE = 'NETWORK_DRIVE',
  QUICKBOOKS = 'QUICKBOOKS',
  SHOPIFY = 'SHOPIFY',
  STRIPE = 'STRIPE',
  GOOGLE_WORKSPACE = 'GOOGLE_WORKSPACE',
  MICROSOFT_365 = 'MICROSOFT_365',
  SLACK = 'SLACK',
  ZOOM = 'ZOOM',
  TRELLO = 'TRELLO',
  ASANA = 'ASANA'
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

export interface IntegrationCredentials {
  username?: string;
  password?: string;
  email?: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  token?: string;
  webhookSecret?: string;
}

export interface IntegrationConfig {
  // General iframe settings
  url?: string;
  iframeHeight?: string;
  allowFullscreen?: boolean;
  openInFrame?: boolean; // Always true for internal browser

  // Credentials
  credentials?: IntegrationCredentials;
  autoLogin?: boolean;
  loginUrl?: string;
  usernameField?: string;
  passwordField?: string;
  submitButtonSelector?: string;

  // Proxy Portal Config
  portalUrl?: string;
  autoLoginEnabled?: boolean;

  // Meshtastic Config
  meshtasticServerUrl?: string;
  meshtasticApiKey?: string;
  mapCenterLat?: number;
  mapCenterLon?: number;
  mapZoom?: number;

  // Custom Iframe Config
  iframeUrl?: string;
  sandbox?: string[];

  // API Integration Config
  apiEndpoint?: string;
  
  // Network Drive Config
  serverAddress?: string;
  sharePath?: string;
  mountPoint?: string;
  protocol?: 'SMB' | 'NFS' | 'WebDAV' | 'FTP' | 'SFTP';
  domain?: string;
  port?: number;
  
  // Proton Email Config
  imapServer?: string;
  imapPort?: number;
  smtpServer?: string;
  smtpPort?: number;
  useTLS?: boolean;
  
  // SIP Phone Config
  sipServer?: string;
  sipPort?: number;
  extension?: string;
  codec?: string;
  stunServer?: string;
  
  // QuickBooks Config
  realmId?: string;
  environment?: 'sandbox' | 'production';
  
  // Shopify Config
  storeName?: string;
  
  // Stripe Config
  publishableKey?: string;
  
  // Google Workspace Config
  scopes?: string[];
  
  // Microsoft 365 Config
  redirectUri?: string;
  
  // Slack Config
  slackWorkspaceId?: string;
  channelId?: string;
  botToken?: string;
  
  // Zoom Config
  sdkKey?: string;
  sdkSecret?: string;
  meetingNumber?: string;
  
  // Trello Config
  boardId?: string;
  listIds?: string[];
  
  // Asana Config
  asanaWorkspaceId?: string;
  projectId?: string;
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
