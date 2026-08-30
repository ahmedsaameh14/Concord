import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/dashboard/login'], { queryParams: { returnUrl: state.url } });
};

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard/login'], { queryParams: { returnUrl: state.url } });
  }

  return auth.isAdmin() ? true : router.createUrlTree(['/dashboard/careers']);
};

export const usersManagerGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard/login'], { queryParams: { returnUrl: state.url } });
  }

  return auth.canManageUsers() ? true : router.createUrlTree([auth.defaultDashboardRoute()]);
};

export const messagesAccessGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard/login'], { queryParams: { returnUrl: state.url } });
  }

  return auth.isAdmin() || auth.isHr()
    ? true
    : router.createUrlTree([auth.defaultDashboardRoute()]);
};

export const dashboardHomeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return router.createUrlTree([auth.defaultDashboardRoute()]);
};
