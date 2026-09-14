import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).pipe(
    catchError((error) => {
      if (error.status === 401) {
        auth.clearToken();
        const returnUrl = router.url;

        if (returnUrl !== '/dashboard/login') {
          void router.navigate(['/dashboard/login'], { queryParams: { returnUrl } });
        }
      }

      return throwError(() => error);
    })
  );
};
