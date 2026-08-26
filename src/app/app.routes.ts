import { Routes } from '@angular/router';
import { LayoutComponent } from './User/layout/layout.component';
import { HomeComponent } from './User/home/home.component';
import { AboutusComponent } from './User/About/aboutus/aboutus.component';
import { ManagementComponent } from './User/About/management/management.component';
import { InfrastructureComponent } from './User/Services/infrastructure/infrastructure.component';
import { TransportationComponent } from './User/Services/transportation/transportation.component';
import { ConstructionComponent } from './User/Services/construction/construction.component';
import { HistoryComponent } from './User/history/history.component';
import { VisionComponent } from './User/vision/vision.component';
import { TermsComponent } from './User/terms/terms.component';
import { PrivacyComponent } from './User/privacy/privacy.component';
import { SafetyComponent } from './User/safety/safety.component';
import { SustainabilityComponent } from './User/sustainability/sustainability.component';
import { ContactComponent } from './User/contact/contact.component';
import { ProjectsComponent } from './User/projects/projects.component';
import { ProjectDetailComponent } from './User/projects/project-detail.component';
import { ArticlesComponent } from './User/news/articles/articles.component';
import { ArticleDetailComponent } from './User/news/articles/article-detail.component';
import { AwardsComponent } from './User/news/awards/awards.component';
import { DashboardLayoutComponent } from './dashboard/layout/dashboard-layout.component';
import { DashboardOverviewComponent } from './dashboard/overview/overview.component';
import { DashboardProjectsListComponent } from './dashboard/projects/projects-list.component';
import { DashboardProjectFormComponent } from './dashboard/projects/project-form.component';
import { DashboardArticlesListComponent } from './dashboard/articles/articles-list.component';
import { DashboardArticleFormComponent } from './dashboard/articles/article-form.component';
import { DashboardAwardsListComponent } from './dashboard/awards/awards-list.component';
import { DashboardAwardFormComponent } from './dashboard/awards/award-form.component';
import { DashboardLoginComponent } from './dashboard/login/login.component';
import { DashboardContactMessagesComponent } from './dashboard/contact-messages/contact-messages.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about/who-we-are', component: AboutusComponent },
      { path: 'about/management', component: ManagementComponent },
      { path: 'services/infrastructure', component: InfrastructureComponent },
      { path: 'services/transportation', component: TransportationComponent },
      { path: 'services/construction', component: ConstructionComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects/:slug', component: ProjectDetailComponent },
      { path: 'news/articles', component: ArticlesComponent },
      { path: 'news/articles/:slug', component: ArticleDetailComponent },
      { path: 'news/awards', component: AwardsComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'vision', component: VisionComponent },
      { path: 'legal/terms', component: TermsComponent },
      { path: 'legal/privacy', component: PrivacyComponent },
      { path: 'safety', component: SafetyComponent },
      { path: 'sustainability', component: SustainabilityComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
  {
    path: 'dashboard',
    children: [
      { path: 'login', component: DashboardLoginComponent },
      {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'overview' },
          { path: 'overview', component: DashboardOverviewComponent },
          { path: 'projects', component: DashboardProjectsListComponent },
          { path: 'projects/new', component: DashboardProjectFormComponent },
          { path: 'projects/:id/edit', component: DashboardProjectFormComponent },
          { path: 'articles', component: DashboardArticlesListComponent },
          { path: 'articles/new', component: DashboardArticleFormComponent },
          { path: 'articles/:id/edit', component: DashboardArticleFormComponent },
          { path: 'awards', component: DashboardAwardsListComponent },
          { path: 'awards/new', component: DashboardAwardFormComponent },
          { path: 'awards/:id/edit', component: DashboardAwardFormComponent },
          { path: 'contact-messages', component: DashboardContactMessagesComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
