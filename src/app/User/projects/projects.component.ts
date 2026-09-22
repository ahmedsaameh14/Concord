import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { Project, ProjectFilterOption, projectDuration } from '../../core/models/project.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private readonly projectsApi = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly projectTypes = PROJECT_TYPES;
  readonly projectDuration = projectDuration;

  projects = signal<Project[]>([]);
  typeOptions = signal<ProjectFilterOption[]>([]);
  loading = signal(true);
  error = signal('');

  type = '';
  search = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private filtersLoaded = false;

  ngOnInit(): void {
    this.loadFilterOptions();

    this.route.queryParamMap.subscribe((params) => {
      this.type = (params.get('types') || params.get('services') || '').toLowerCase();
      this.search = params.get('search') || '';
      this.loadProjects();
    });
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  get hasActiveFilters(): boolean {
    return Boolean(this.type || this.search.trim());
  }

  loadFilterOptions(): void {
    this.projectsApi.getFilters().subscribe({
      next: (res) => {
        this.typeOptions.set(res.data?.types || []);
        this.filtersLoaded = true;
      },
      error: () => {
        this.typeOptions.set(this.projectTypes.map((name) => ({ name, count: 0 })));
        this.filtersLoaded = true;
      },
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectsApi
      .getProjects({
        types: this.type || undefined,
        search: this.search || undefined,
        limit: 24,
      })
      .subscribe({
        next: (res) => {
          const activeProjects = (res.data || []).filter((project) => project.isActive !== false);
          this.projects.set(activeProjects);
          this.loading.set(false);

        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Unable to load projects.');
        },
      });
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => this.applyFilters(), 350);
  }

  clearFilters(): void {
    this.type = '';
    this.search = '';
    this.applyFilters();
  }

  applyFilters(): void {
    this.router.navigate(['/projects'], {
      queryParams: {
        types: this.type || null,
        search: this.search.trim() || null,
      },
    });
  }
}
