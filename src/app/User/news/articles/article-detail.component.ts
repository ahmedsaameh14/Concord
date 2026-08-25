import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
})
export class ArticleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly articlesApi = inject(ArticleService);

  readonly serviceRoutes = SERVICE_ROUTES;

  article = signal<Article | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      this.error.set('Article not found.');
      return;
    }

    this.articlesApi.getBySlugOrId(slug).subscribe({
      next: (res) => {
        this.article.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Article not found.');
      },
    });
  }

  serviceRoute(tag: string): string {
    return this.serviceRoutes[tag as keyof typeof SERVICE_ROUTES] || '/services/construction';
  }
}
