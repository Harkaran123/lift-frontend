import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ForgotPasswordRequest, EmailVerificationRequest, VerifyOtpRequest } from '../models/recovery.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, request)
      .pipe(catchError(error => throwError(() => error)));
  }

  sendVerificationOtp(request: EmailVerificationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification-otp`, request)
      .pipe(catchError(error => throwError(() => error)));
  }

  verifyEmailOtp(request: VerifyOtpRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email-otp`, request)
      .pipe(catchError(error => throwError(() => error)));
  }
}
