import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // return true;
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // המשתמש מחובר, אפשר להיכנס לנתיב
  } else {
    router.navigate(['/login']); // המשתמש לא מחובר, מפנה לדף התחברות
    return false;
  }
};
