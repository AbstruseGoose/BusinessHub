# Integration System Enhancements

## Overview
Comprehensive integration configuration system with support for 16 different integration types, each with specialized configuration fields for their specific requirements.

## Integration Types Supported

### Original Types (7)
1. **PROXY_PORTAL** - Internal proxy portal integration
2. **MESHTASTIC_MAP** - Meshtastic device mapping
3. **PROTON_EMAIL** - ProtonMail email service
4. **SIP_PHONE** - SIP-based phone systems
5. **CUSTOM_IFRAME** - Custom iframe integrations
6. **API_INTEGRATION** - Generic API integrations
7. **NETWORK_DRIVE** - Network drive mounting

### New Types Added (9)
8. **QUICKBOOKS** - QuickBooks accounting integration
9. **SHOPIFY** - Shopify e-commerce platform
10. **STRIPE** - Stripe payment processing
11. **GOOGLE_WORKSPACE** - Google Workspace (Gmail, Drive, Calendar)
12. **MICROSOFT_365** - Microsoft 365 suite
13. **SLACK** - Slack team communication
14. **ZOOM** - Zoom video conferencing
15. **TRELLO** - Trello project management
16. **ASANA** - Asana project management

## Configuration Fields by Type

### Network Drive (NEW FUNCTIONALITY)
The network drive integration now includes comprehensive mounting configuration:

- **Protocol Selection**: SMB, NFS, WebDAV, FTP, SFTP
- **Server Address**: Target server hostname/IP
- **Share Path**: Remote share path (e.g., `/data/shared`)
- **Mount Point**: Local mount point (e.g., `/mnt/network`)
- **Domain**: Windows domain for authentication
- **Port**: Custom port if needed
- **Credentials**: Username and password for authentication

**Special Feature**: Network Drive viewer provides OS-specific mount instructions:
- **Windows**: Map Network Drive instructions with UNC path
- **macOS**: Connect to Server instructions with SMB URL
- **Linux**: Terminal mount commands with full syntax

### Proton Email
- **IMAP Configuration**: Server address, port, TLS settings
- **SMTP Configuration**: Server address, port, TLS settings
- **Bridge Password**: ProtonMail Bridge authentication
- **Auto-login**: Automatic authentication support

### SIP Phone
- **SIP Server**: Server address and port
- **Extension**: User extension number
- **Codec**: Audio codec preference
- **STUN Server**: NAT traversal server

### API Integration
- **API Endpoint**: Base URL for API calls
- **API Key/Secret**: Authentication credentials
- **Custom Headers**: Additional HTTP headers

### QuickBooks
- **Realm ID**: Company identifier
- **Environment**: Sandbox or Production
- **OAuth Credentials**: Client ID and Secret
- **Redirect URI**: OAuth callback URL

### Shopify
- **Store Name**: Shopify store subdomain
- **API Key/Secret**: App credentials
- **Access Token**: Store access token

### Stripe
- **Publishable Key**: Public API key
- **Secret Key**: Private API key
- **Webhook Secret**: Webhook signature verification

### Google Workspace
- **OAuth Credentials**: Client ID and Secret
- **Scopes**: Requested API permissions
- **Redirect URI**: OAuth callback

### Microsoft 365
- **Tenant ID**: Azure AD tenant
- **Client ID/Secret**: App registration credentials
- **Redirect URI**: OAuth callback

### Slack
- **Workspace ID**: Slack workspace identifier
- **Bot Token**: Bot user OAuth token
- **Channel ID**: Default channel

### Zoom
- **SDK Key/Secret**: Zoom SDK credentials
- **OAuth Credentials**: OAuth app credentials
- **Meeting SDK**: SDK integration support

### Trello
- **API Key/Token**: Trello API credentials
- **Board ID**: Target board identifier

### Asana
- **Workspace ID**: Asana workspace identifier
- **Project ID**: Default project
- **Access Token**: Personal access token

## Security Features

### Credential Encryption
All sensitive credentials are encrypted using AES-256-GCM encryption:
- API keys and secrets
- OAuth tokens
- Passwords
- Access tokens

Encrypted fields are stored in the `credentials` object and automatically encrypted/decrypted by the backend.

### Credential Storage Structure
```typescript
{
  username?: string;
  password?: string;
  apiKey?: string;
  apiSecret?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  webhookSecret?: string;
}
```

## UI Components

### Integration Management Page
- **Type-specific Configuration Forms**: Each integration type displays only relevant configuration fields
- **Conditional Field Rendering**: Fields appear/disappear based on selected type
- **Validation**: Required fields enforced before save
- **Credential Masking**: Passwords and secrets displayed as masked input

### Integration Viewer Page
- **Iframe Embedding**: Most integrations display in embedded iframe
- **Network Drive Special Handling**: Shows connection instructions instead of iframe
- **Auto-login Support**: Automatic credential injection for supported services
- **OS Detection**: Provides platform-specific instructions

## API Endpoints

### Integration CRUD Operations
- `GET /api/integrations` - List all integrations
- `GET /api/integrations/:id` - Get specific integration
- `POST /api/integrations` - Create new integration
- `PUT /api/integrations/:id` - Update integration
- `DELETE /api/integrations/:id` - Delete integration

### Configuration Schema
All integrations follow this schema:
```typescript
{
  id: string;
  businessId: string;
  name: string;
  type: IntegrationType;
  description?: string;
  config: IntegrationConfig;  // Type-specific configuration
  credentials?: IntegrationCredentials;  // Encrypted
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Schema

### Enum Type
PostgreSQL enum `enum_integrations_type` contains all 16 integration types.

### Integrations Table
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type enum_integrations_type NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## Usage Examples

### Creating a Network Drive Integration
```typescript
{
  name: "Company File Share",
  type: "NETWORK_DRIVE",
  config: {
    protocol: "SMB",
    serverAddress: "fileserver.company.com",
    sharePath: "/shared/documents",
    mountPoint: "/mnt/company",
    domain: "COMPANY",
    port: 445
  },
  credentials: {
    username: "user@company.com",
    password: "encrypted_password"
  }
}
```

### Creating a QuickBooks Integration
```typescript
{
  name: "QuickBooks Online",
  type: "QUICKBOOKS",
  config: {
    realmId: "123456789",
    environment: "production",
    redirectUri: "https://app.company.com/oauth/callback"
  },
  credentials: {
    clientId: "your_client_id",
    clientSecret: "your_client_secret"
  }
}
```

### Creating a Slack Integration
```typescript
{
  name: "Team Slack",
  type: "SLACK",
  config: {
    slackWorkspaceId: "T1234567890",
    channelId: "C1234567890"
  },
  credentials: {
    token: "xoxb-your-bot-token"
  }
}
```

## Testing Checklist

- [x] Backend server starts successfully
- [x] Database enum contains all 16 types
- [x] Integrations table created with correct schema
- [x] TypeScript compilation succeeds
- [x] Frontend displays without errors
- [ ] Create integration of each type via UI
- [ ] Verify type-specific fields appear correctly
- [ ] Test credential encryption/decryption
- [ ] Test Network Drive viewer instructions
- [ ] Test iframe embedding for other types
- [ ] Verify auto-login functionality (where supported)

## Future Enhancements

1. **Dashboard Widgets**: Display integration data in dashboard widgets
2. **OAuth Flow**: Implement proper OAuth flows for services that support it
3. **Webhook Handling**: Process incoming webhooks from integrated services
4. **Sync Status**: Track last sync time and status for each integration
5. **Error Logging**: Detailed error tracking for integration failures
6. **Rate Limiting**: Implement rate limiting for API integrations
7. **Health Checks**: Periodic health checks for all active integrations
8. **Multi-tenancy**: Proper isolation of integrations by business/tenant

## Technical Notes

### Sequelize Sync vs Migrations
The database schema is currently managed using Sequelize's `sync()` method. For production deployments, proper migrations should be used instead. The enum type migration required dropping and recreating the `integrations` table to resolve schema conflicts.

### TypeScript Type Safety
All integration configurations are strongly typed in TypeScript, providing IDE autocomplete and compile-time validation. The `IntegrationConfig` interface uses optional fields for all type-specific configurations, allowing type safety while maintaining flexibility.

### Cross-Origin Considerations
Auto-login functionality may be limited by CORS policies and iframe embedding restrictions. Some services (like Google Workspace) may block iframe embedding entirely, requiring popup-based authentication flows.

## Deployment Instructions

1. **Database Migration**: Run SQL to update enum type or use Sequelize sync
2. **Environment Variables**: Ensure `ENCRYPTION_KEY` is set for credential encryption
3. **Frontend Build**: Rebuild shared package and client: `npm run build -w shared && npm run build -w client`
4. **Backend Restart**: Restart backend server to load new schema
5. **Verification**: Check that all 16 types are available in UI dropdown

## Support

For issues or questions about integration configuration, refer to:
- Type definitions: `/workspaces/BusinessHub/shared/src/types/integrations.ts`
- UI forms: `/workspaces/BusinessHub/client/src/pages/IntegrationsPage.tsx`
- Viewer: `/workspaces/BusinessHub/client/src/pages/IntegrationViewerPage.tsx`
- API routes: `/workspaces/BusinessHub/server/src/routes/integrations.ts`
- Database model: `/workspaces/BusinessHub/server/src/models/Integration.ts`
