import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { Project, ProjectFilterOption, ProjectListMeta, ProjectSort, projectDuration } from '../../core/models/project.model';
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
  page = signal(1);
  totalPages = signal(0);
  totalProjects = signal(0);
  loading = signal(true);
  error = signal('');

  type = '';
  search = '';
  sort: ProjectSort = 'random';
  private seed = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private filtersLoaded = false;

  ngOnInit(): void {
    this.loadFilterOptions();

    this.route.queryParamMap.subscribe((params) => {
      this.type = (params.get('types') || params.get('services') || '').toLowerCase();
      this.search = params.get('search') || '';
      const requestedSort = params.get('sort') as ProjectSort | null;
      this.sort = ['random', 'name', 'newest', 'oldest', 'longest', 'shortest'].includes(requestedSort || '')
        ? requestedSort as ProjectSort
        : 'random';
      this.seed = params.get('seed') || '';
      this.page.set(Math.max(1, Number(params.get('page')) || 1));
      if (this.sort === 'random' && !this.seed) {
        this.seed = this.createRandomSeed();
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { sort: this.sort, seed: this.seed },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
        return;
      }
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
        page: this.page(),
        limit: 6,
        sort: this.sort,
        seed: this.sort === 'random' ? this.seed : undefined,
      })
      .subscribe({
        next: (res) => {
          const activeProjects = (res.data || []).filter((project) => project.isActive !== false);
          this.projects.set(activeProjects);
          const meta: ProjectListMeta | undefined = res.meta;
          this.totalPages.set(meta?.totalPages || 0);
          this.totalProjects.set(meta?.total || 0);
          this.loading.set(false);

        },
        error: (err) => {
          this.loading.set(false);
          this.totalPages.set(0);
          this.totalProjects.set(0);
          this.error.set(err?.error?.message || 'Unable to load projects.');
        },
      });
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.seed = this.sort === 'random' ? this.createRandomSeed() : '';
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
        page: null,
        sort: this.sort,
        seed: this.sort === 'random' ? this.seed : null,
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.router.navigate(['/projects'], {
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
  }

  private createRandomSeed(): string {
    return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}
