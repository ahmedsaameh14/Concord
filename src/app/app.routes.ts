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
import { CareersComponent } from './User/careers/careers.component';
import { CareerDetailComponent } from './User/careers/career-detail.component';
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
import { DashboardCareersListComponent } from './dashboard/careers/careers-list.component';
import { DashboardCareerFormComponent } from './dashboard/careers/career-form.component';
import { DashboardCareerApplicationsComponent } from './dashboard/careers/applications.component';
import { DashboardUsersListComponent } from './dashboard/users/users-list.component';
import { adminGuard, authGuard, dashboardHomeGuard, usersManagerGuard } from './core/guards/auth.guard';

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
      { path: 'careers', component: CareersComponent },
      { path: 'careers/:id', component: CareerDetailComponent },
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
          { path: '', pathMatch: 'full', canActivate: [dashboardHomeGuard], children: [] },
          { path: 'overview', component: DashboardOverviewComponent, canActivate: [adminGuard] },
          { path: 'projects', component: DashboardProjectsListComponent, canActivate: [adminGuard] },
          { path: 'projects/new', component: DashboardProjectFormComponent, canActivate: [adminGuard] },
          { path: 'projects/:id/edit', component: DashboardProjectFormComponent, canActivate: [adminGuard] },
          { path: 'articles', component: DashboardArticlesListComponent, canActivate: [adminGuard] },
          { path: 'articles/new', component: DashboardArticleFormComponent, canActivate: [adminGuard] },
          { path: 'articles/:id/edit', component: DashboardArticleFormComponent, canActivate: [adminGuard] },
          { path: 'awards', component: DashboardAwardsListComponent, canActivate: [adminGuard] },
          { path: 'awards/new', component: DashboardAwardFormComponent, canActivate: [adminGuard] },
          { path: 'awards/:id/edit', component: DashboardAwardFormComponent, canActivate: [adminGuard] },
          { path: 'contact-messages', component: DashboardContactMessagesComponent, canActivate: [adminGuard] },
          { path: 'users', component: DashboardUsersListComponent, canActivate: [usersManagerGuard] },
          { path: 'careers', component: DashboardCareersListComponent },
          { path: 'careers/new', component: DashboardCareerFormComponent },
          { path: 'careers/:id/edit', component: DashboardCareerFormComponent },
          { path: 'careers/:id/applications', component: DashboardCareerApplicationsComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
