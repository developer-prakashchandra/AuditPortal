import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../models/config.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;
  private configLoaded = false;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<AppConfig>('assets/config/config.json')
      );

      if (!this.config || !this.config.tenantCode) {
        throw new Error('Configuration error: tenantCode is missing');
      }

      this.configLoaded = true;
      console.log('Configuration loaded successfully:', this.config);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.showConfigError();
      throw error;
    }
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config;
  }

  get<T = any>(key: string): T {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config[key] as T;
  }

  getTenantCode(): string {
    return this.get<string>('tenantCode');
  }

  getApiBaseUrl(): string {
    return this.get<string>('apiBaseUrl');
  }

  isConfigLoaded(): boolean {
    return this.configLoaded;
  }

  private showConfigError(): void {
    document.body.innerHTML = `
      <div class="error-container">
        <h2>Configuration Error</h2>
        <p>Failed to load application configuration.</p>
        <p>Please ensure that <strong>assets/config/config.json</strong> exists and contains a valid <strong>tenantCode</strong>.</p>
      </div>
    `;
  }
}

