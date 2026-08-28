import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl,
  endpoints: {
    login: '/auth/login',
    me: '/auth/me',
    adminUsers: '/admin',
    projects: '/category/projects',
    projectFilters: '/category/projects/filters',
    articles: '/category/articles',
    awards: '/category/awards',
    contact: '/contact',
  },
} as const;

export const PROJECT_TYPES = [
  'construction',
  'infrastructure',
  'transportation',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const ARTICLE_TAGS = PROJECT_TYPES;

export const SERVICE_ROUTES: Record<(typeof ARTICLE_TAGS)[number], string> = {
  construction: '/services/construction',
  infrastructure: '/services/infrastructure',
  transportation: '/services/transportation',
};

export const AUTH_TOKEN_KEY = 'concord_admin_token';
export const AUTH_USER_KEY = 'concord_admin_user';
