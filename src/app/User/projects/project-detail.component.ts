import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project, projectDuration } from '../../core/models/project.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsApi = inject(ProjectService);

  project = signal<Project | null>(null);
  loading = signal(true);
  error = signal('');
  galleryImages = signal<string[]>([]);
  activeSlide = signal(0);
  activeImage = computed(() => this.galleryImages()[this.activeSlide()] || '');

  duration = projectDuration;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      this.error.set('Project not found.');
      return;
    }

    this.projectsApi.getBySlugOrId(slug).subscribe({
      next: (res) => {
        this.project.set(res.data);
        this.galleryImages.set([res.data.mainImage, ...(res.data.ProjectImages || [])]);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Project not found.');
      },
    });
  }

  previousSlide(): void {
    const total = this.galleryImages().length;
    if (total) this.activeSlide.update(index => (index - 1 + total) % total);
  }

  nextSlide(): void {
    const total = this.galleryImages().length;
    if (total) this.activeSlide.update(index => (index + 1) % total);
  }

  selectSlide(index: number): void {
    this.activeSlide.set(index);
  }
}
