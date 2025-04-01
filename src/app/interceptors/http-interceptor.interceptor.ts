import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const token = sessionStorage.getItem('authorisation');
  // console.log('Interceptor token:', token);

  let modifiedRequest = req;
  const expired=token!==null?isTokenExpired(token):true;
  // console.log('expired:', expired);
 if(token && expired){
    snackBar.open('Auth expired! Please log in again.', 'Close', { duration: 3000 });
    sessionStorage.clear();
    router.navigate(['/login']);
 }
  if (token && !expired) {
    modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
  }

  return next(modifiedRequest).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        // console.log('Response received:', event);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // console.error('Error from backend:', error);
      switch (error.status) {
        case 401:
          snackBar.open('Unauthorized! Please log in again.', 'Close', { duration: 3000 });
          router.navigate(['/login']);
          break;
        case 403:
          snackBar.open('Forbidden! You do not have permission to access this resource.', 'Close', { duration: 3000 });
          break;
        case 404:
          snackBar.open('Resource not found!', 'Close', { duration: 3000 });
          break;
        case 500:
          snackBar.open('Server error! Please try again later.', 'Close', { duration: 3000 });
          break;
        default:
          snackBar.open(`Error: ${error.message}`, 'Close', { duration: 3000 });
          break;
      }

      return throwError(() => error);
    })
  );
};

function isTokenExpired(token: string): boolean {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); 
    const expiryTime = payload.exp * 1000;
    return Date.now() > expiryTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}
