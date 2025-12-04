import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor for local asset files
  if (req.url.startsWith('assets/')) {
    return next(req);
  }

  const configService = inject(ConfigService);

  try {
    const apiBaseUrl = configService.getApiBaseUrl();
    
    // Clone request and add base URL if not already absolute
    if (!req.url.startsWith('http')) {
      const apiReq = req.clone({
        url: `${apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`,
        setHeaders: {
          'X-Tenant-Code': configService.getTenantCode()
        }
      });
      return next(apiReq);
    }
  } catch (error) {
    console.warn('Config not loaded, skipping API interceptor');
  }

  return next(req);
};

