import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tenantCode = '';
  stats = [
    { title: 'Total Audits', value: 24, icon: 'pi-file', color: '#4169E1' },
    { title: 'Pending Reviews', value: 8, icon: 'pi-clock', color: '#FF9800' },
    { title: 'Completed', value: 16, icon: 'pi-check-circle', color: '#4CAF50' },
    { title: 'Locations', value: 2, icon: 'pi-map-marker', color: '#9C27B0' }
  ];

  recentActivities = [
    { title: 'GT21 Audit completed', time: '2 hours ago', icon: 'pi-check-circle', color: '#4CAF50' },
    { title: 'ST22 Review pending', time: '5 hours ago', icon: 'pi-clock', color: '#FF9800' },
    { title: 'HRSG21 Started', time: '1 day ago', icon: 'pi-play', color: '#2196F3' },
    { title: 'Monthly Report Generated', time: '2 days ago', icon: 'pi-file-pdf', color: '#F44336' }
  ];

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.tenantCode = this.configService.getTenantCode();
  }
}

