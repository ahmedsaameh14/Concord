import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG, AUTH_TOKEN_KEY } from '../config/api.config';
import { LoginCredentials, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.readToken());

  readonly token = this.tokenSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  isAuthenticated(): boolean {
    return Boolean(this.tokenSignal());
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, credentials)
      .pipe(tap((res) => this.setToken(res.token)));
  }

  private readToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
