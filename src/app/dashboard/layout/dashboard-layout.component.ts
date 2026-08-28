import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  sidebarOpen = signal(false);

  readonly isAdmin = () => this.auth.isAdmin();
  readonly isHr = () => this.auth.isHr();
  readonly canManageUsers = () => this.auth.canManageUsers();
  readonly userName = () => this.auth.user()?.name || '';
  readonly userEmail = () => this.auth.user()?.email || '';

  ngOnInit(): void {
    if (this.auth.isAuthenticated() && !this.auth.user()) {
      this.auth.loadProfile().subscribe({ error: () => this.auth.clearToken() });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  disconnectSession(): void {
    this.auth.clearToken();
    this.notify.info('Session disconnected.');
    this.router.navigate(['/dashboard/login']);
  }
}
