import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  private readonly projectsApi = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly projectTypes = PROJECT_TYPES;

  projects = signal<Project[]>([]);
  locations = signal<string[]>([]);
  loading = signal(true);
  error = signal('');

  location = '';
  type = '';
  search = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.location = (params.get('locations') || '').toLowerCase();
      this.type = (params.get('types') || params.get('services') || '').toLowerCase();
      this.search = params.get('search') || '';
      this.loadProjects();
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectsApi
      .getProjects({
        locations: this.location || undefined,
        types: this.type || undefined,
        search: this.search || undefined,
        limit: 24,
      })
      .subscribe({
        next: (res) => {
          const activeProjects = (res.data || []).filter((project) => project.isActive !== false);
          this.projects.set(activeProjects);
          this.locations.set(res.meta?.filters?.locations || []);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Unable to load projects.');
        },
      });
  }

  applyFilters(): void {
    this.router.navigate(['/projects'], {
      queryParams: {
        locations: this.location || null,
        types: this.type || null,
        search: this.search || null,
      },
    });
  }
}
