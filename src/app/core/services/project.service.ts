import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  ProjectFiltersResponse,
  ProjectListQuery,
  ProjectListResponse,
  ProjectResponse,
} from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.projects}`;

  constructor(private readonly http: HttpClient) {}

  getProjects(query: ProjectListQuery = {}): Observable<ProjectListResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ProjectListResponse>(this.baseUrl, { params });
  }

  getFilters(): Observable<ProjectFiltersResponse> {
    return this.http.get<ProjectFiltersResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.projectFilters}`
    );
  }

  getBySlugOrId(slugOrId: string, adminView = false): Observable<ProjectResponse> {
    let params = new HttpParams();
    if (adminView) {
      params = params.set('admin', 'true');
    }
    return this.http.get<ProjectResponse>(`${this.baseUrl}/${slugOrId}`, { params });
  }

  create(formData: FormData): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<ProjectResponse> {
    return this.http.patch<ProjectResponse>(`${this.baseUrl}/${id}`, formData);
  }

  toggleStatus(id: string, isActive?: boolean): Observable<ProjectResponse> {
    const body = typeof isActive === 'boolean' ? { isActive } : {};
    return this.http.patch<ProjectResponse>(`${this.baseUrl}/${id}/status`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
