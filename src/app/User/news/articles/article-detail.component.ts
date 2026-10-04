import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/news.model';
import { SERVICE_ROUTES } from '../../../core/config/api.config';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly articlesApi = inject(ArticleService);

  readonly serviceRoutes = SERVICE_ROUTES;

  article = signal<Article | null>(null);
  loading = signal(true);
  error = signal('');
  activeSlide = signal(0);

  private autoAdvanceTimer: ReturnType<typeof setInterval> | null = null;

  get galleryImages(): string[] {
    const item = this.article();
    return item?.images?.length ? item.images : item?.image ? [item.image] : [];
  }

  get activeImage(): string {
    return this.galleryImages[this.activeSlide()] || '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        this.error.set('Article not found.');
        return;
      }

      this.stopAutoAdvance();
      this.activeSlide.set(0);
      this.loading.set(true);
      this.error.set('');
      this.articlesApi.getBySlugOrId(slug).subscribe({
        next: (res) => {
          this.article.set(res.data);
          this.titleService.setTitle(`${res.data.title} | Concord`);
          this.startAutoAdvance();
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Article not found.');
        },
      });
    });
  }

  nextImage(): void {
    if (this.galleryImages.length < 2) return;
    this.activeSlide.update((index) => (index + 1) % this.galleryImages.length);
  }

  previousImage(): void {
    if (this.galleryImages.length < 2) return;
    this.activeSlide.update((index) => (index - 1 + this.galleryImages.length) % this.galleryImages.length);
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.galleryImages.length) this.activeSlide.set(index);
  }

  startAutoAdvance(): void {
    this.stopAutoAdvance();
    if (
      this.galleryImages.length < 2 ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) return;

    this.autoAdvanceTimer = setInterval(() => this.nextImage(), 2500);
  }

  stopAutoAdvance(): void {
    if (this.autoAdvanceTimer) clearInterval(this.autoAdvanceTimer);
    this.autoAdvanceTimer = null;
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  serviceRoute(tag: string): string {
    return this.serviceRoutes[tag as keyof typeof SERVICE_ROUTES] || '/services/construction';
  }
}
