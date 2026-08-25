import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  AwardListQuery,
  AwardListResponse,
  AwardResponse,
} from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class AwardService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.awards}`;

  constructor(private readonly http: HttpClient) {}

  getAwards(query: AwardListQuery = {}): Observable<AwardListResponse> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<AwardListResponse>(this.baseUrl, { params });
  }

  getBySlugOrId(slugOrId: string, adminView = false): Observable<AwardResponse> {
    let params = new HttpParams();
    if (adminView) params = params.set('admin', 'true');
    return this.http.get<AwardResponse>(`${this.baseUrl}/${slugOrId}`, { params });
  }

  create(formData: FormData): Observable<AwardResponse> {
    return this.http.post<AwardResponse>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<AwardResponse> {
    return this.http.patch<AwardResponse>(`${this.baseUrl}/${id}`, formData);
  }

  toggleStatus(id: string, isActive?: boolean): Observable<AwardResponse> {
    const body = typeof isActive === 'boolean' ? { isActive } : {};
    return this.http.patch<AwardResponse>(`${this.baseUrl}/${id}/status`, body);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
