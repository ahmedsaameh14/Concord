import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { Project } from '../../core/models/project.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './projects-list.component.html',
})
export class DashboardProjectsListComponent implements OnInit {
  private readonly projectsApi = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  readonly projectTypes = PROJECT_TYPES;

  projects = signal<Project[]>([]);
  locations = signal<string[]>([]);
  loading = signal(false);
  error = signal('');

  search = '';
  location = '';
  type = '';
  isActive: '' | 'true' | 'false' = '';
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectsApi
      .getProjects({
        search: this.search || undefined,
        locations: this.location || undefined,
        types: this.type || undefined,
        isActive: this.isActive || undefined,
        page: this.page,
        limit: this.limit,
        admin: 'true',
      })
      .subscribe({
        next: (res) => {
          this.projects.set(res.data || []);
          this.total = res.meta?.total || 0;
          this.totalPages = res.meta?.totalPages || 0;
          this.locations.set(res.meta?.filters?.locations || []);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const message = err?.error?.message || 'Failed to load projects.';
          this.error.set(message);
          this.notify.error(message);
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProjects();
  }

  clearFilters(): void {
    this.search = '';
    this.location = '';
    this.type = '';
    this.isActive = '';
    this.page = 1;
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadProjects();
  }

  toggleStatus(project: Project): void {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Connect an admin session to change project status.');
      return;
    }

    this.projectsApi.toggleStatus(project._id, !project.isActive).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'Project status updated.');
        this.loadProjects();
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Failed to update status.');
      },
    });
  }

  deleteProject(project: Project): void {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Connect an admin session to delete projects.');
      return;
    }

    const confirmed = confirm(`Delete project "${project.name}"? This cannot be undone.`);
    if (!confirmed) return;

    this.projectsApi.delete(project._id).subscribe({
      next: () => {
        this.notify.success('Project deleted successfully.');
        this.loadProjects();
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Failed to delete project.');
      },
    });
  }
}
