import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AwardService } from '../../core/services/award.service';
import { NotificationService } from '../../core/services/notification.service';
import { Award } from '../../core/models/news.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-awards-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './awards-list.component.html',
})
export class DashboardAwardsListComponent implements OnInit {
  private readonly awardsApi = inject(AwardService);
  private readonly notify = inject(NotificationService);

  awards = signal<Award[]>([]);
  loading = signal(false);
  error = signal('');
  deleteDialogOpen = signal(false);
  deleteDialogTitle = '';
  deleteDialogMessage = '';
  pendingAward = signal<Award | null>(null);
  search = '';
  isActive: '' | 'true' | 'false' = '';

  ngOnInit(): void {
    this.loadAwards();
  }

  loadAwards(): void {
    this.loading.set(true);
    this.error.set('');
    this.awardsApi
      .getAwards({
        search: this.search || undefined,
        isActive: this.isActive || undefined,
        limit: 50,
        admin: 'true',
      })
      .subscribe({
        next: (res) => {
          this.awards.set(res.data || []);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const message = err?.error?.message || 'Failed to load awards.';
          this.error.set(message);
          this.notify.error(message);
        },
      });
  }

  onFilterChange(): void {
    this.loadAwards();
  }

  clearFilters(): void {
    this.search = '';
    this.isActive = '';
    this.loadAwards();
  }

  toggleStatus(award: Award): void {
    this.awardsApi.toggleStatus(award._id, !award.isActive).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'Status updated.');
        this.loadAwards();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to update status.'),
    });
  }

  deleteAward(award: Award): void {
    this.pendingAward.set(award);
    this.deleteDialogTitle = 'Delete award?';
    this.deleteDialogMessage = `Delete award "${award.title}"?`;
    this.deleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const award = this.pendingAward();
    if (!award) return;
    this.deleteDialogOpen.set(false);
    this.pendingAward.set(null);

    this.awardsApi.delete(award._id).subscribe({
      next: () => {
        this.notify.success('Award deleted successfully.');
        this.loadAwards();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to delete award.'),
    });
  }

  cancelDelete(): void {
    this.deleteDialogOpen.set(false);
    this.pendingAward.set(null);
  }

  get hasActiveFilters(): boolean {
    return Boolean(this.search || this.isActive);
  }
}
