import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, CalendarModule, FormsModule],
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent {
  selectedDate: Date = new Date();
  
  dailyActivities = [
    { time: '09:00 AM', activity: 'GT21 Audit Started', user: 'John Doe', status: 'In Progress' },
    { time: '10:30 AM', activity: 'ST22 Review Completed', user: 'Jane Smith', status: 'Completed' },
    { time: '02:15 PM', activity: 'HRSG21 Form Submitted', user: 'Mike Johnson', status: 'Submitted' },
    { time: '04:45 PM', activity: 'B Block Inspection', user: 'Sarah Williams', status: 'In Progress' }
  ];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  exportReport(): void {
    console.log('Exporting daily report...');
  }
}

