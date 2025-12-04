import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface ReportType {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  reports: ReportType[] = [
    {
      title: 'Daily Report',
      description: 'View daily audit activities and summaries',
      icon: 'pi-calendar',
      route: '/reports/daily',
      color: '#2196F3'
    },
    {
      title: 'Monthly Report',
      description: 'View monthly audit statistics and trends',
      icon: 'pi-chart-bar',
      route: '/reports/monthly',
      color: '#4CAF50'
    }
  ];

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }
}

