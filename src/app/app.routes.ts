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
import {
  adminGuard,
  authGuard,
  dashboardHomeGuard,
  messagesAccessGuard,
  usersManagerGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Concord for Engineering & Construction' },
      { path: 'about/who-we-are', component: AboutusComponent, title: 'Who we are' },
      { path: 'about/management', component: ManagementComponent, title: 'Our Management team' },
      { path: 'services/infrastructure', component: InfrastructureComponent, title: 'Infrastructure' },
      { path: 'services/transportation', component: TransportationComponent, title: 'Transportation' },
      { path: 'services/construction', component: ConstructionComponent, title: 'Construction' },
      { path: 'projects', component: ProjectsComponent, title: 'Projects' },
      { path: 'projects/:slug', component: ProjectDetailComponent, title: 'Project Details' },
      { path: 'news/articles', component: ArticlesComponent, title: 'Articles' },
      { path: 'news/articles/:slug', component: ArticleDetailComponent, title: 'Article Details' },
      { path: 'news/awards', component: AwardsComponent, title: 'Awards' },
      { path: 'history', component: HistoryComponent, title: 'History' },
      { path: 'vision', component: VisionComponent, title: 'Vision' },
      { path: 'legal/terms', component: TermsComponent, title: 'Terms of Service' },
      { path: 'legal/privacy', component: PrivacyComponent, title: 'Privacy Policy' },
      { path: 'safety', component: SafetyComponent, title: 'Safety' },
      { path: 'sustainability', component: SustainabilityComponent, title: 'Sustainability' },
      { path: 'contact', component: ContactComponent, title: 'Contact Us' },
      { path: 'careers', component: CareersComponent, title: 'Careers' },
      { path: 'careers/:id', component: CareerDetailComponent, title: 'Career Details' },
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
          { path: 'overview', component: DashboardOverviewComponent, canActivate: [adminGuard], title: 'Dashboard Overview' },
          { path: 'projects', component: DashboardProjectsListComponent, canActivate: [adminGuard], title: 'Projects' },
          { path: 'projects/new', component: DashboardProjectFormComponent, canActivate: [adminGuard], title: 'New Project' },
          { path: 'projects/:id/edit', component: DashboardProjectFormComponent, canActivate: [adminGuard], title: 'Edit Project' },
          { path: 'articles', component: DashboardArticlesListComponent, canActivate: [adminGuard], title: 'Articles' },
          { path: 'articles/new', component: DashboardArticleFormComponent, canActivate: [adminGuard], title: 'New Article' },
          { path: 'articles/:id/edit', component: DashboardArticleFormComponent, canActivate: [adminGuard], title: 'Edit Article' },
          { path: 'awards', component: DashboardAwardsListComponent, canActivate: [adminGuard], title: 'Awards' },
          { path: 'awards/new', component: DashboardAwardFormComponent, canActivate: [adminGuard], title: 'New Award' },
          { path: 'awards/:id/edit', component: DashboardAwardFormComponent, canActivate: [adminGuard], title: 'Edit Award' },
          { path: 'contact-messages', component: DashboardContactMessagesComponent, canActivate: [messagesAccessGuard], title: 'Contact Messages' },
          { path: 'users', component: DashboardUsersListComponent, canActivate: [usersManagerGuard], title: 'Users' },
          { path: 'careers', component: DashboardCareersListComponent, title: 'Careers' },
          { path: 'careers/new', component: DashboardCareerFormComponent, title: 'New Career' },
          { path: 'careers/:id/edit', component: DashboardCareerFormComponent, title: 'Edit Career' },
          { path: 'careers/:id/applications', component: DashboardCareerApplicationsComponent, title: 'Career Applications' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
