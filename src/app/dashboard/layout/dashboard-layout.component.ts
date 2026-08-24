import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormDraftService } from '../../core/services/form-draft.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly drafts = inject(FormDraftService);
  private readonly notify = inject(NotificationService);
  private readonly loginDraftKey = 'admin_login';

  sidebarOpen = signal(false);
  email = '';
  password = '';
  sessionError = '';
  sessionLoading = false;

  ngOnInit(): void {
    const draft = this.drafts.load<{ email?: string }>(this.loginDraftKey);
    if (draft?.email) {
      this.email = draft.email;
    }
  }

  isAuthenticated = () => this.auth.isAuthenticated();

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onLoginDraftChange(): void {
    this.drafts.save(this.loginDraftKey, { email: this.email.trim() });
  }

  connectSession(): void {
    this.sessionError = '';
    if (!this.email || !this.password) {
      this.sessionError = 'Email and password are required.';
      this.notify.warning(this.sessionError);
      return;
    }

    this.sessionLoading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.sessionLoading = false;
        this.password = '';
        this.drafts.clear(this.loginDraftKey);
        this.notify.success('Admin session connected.');
      },
      error: (err) => {
        this.sessionLoading = false;
        this.sessionError = err?.error?.message || 'Unable to connect admin session.';
        this.notify.error(this.sessionError);
      },
    });
  }

  disconnectSession(): void {
    this.auth.clearToken();
    this.notify.info('Admin session disconnected.');
  }
}
