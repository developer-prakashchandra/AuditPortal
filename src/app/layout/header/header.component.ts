import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  appName = '';
  currentUser: User | null = null;
  userMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.appName = this.configService.get('appName') || 'Audit Portal';
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.initUserMenu();
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  private initUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.onProfile()
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.onSettings()
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
    ];
  }

  onProfile(): void {
    console.log('Profile clicked');
  }

  onSettings(): void {
    console.log('Settings clicked');
  }

  onLogout(): void {
    this.authService.logout();
  }

  onLogoError(event: any): void {
    // Fallback if logo doesn't load - hide the image element
    event.target.style.display = 'none';
  }
}

