import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  ContactMessage,
  ContactMessageListResponse,
  ContactMessageResponse,
} from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact}`;

  constructor(private readonly http: HttpClient) {}

  create(message: Omit<ContactMessage, '_id' | 'createdAt'>): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.baseUrl, message);
  }

  getMessages(search = ''): Observable<ContactMessageListResponse> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<ContactMessageListResponse>(this.baseUrl, { params });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
