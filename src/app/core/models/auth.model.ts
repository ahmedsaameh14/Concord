export type UserRole = 'admin' | 'hr';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  canManageUsers: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AdminUser;
}

export interface AdminUserResponse {
  message: string;
  data: AdminUser;
}

export interface AdminUsersResponse {
  message: string;
  data: AdminUser[];
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  canManageUsers?: boolean;
}

export interface UpdateAdminPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  canManageUsers?: boolean;
}
