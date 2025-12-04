import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface Area {
  name: string;
  code: string;
  description?: string;
  lastAudit?: string;
}

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent {
  areas: Area[] = [
    {
      name: 'CCPP22',
      code: 'CCPP22',
      description: 'Combined Cycle Power Plant Area',
      lastAudit: '2024-11-29'
    },
    {
      name: 'H Block',
      code: 'h-block',
      description: 'Auxiliary systems and support block',
      lastAudit: '2024-11-12'
    }
  ];

  constructor(private router: Router) {}

  openArea(area: Area): void {
    this.router.navigate(['/area', area.code]);
  }
}

