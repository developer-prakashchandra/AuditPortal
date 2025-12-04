import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, DropdownModule, FormsModule],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent {
  selectedMonth: any = { name: 'November 2024', value: 11 };
  
  months = [
    { name: 'November 2024', value: 11 },
    { name: 'October 2024', value: 10 },
    { name: 'September 2024', value: 9 }
  ];

  chartData: any;
  chartOptions: any;

  monthlySummary = [
    { label: 'Total Audits', value: 42, icon: 'pi-file', color: '#4169E1' },
    { label: 'Completed', value: 35, icon: 'pi-check-circle', color: '#4CAF50' },
    { label: 'Pending', value: 7, icon: 'pi-clock', color: '#FF9800' },
    { label: 'Compliance Rate', value: '95%', icon: 'pi-chart-line', color: '#9C27B0' }
  ];

  constructor(private router: Router) {
    this.initChartData();
  }

  initChartData(): void {
    this.chartData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Completed Audits',
          data: [8, 12, 10, 5],
          backgroundColor: 'rgba(65, 105, 225, 0.2)',
          borderColor: 'rgba(65, 105, 225, 1)',
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  exportReport(): void {
    console.log('Exporting monthly report...');
  }
}

