import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  private readonly auth = inject(AuthService);

  sidebarOpen = signal(false);
  email = '';
  password = '';
  sessionError = '';
  sessionLoading = false;

  isAuthenticated = () => this.auth.isAuthenticated();

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  connectSession(): void {
    this.sessionError = '';
    if (!this.email || !this.password) {
      this.sessionError = 'Email and password are required.';
      return;
    }

    this.sessionLoading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.sessionLoading = false;
        this.password = '';
      },
      error: (err) => {
        this.sessionLoading = false;
        this.sessionError = err?.error?.message || 'Unable to connect admin session.';
      },
    });
  }

  disconnectSession(): void {
    this.auth.clearToken();
  }
}
