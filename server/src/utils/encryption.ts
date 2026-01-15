import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// Get encryption key from environment or generate one
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  return Buffer.from(key, 'hex');
};

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const key = crypto.pbkdf2Sync(getEncryptionKey(), salt, 100000, KEY_LENGTH, 'sha512');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return [
    salt.toString('hex'),
    iv.toString('hex'),
    tag.toString('hex'),
    encrypted
  ].join(':');
};

export const decrypt = (encryptedText: string): string => {
  const parts = encryptedText.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted text format');
  }
  
  const [saltHex, ivHex, tagHex, encrypted] = parts;
  
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  
  const key = crypto.pbkdf2Sync(getEncryptionKey(), salt, 100000, KEY_LENGTH, 'sha512');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Encrypt sensitive fields in integration config
export const encryptIntegrationCredentials = (config: any): any => {
  if (!config.credentials) return config;
  
  const encryptedConfig = { ...config };
  const credentials = { ...config.credentials };
  
  if (credentials.password) {
    credentials.password = encrypt(credentials.password);
  }
  if (credentials.apiSecret) {
    credentials.apiSecret = encrypt(credentials.apiSecret);
  }
  if (credentials.accessToken) {
    credentials.accessToken = encrypt(credentials.accessToken);
  }
  if (credentials.refreshToken) {
    credentials.refreshToken = encrypt(credentials.refreshToken);
  }
  
  encryptedConfig.credentials = credentials;
  return encryptedConfig;
};

// Decrypt sensitive fields in integration config
export const decryptIntegrationCredentials = (config: any): any => {
  if (!config.credentials) return config;
  
  const decryptedConfig = { ...config };
  const credentials = { ...config.credentials };
  
  try {
    if (credentials.password) {
      credentials.password = decrypt(credentials.password);
    }
    if (credentials.apiSecret) {
      credentials.apiSecret = decrypt(credentials.apiSecret);
    }
    if (credentials.accessToken) {
      credentials.accessToken = decrypt(credentials.accessToken);
    }
    if (credentials.refreshToken) {
      credentials.refreshToken = decrypt(credentials.refreshToken);
    }
  } catch (error) {
    console.error('Decryption failed:', error);
  }
  
  decryptedConfig.credentials = credentials;
  return decryptedConfig;
};
