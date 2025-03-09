
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // קבלת ה-Token ישירות מ-sessionStorage במקום מה-AuthService
  const userToken = typeof window !== 'undefined' ? sessionStorage.getItem('userToken') : null;

  // אם יש טוקן, נוסיף אותו לכותרת Authorization
  const authReq = userToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          sessionStorage.removeItem("userToken"); // ניתוק המשתמש במקרה של שגיאת 401
          router.navigate(["/login"]);
        }
      },
    })
  );
};
