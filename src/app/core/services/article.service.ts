import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  ArticleListQuery,
  ArticleListResponse,
  ArticleResponse,
} from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.articles}`;

  constructor(private readonly http: HttpClient) {}

  getArticles(query: ArticleListQuery = {}): Observable<ArticleListResponse> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ArticleListResponse>(this.baseUrl, { params });
  }

  getBySlugOrId(slugOrId: string, adminView = false): Observable<ArticleResponse> {
    let params = new HttpParams();
    if (adminView) params = params.set('admin', 'true');
    return this.http.get<ArticleResponse>(`${this.baseUrl}/${slugOrId}`, { params });
  }

  create(formData: FormData): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<ArticleResponse> {
    return this.http.patch<ArticleResponse>(`${this.baseUrl}/${id}`, formData);
  }

  toggleStatus(id: string, isActive?: boolean): Observable<ArticleResponse> {
    const body = typeof isActive === 'boolean' ? { isActive } : {};
    return this.http.patch<ArticleResponse>(`${this.baseUrl}/${id}/status`, body);
  }

  toggleTop(id: string, isTopArticle?: boolean): Observable<ArticleResponse> {
    const body = typeof isTopArticle === 'boolean' ? { isTopArticle } : {};
    return this.http.patch<ArticleResponse>(`${this.baseUrl}/${id}/top`, body);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
