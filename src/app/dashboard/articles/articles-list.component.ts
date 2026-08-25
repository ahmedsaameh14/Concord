import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { NotificationService } from '../../core/services/notification.service';
import { ARTICLE_TAGS } from '../../core/config/api.config';
import { Article } from '../../core/models/news.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard-articles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './articles-list.component.html',
})
export class DashboardArticlesListComponent implements OnInit {
  private readonly articlesApi = inject(ArticleService);
  private readonly notify = inject(NotificationService);

  readonly tags = ARTICLE_TAGS;

  articles = signal<Article[]>([]);
  loading = signal(false);
  error = signal('');

  search = '';
  tag = '';
  isActive: '' | 'true' | 'false' = '';
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading.set(true);
    this.error.set('');

    this.articlesApi
      .getArticles({
        search: this.search || undefined,
        tags: this.tag || undefined,
        isActive: this.isActive || undefined,
        page: this.page,
        limit: this.limit,
        admin: 'true',
      })
      .subscribe({
        next: (res) => {
          this.articles.set(res.data || []);
          this.total = res.meta?.total || 0;
          this.totalPages = res.meta?.totalPages || 0;
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const message = err?.error?.message || 'Failed to load articles.';
          this.error.set(message);
          this.notify.error(message);
        },
      });
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadArticles();
  }

  clearFilters(): void {
    this.search = '';
    this.tag = '';
    this.isActive = '';
    this.page = 1;
    this.loadArticles();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadArticles();
  }

  toggleStatus(article: Article): void {
    this.articlesApi.toggleStatus(article._id, !article.isActive).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'Status updated.');
        this.loadArticles();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to update status.'),
    });
  }

  toggleTop(article: Article): void {
    this.articlesApi.toggleTop(article._id, !article.isTopArticle).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'Top article updated.');
        this.loadArticles();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to update top article.'),
    });
  }

  deleteArticle(article: Article): void {
    const confirmed = confirm(`Delete article "${article.title}"?`);
    if (!confirmed) return;

    this.articlesApi.delete(article._id).subscribe({
      next: () => {
        this.notify.success('Article deleted successfully.');
        this.loadArticles();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to delete article.'),
    });
  }

  get hasActiveFilters(): boolean {
    return Boolean(this.search || this.tag || this.isActive);
  }
}
