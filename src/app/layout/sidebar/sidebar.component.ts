import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [];
  tenantCode = '';
  tenantName = '';

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.tenantCode = this.configService.get('tenantCode') || '';
    this.tenantName = this.configService.get('tenantName') || this.tenantCode || 'Tenant';
  }

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe(items => {
      this.menuItems = items;
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  toggleMenuItem(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.command === 'logout') {
      this.authService.logout();
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }

    if (item.children && item.children.length > 0) {
      this.toggleMenuItem(item);
    }
  }

  isActive(item: MenuItem): boolean {
    if (item.route) {
      return this.router.url === item.route;
    }
    return false;
  }
}

