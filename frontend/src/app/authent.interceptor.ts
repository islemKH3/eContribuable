import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthentService } from './authent.service';

export const authentInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthentService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
