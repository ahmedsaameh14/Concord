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
      this.router.navigate(['/dashboard/overview']);
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
        this.notify.success('Admin session connected.');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard/overview';
        this.router.navigateByUrl(returnUrl.startsWith('/dashboard') ? returnUrl : '/dashboard/overview');
      },
      error: (err) => {
        this.loading.set(false);
        const message = err?.error?.message || 'Unable to connect admin session.';
        this.error.set(message);
        this.notify.error(message);
      },
    });
  }
}
