import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../config/api.config';
import {
  AdminUser,
  AdminUserResponse,
  AdminUsersResponse,
  CreateAdminPayload,
  LoginCredentials,
  LoginResponse,
  UpdateAdminPayload,
  UserRole,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly userSignal = signal<AdminUser | null>(this.readUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  isAuthenticated(): boolean {
    return Boolean(this.tokenSignal());
  }

  isAdmin(): boolean {
    return this.userSignal()?.role === 'admin';
  }

  isHr(): boolean {
    return this.userSignal()?.role === 'hr';
  }

  canManageUsers(): boolean {
    const user = this.userSignal();
    return user?.role === 'admin' || Boolean(user?.canManageUsers);
  }

  role(): UserRole | null {
    return this.userSignal()?.role || null;
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  setSession(token: string, user: AdminUser): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, credentials)
      .pipe(tap((res) => this.setSession(res.token, res.user)));
  }

  loadProfile(): Observable<AdminUserResponse> {
    return this.http
      .get<AdminUserResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.me}`)
      .pipe(
        tap((res) => {
          this.userSignal.set(res.data);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data));
        })
      );
  }

  getUsers(search = ''): Observable<AdminUsersResponse> {
    let params = new HttpParams();
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<AdminUsersResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.adminUsers}`, {
      params,
    });
  }

  createUser(payload: CreateAdminPayload): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.adminUsers}`, payload);
  }

  updateUser(id: string, payload: UpdateAdminPayload): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.adminUsers}/${id}`,
      payload
    );
  }

  toggleUserStatus(id: string, isActive: boolean): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.adminUsers}/${id}/status`,
      { isActive }
    );
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.adminUsers}/${id}`
    );
  }

  defaultDashboardRoute(): string {
    return this.isHr() ? '/dashboard/careers' : '/dashboard/overview';
  }

  private readToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private readUser(): AdminUser | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }
}
