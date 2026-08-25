import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/news.model';
import { ARTICLE_TAGS, SERVICE_ROUTES } from '../../../core/config/api.config';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './articles.component.html',
})
export class ArticlesComponent implements OnInit {
  private readonly articlesApi = inject(ArticleService);

  readonly tags = ARTICLE_TAGS;
  readonly serviceRoutes = SERVICE_ROUTES;

  articles = signal<Article[]>([]);
  topArticle = signal<Article | null>(null);
  loading = signal(true);
  error = signal('');
  tag = '';
  search = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading.set(true);
    this.error.set('');

    this.articlesApi
      .getArticles({
        tags: this.tag || undefined,
        search: this.search.trim() || undefined,
        limit: 24,
      })
      .subscribe({
        next: (res) => {
          this.articles.set(res.data || []);
          this.topArticle.set(res.meta?.topArticle || null);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Unable to load articles.');
        },
      });
  }

  onTagChange(): void {
    this.loadArticles();
  }

  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadArticles(), 350);
  }

  clearFilters(): void {
    this.tag = '';
    this.search = '';
    this.loadArticles();
  }

  get hasActiveFilters(): boolean {
    return Boolean(this.tag || this.search.trim());
  }

  serviceRoute(tag: string): string {
    return this.serviceRoutes[tag as keyof typeof SERVICE_ROUTES] || '/services/construction';
  }
}
