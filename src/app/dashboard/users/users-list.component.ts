import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AdminUser, UserRole } from '../../core/models/auth.model';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

type UserFormMode = 'create' | 'edit';

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  canManageUsers: boolean;
}

@Component({
  selector: 'app-dashboard-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './users-list.component.html',
})
export class DashboardUsersListComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  users = signal<AdminUser[]>([]);
  loading = signal(false);
  saving = signal(false);
  formMode = signal<UserFormMode | null>(null);
  editingUserId = signal<string | null>(null);
  searchQuery = signal('');

  readonly isAdmin = () => this.auth.isAdmin();
  readonly currentUserId = () => this.auth.user()?._id || '';

  form: UserFormState = this.emptyForm();

  readonly filteredUsers = computed(() => this.users());

  ngOnInit(): void {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => this.loadUsers(query));

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.search$.next(value);
  }

  loadUsers(search = this.searchQuery()): void {
    this.loading.set(true);
    this.auth.getUsers(search).subscribe({
      next: (res) => {
        this.users.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notify.error(err?.error?.message || 'Failed to load users.');
      },
    });
  }

  openCreateForm(): void {
    this.formMode.set('create');
    this.editingUserId.set(null);
    this.form = this.emptyForm();
  }

  openEditForm(user: AdminUser): void {
    if (!this.canEditUser(user)) return;

    this.formMode.set('edit');
    this.editingUserId.set(user._id);
    this.form = {
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role,
      canManageUsers: Boolean(user.canManageUsers),
    };
  }

  closeForm(): void {
    this.formMode.set(null);
    this.editingUserId.set(null);
    this.form = this.emptyForm();
  }

  saveUser(): void {
    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.notify.warning('Name and email are required.');
      return;
    }

    if (this.formMode() === 'create' && !this.form.password.trim()) {
      this.notify.warning('Password is required for new users.');
      return;
    }

    this.saving.set(true);

    if (this.formMode() === 'edit' && this.editingUserId()) {
      const payload = {
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        role: this.form.role,
        canManageUsers: this.form.role === 'hr' ? this.form.canManageUsers : false,
        ...(this.form.password.trim() ? { password: this.form.password } : {}),
      };

      this.auth.updateUser(this.editingUserId()!, payload).subscribe({
        next: (res) => {
          this.saving.set(false);
          this.notify.success(res.message || 'User updated.');
          if (this.editingUserId() === this.currentUserId()) {
            this.auth.loadProfile().subscribe();
          }
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          this.saving.set(false);
          this.notify.error(err?.error?.message || 'Failed to update user.');
        },
      });
      return;
    }

    this.auth
      .createUser({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        password: this.form.password,
        role: this.form.role,
        canManageUsers: this.form.role === 'hr' ? this.form.canManageUsers : false,
      })
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          this.notify.success(res.message || 'User created and activated.');
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          this.saving.set(false);
          this.notify.error(err?.error?.message || 'Failed to create user.');
        },
      });
  }

  toggleStatus(user: AdminUser): void {
    if (!this.canEditUser(user) || user._id === this.currentUserId()) return;

    this.auth.toggleUserStatus(user._id, !user.isActive).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'User status updated.');
        this.loadUsers();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to update user status.'),
    });
  }

  removeUser(user: AdminUser): void {
    if (!this.canEditUser(user) || user._id === this.currentUserId()) return;
    if (!confirm(`Delete user "${user.name || user.email}"?`)) return;

    this.auth.deleteUser(user._id).subscribe({
      next: (res) => {
        this.notify.success(res.message || 'User deleted.');
        this.loadUsers();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to delete user.'),
    });
  }

  canEditUser(user: AdminUser): boolean {
    if (this.isAdmin()) return true;
    return user.role === 'hr';
  }

  showCanManageUsersToggle(): boolean {
    return this.isAdmin() && this.form.role === 'hr';
  }

  showAdminRoleOption(): boolean {
    return this.isAdmin();
  }

  onRoleChange(role: UserRole): void {
    this.form.role = role;
    if (role !== 'hr') {
      this.form.canManageUsers = false;
    }
  }

  private emptyForm(): UserFormState {
    return {
      name: '',
      email: '',
      password: '',
      role: 'hr',
      canManageUsers: false,
    };
  }
}
