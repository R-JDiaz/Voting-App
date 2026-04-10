import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const auth = inject(AuthService);

    const role = auth.getRole();
    if (!role) {
      return router.createUrlTree(['/login']);
    }

    if (!allowedRoles.includes(role)) {
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
};
