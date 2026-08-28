import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormDraftService } from '../../core/services/form-draft.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class DashboardLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly drafts = inject(FormDraftService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly draftKey = 'admin_login';

  email = '';
  password = '';
  submitted = false;
  error = signal('');
  loading = signal(false);

  constructor() {
    const draft = this.drafts.load<{ email?: string }>(this.draftKey);
    this.email = draft?.email || '';

    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.auth.defaultDashboardRoute());
    }
  }

  onEmailChange(): void {
    this.drafts.save(this.draftKey, { email: this.email.trim() });
  }

  submit(form: NgForm): void {
    this.submitted = true;
    this.error.set('');

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.drafts.clear(this.draftKey);
        this.notify.success('Session connected.');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const fallback = this.auth.defaultDashboardRoute();
        const target =
          returnUrl && returnUrl.startsWith('/dashboard') ? returnUrl : fallback;
        this.router.navigateByUrl(this.auth.isHr() && !returnUrl?.includes('/careers') ? fallback : target);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err?.error?.message || 'Unable to connect session.';
        this.error.set(message);
        this.notify.error(message);
      },
    });
  }
}
