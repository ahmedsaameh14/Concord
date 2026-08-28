import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Application, ApplicationListResponse, ApplicationResponse, Career, CareerListResponse, CareerResponse } from '../models/career.model';

@Injectable({ providedIn: 'root' })
export class CareerService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/careers`;
  constructor(private readonly http: HttpClient) {}

  list(search = '', page = 1, limit = 8, admin = false): Observable<CareerListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) params = params.set('search', search.trim());
    if (admin) return this.http.get<CareerListResponse>(`${this.baseUrl}/admin/list`, { params });
    return this.http.get<CareerListResponse>(this.baseUrl, { params });
  }
  get(id: string): Observable<CareerResponse> { return this.http.get<CareerResponse>(`${this.baseUrl}/${id}`); }
  getAdmin(id: string): Observable<CareerResponse> { return this.http.get<CareerResponse>(`${this.baseUrl}/admin/${id}`); }
  create(data: Omit<Career, '_id' | 'createdAt'>): Observable<CareerResponse> { return this.http.post<CareerResponse>(this.baseUrl, data); }
  update(id: string, data: Partial<Career>): Observable<CareerResponse> { return this.http.patch<CareerResponse>(`${this.baseUrl}/${id}`, data); }
  toggleStatus(id: string, isActive: boolean): Observable<CareerResponse> { return this.http.patch<CareerResponse>(`${this.baseUrl}/${id}/status`, { isActive }); }
  delete(id: string): Observable<{ message: string }> { return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`); }
  apply(id: string, data: Omit<Application, '_id' | 'career' | 'status' | 'createdAt'>): Observable<ApplicationResponse> { return this.http.post<ApplicationResponse>(`${this.baseUrl}/${id}/applications`, data); }
  applications(id: string, search = '', status = '', page = 1, limit = 10): Observable<ApplicationListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) params = params.set('search', search.trim());
    if (status) params = params.set('status', status);
    return this.http.get<ApplicationListResponse>(`${this.baseUrl}/${id}/applications`, { params });
  }
  updateApplicationStatus(id: string, applicationId: string, status: string): Observable<ApplicationResponse> { return this.http.patch<ApplicationResponse>(`${this.baseUrl}/${id}/applications/${applicationId}/status`, { status }); }
  deleteApplication(id: string, applicationId: string): Observable<{ message: string }> { return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/applications/${applicationId}`); }
}
