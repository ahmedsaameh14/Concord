export const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    login: '/auth/login',
    projects: '/category/projects',
    projectFilters: '/category/projects/filters',
    articles: '/category/articles',
    awards: '/category/awards',
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
