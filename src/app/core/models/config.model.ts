export interface AppConfig {
  tenantCode: string;
  apiBaseUrl: string;
  environment: string;
  appName: string;
  version: string;
  [key: string]: any;
}

