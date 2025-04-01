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
    // return this.http.get<ResponseModel>(`${this.ApiUrl}/reports/dashboard-stats`)
    return this.http.get<ResponseModel>(`${this.ApiUrl}/students/count`)
  }
  public changePassword(auth: PasswordChange): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/auth/password-change`, auth);
  }
  
  public resetPassword(email: string): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('email', email);
    return this.http.get<ResponseModel>(`${this.ApiUrl}/auth/password-reset`, { params });
  }

  generateData(recordCount: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/files/generate/student-file/${recordCount}`,{});
  }

  processDataToCvs(processId: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/files/process/student-file/${processId}`,{});
  }

  uploadFileToDatabase(processId: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.ApiUrl}/files/upload/student-file/${processId}`,{});
  }

  getStudents(page: number, size: number, studentId?: string, studentClass?: string, startDate?: string, endDate?: string): Observable<ResponseModel> {
    let params = new HttpParams()
    .set('page', page)
    .set('size', size);
    if (studentId) {
      params = params.set('studentId', studentId);
    }
    if (studentClass) {
      params = params.set('studentClass', studentClass);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
     return this.http.get<ResponseModel>(`${this.ApiUrl}/students`, { params });
  }
  getStudentClasses(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.ApiUrl}/students/classes`);
  }

  softDeleteStudent(id: any): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.ApiUrl}/students/${id}`);

  }
  updateStudent(id: any, formData: FormData): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.ApiUrl}/students/${id}`,formData);
  }
  getStudentById(id: string) : Observable<ResponseModel>{
    let params = new HttpParams()
    .set('studentId', id);
    return this.http.get<ResponseModel>(`${this.ApiUrl}/students`, { params });
  }
  uploadStudentPhoto(id: number, formData: FormData) : Observable<ResponseModel>{
    throw new Error('Method not implemented.');
  }
}
