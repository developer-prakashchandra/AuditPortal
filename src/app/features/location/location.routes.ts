import { Routes } from '@angular/router';

export const LOCATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./location-list/location-list.component').then(m => m.LocationListComponent)
  },
  {
    path: ':block',
    loadComponent: () => import('./audit-list/audit-list.component').then(m => m.AuditListComponent)
  }, 
  {
    path: ':block/:group/form/:auditId',
    // keep backward-compatibility: redirect old pattern to new pattern
    redirectTo: ':block/:auditId'
  },
  {
    path: ':block/:auditId',
    loadComponent: () => import('../audit-forms/audit-form-host.component').then(m => m.AuditFormHostComponent)
  }
];
