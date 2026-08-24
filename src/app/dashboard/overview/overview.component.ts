import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './overview.component.html',
})
export class DashboardOverviewComponent implements OnInit {
  private readonly projectsApi = inject(ProjectService);
  private readonly notify = inject(NotificationService);

  readonly projectTypes = PROJECT_TYPES;

  loading = signal(true);
  error = signal('');
  total = signal(0);
  active = signal(0);
  inactive = signal(0);
  byType = signal<Record<string, number>>({});
  recent = signal<Project[]>([]);
  locationsCount = signal(0);

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectsApi
      .getProjects({
        admin: 'true',
        limit: 50,
        page: 1,
      })
      .subscribe({
        next: (res) => {
          const projects = res.data || [];
          this.total.set(res.meta?.total ?? projects.length);
          this.active.set(projects.filter((p) => p.isActive).length);
          this.inactive.set(projects.filter((p) => !p.isActive).length);
          this.locationsCount.set(res.meta?.filters?.locations?.length || 0);

          const typeMap: Record<string, number> = {};
          PROJECT_TYPES.forEach((type) => {
            typeMap[type] = 0;
          });
          projects.forEach((project) => {
            const key = String(project.type || 'other');
            typeMap[key] = (typeMap[key] || 0) + 1;
          });
          this.byType.set(typeMap);
          this.recent.set(projects.slice(0, 5));
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const message = err?.error?.message || 'Failed to load overview.';
          this.error.set(message);
          this.notify.error(message);
        },
      });
  }
}
