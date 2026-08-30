import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../core/services/notification.service';
import { ArticleService } from '../../core/services/article.service';
import { AwardService } from '../../core/services/award.service';
import { ContactService } from '../../core/services/contact.service';
import { CareerService } from '../../core/services/career.service';
import { AuthService } from '../../core/services/auth.service';
import { Article } from '../../core/models/news.model';
import { Award } from '../../core/models/news.model';
import { ContactMessage } from '../../core/models/contact-message.model';
import { Career } from '../../core/models/career.model';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './overview.component.html',
})
export class DashboardOverviewComponent implements OnInit {
  private readonly projectsApi = inject(ProjectService);
  private readonly articlesApi = inject(ArticleService);
  private readonly awardsApi = inject(AwardService);
  private readonly contactApi = inject(ContactService);
  private readonly careersApi = inject(CareerService);
  private readonly authApi = inject(AuthService);
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

  articlesTotal = signal(0);
  activeArticles = signal(0);
  topArticles = signal(0);
  recentArticles = signal<Article[]>([]);

  awardsTotal = signal(0);
  recentAwards = signal<Award[]>([]);

  messagesTotal = signal(0);
  recentMessages = signal<ContactMessage[]>([]);

  careersTotal = signal(0);
  activeCareers = signal(0);
  recentCareers = signal<Career[]>([]);

  usersTotal = signal(0);

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.loading.set(true);
    this.error.set('');

    const requests = {
      projects: this.projectsApi.getProjects({ admin: 'true', limit: 50, page: 1 }),
      articles: this.articlesApi.getArticles({ admin: 'true', limit: 5, page: 1 }),
      awards: this.awardsApi.getAwards({ admin: 'true', limit: 5, page: 1 }),
      messages: this.contactApi.getMessages(),
      careers: this.careersApi.list('', 1, 10, true),
      users: this.authApi.isAdmin() ? this.authApi.getUsers() : of(null),
    };

    forkJoin(requests).subscribe({
      next: ({ projects, articles, awards, messages, careers, users }) => {
        const projectList = projects.data || [];
        this.total.set(projects.meta?.total ?? projectList.length);
        this.active.set(projectList.filter((p) => p.isActive).length);
        this.inactive.set(projectList.filter((p) => !p.isActive).length);
        this.locationsCount.set(projects.meta?.filters?.locations?.length || 0);

        const typeMap: Record<string, number> = {};
        PROJECT_TYPES.forEach((type) => {
          typeMap[type] = 0;
        });
        projectList.forEach((project) => {
          const key = String(project.type || 'other');
          typeMap[key] = (typeMap[key] || 0) + 1;
        });
        this.byType.set(typeMap);
        this.recent.set(projectList.slice(0, 5));

        const articleList = articles.data || [];
        this.articlesTotal.set(articles.meta?.total ?? articleList.length);
        this.activeArticles.set(articleList.filter((article) => article.isActive).length);
        this.topArticles.set(articleList.filter((article) => article.isTopArticle).length);
        this.recentArticles.set(articleList.slice(0, 4));

        const awardList = awards.data || [];
        this.awardsTotal.set(awards.meta?.total ?? awardList.length);
        this.recentAwards.set(awardList.slice(0, 4));

        const messageList = messages.data || [];
        this.messagesTotal.set(messageList.length);
        this.recentMessages.set(messageList.slice(0, 4));

        const careerList = careers.data || [];
        this.careersTotal.set(careers.meta?.total ?? careerList.length);
        this.activeCareers.set(careerList.filter((career) => career.isActive).length);
        this.recentCareers.set(careerList.slice(0, 4));

        this.usersTotal.set(users ? (users.data?.length ?? 0) : 0);
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
