import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ResponseModel } from './auth/responseModel';
import { Auth } from './auth/auth';
import { PasswordChange } from './auth/changePasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private ApiUrl = "http://localhost:8086/api/v2";

  constructor(private http: HttpClient) {}

  public authenticate(auth: Auth): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/auth/authenticate`, auth);
  }
  public getProfile(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.ApiUrl}/auth/profile`);
  }

  public getDashStats() : Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.ApiUrl}/reports/dashboard-stats`)
  }
  public changePassword(auth: PasswordChange): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/auth/password-change`, auth);
  }
  
  public resetPassword(email: string): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('email', email);
    return this.http.get<ResponseModel>(`${this.ApiUrl}/auth/password-reset`, { params });
  }
}
