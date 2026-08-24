export const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    login: '/auth/login',
    projects: '/category/projects',
    projectFilters: '/category/projects/filters',
  },
} as const;

export const PROJECT_TYPES = [
  'construction',
  'infrastructure',
  'transportation',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const AUTH_TOKEN_KEY = 'concord_admin_token';
