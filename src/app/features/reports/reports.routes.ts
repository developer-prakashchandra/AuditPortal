import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'daily',
    loadComponent: () => import('./daily-report/daily-report.component').then(m => m.DailyReportComponent)
  },
  {
    path: 'monthly',
    loadComponent: () => import('./monthly-report/monthly-report.component').then(m => m.MonthlyReportComponent)
  }
];

