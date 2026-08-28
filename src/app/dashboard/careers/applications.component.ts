import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service';
import { Application } from '../../core/models/career.model';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

type ApplicationStatus = Application['status'];

interface MenuPosition {
  top: number;
  left: number;
}

@Component({
  selector: 'app-dashboard-career-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink, LoadingSpinnerComponent],
  templateUrl: './applications.component.html',
})
export class DashboardCareerApplicationsComponent implements OnInit {
  private readonly api = inject(CareerService);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);

  id = '';
  title = '';
  applications = signal<Application[]>([]);
  loading = signal(false);
  search = '';
  status = '';
  page = 1;
  totalPages = 0;
  total = 0;
  openStatusMenuId: string | null = null;
  menuPosition = signal<MenuPosition | null>(null);

  readonly statusOptions: ApplicationStatus[] = ['Waiting', 'Accepted', 'Rejected'];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.load();
  }

  @HostListener('document:click')
  closeStatusMenu(): void {
    this.openStatusMenuId = null;
    this.menuPosition.set(null);
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.openStatusMenuId) {
      this.closeStatusMenu();
    }
  }

  load(): void {
    this.loading.set(true);
    this.api.applications(this.id, this.search, this.status, this.page).subscribe({
      next: (r) => {
        this.title = r.career.title;
        this.applications.set(r.data || []);
        this.total = r.meta.total;
        this.totalPages = r.meta.totalPages;
        this.loading.set(false);
      },
      error: (e) => {
        this.notify.error(e?.error?.message || 'Failed to load applications.');
        this.loading.set(false);
      },
    });
  }

  filter(): void {
    this.page = 1;
    this.load();
  }

  go(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.load();
    }
  }

  getApplication(id: string): Application | undefined {
    return this.applications().find((application) => application._id === id);
  }

  toggleStatusMenu(event: Event, applicationId: string): void {
    event.stopPropagation();

    if (this.openStatusMenuId === applicationId) {
      this.closeStatusMenu();
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.openStatusMenuId = applicationId;
    this.menuPosition.set({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }

  selectStatus(event: Event, application: Application, status: ApplicationStatus): void {
    event.stopPropagation();
    this.closeStatusMenu();
    if (application.status === status) return;
    application.status = status;
    this.change(application);
  }

  statusStyles(status: ApplicationStatus): Record<string, string> {
    switch (status) {
      case 'Waiting':
        return { backgroundColor: '#fef3c2', color: '#854d0e' };
      case 'Accepted':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'Rejected':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
    }
  }

  change(a: Application): void {
    this.api.updateApplicationStatus(this.id, a._id, a.status).subscribe({
      next: () => this.notify.success('Application status updated.'),
      error: (e) => this.notify.error(e?.error?.message || 'Failed to update status.'),
    });
  }

  remove(a: Application): void {
    if (!confirm(`Delete application from ${a.firstName} ${a.lastName}?`)) return;
    this.api.deleteApplication(this.id, a._id).subscribe({
      next: () => {
        this.notify.success('Application deleted.');
        this.load();
      },
      error: (e) => this.notify.error(e?.error?.message || 'Failed to delete application.'),
    });
  }
}
