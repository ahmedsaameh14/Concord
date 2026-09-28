import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectType } from '../../core/config/api.config';
import { ProjectService } from '../../core/services/project.service';
import { Project, projectDuration } from '../../core/models/project.model';

@Component({
  selector: 'app-service-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-projects.component.html',
  styleUrl: './service-projects.component.css',
})
export class ServiceProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) service: ProjectType = 'infrastructure';
  @ViewChild('projectTrack') projectTrack?: ElementRef<HTMLElement>;

  private readonly projectsApi = inject(ProjectService);
  private carouselTimer?: ReturnType<typeof setInterval>;

  readonly projectDuration = projectDuration;
  projects = signal<Project[]>([]);

  ngOnInit(): void {
    this.projectsApi.getProjects({ types: this.service, limit: 9 }).subscribe({
      next: (response) => this.projects.set(response.data || []),
    });
  }

  ngAfterViewInit(): void {
    this.carouselTimer = setInterval(() => this.advance(), 3500);
  }

  move(direction: -1 | 1): void {
    const track = this.projectTrack?.nativeElement;
    if (!track) return;

    if (direction < 0 && track.scrollLeft <= 0) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      return;
    }

    if (direction > 0 && track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
  }

  private advance(): void {
    const track = this.projectTrack?.nativeElement;
    if (!track || track.matches(':hover, :focus-within')) return;
    if (track.scrollWidth <= track.clientWidth + 1) return;

    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
  }
}
