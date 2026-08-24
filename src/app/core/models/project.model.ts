import { ProjectType } from '../config/api.config';

export interface KeyFeatureSection {
  title: string;
  value?: string;
  items?: string[];
}

export interface ProjectKeyFeatures {
  sections: KeyFeatureSection[];
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  mainImage: string;
  overview: string;
  startYear?: number;
  endYear?: number;
  duration?: string;
  date?: string;
  address: string;
  location: string;
  client: string;
  contractValue: string;
  type: ProjectType | string;
  ProjectImages?: string[];
  keyFeatures?: ProjectKeyFeatures;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: {
    locations: string[];
    types?: string[];
    services?: string[];
  };
}

export interface ProjectListResponse {
  message: string;
  data: Project[];
  meta: ProjectListMeta;
}

export interface ProjectResponse {
  message: string;
  data: Project;
}

export interface ProjectFiltersResponse {
  message: string;
  data: {
    locations: string[];
    types?: string[];
    services?: string[];
  };
}

export interface ProjectListQuery {
  locations?: string;
  services?: string;
  types?: string;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: 'true' | 'false' | '';
  /** Dashboard only: include inactive projects when admin token is present */
  admin?: 'true';
}

export const projectDuration = (project: Pick<Project, 'startYear' | 'endYear' | 'duration'>): string => {
  if (project.duration) return project.duration;
  if (!project.startYear) return '';
  if (!project.endYear || project.endYear === project.startYear) {
    return String(project.startYear);
  }
  return `${project.startYear} – ${project.endYear}`;
};
