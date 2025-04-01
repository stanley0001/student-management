import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpService } from '../http.service';
import { Auth } from './auth';
import { PasswordChange } from './changePasswordRequest';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,LoaderComponent
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isProcessing=false;
  view: 'login' | 'otp' | 'reset' | 'passwordChange' = 'login';
  username = '';
  resetRef = '';
  password = '';
  email = '';
  otp='';
  newPassword = '';
  confirmPassword = '';
  authRequest!: Auth;
  changePasswordRequest!: PasswordChange;

  constructor(private route: ActivatedRoute,
     private http: HttpService,
     private router: Router,
     private snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.resetRef=params['id'];
        this.switchView('passwordChange');
      }
    });
  }

  switchView(view: 'login' | 'reset' | 'passwordChange' | 'otp') {
    this.view = view;
  }
  base64UrlDecode(base64Url:any) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    let result = '';
    for (let i = 0; i < rawData.length; ++i) {
        result += String.fromCharCode(rawData.charCodeAt(i));
    }
    return result;
  }
  
  parseJwt(token:any) {
    const payloadBase64Url = token.split('.')[1];
    const payloadDecoded = this.base64UrlDecode(payloadBase64Url);
    return JSON.parse(payloadDecoded);
  }
  validateOtp(){
    console.log('User authenticated');
    sessionStorage.setItem('username',this.username)
    let authorisation='Bearer test one';
    sessionStorage.setItem('authorisation',authorisation);
    this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
    this.router.navigate(['dashboard'])
  }
  
  login() {
    if (this.username=='' || this.password==''){
      this.snackBar.open('Empty values passed!', 'Close', { duration: 3000 });
      return;
    }
    // this.switchView('otp')
    // return;
    this.isProcessing=true;
    this.authRequest = { userName: this.username, password: this.password, otp:"1149" };
    this.http.authenticate(this.authRequest).subscribe((response: any) => {
      console.log(response.data);
      if (response.data?.token && response.data.authenticated) {
        console.log('User authenticated');
        const payload = this.parseJwt(response.data.token);
        const { authorities, sub: username, exp } = payload;
        sessionStorage.setItem('username',username)
        sessionStorage.setItem('exp',exp)
        // sessionStorage.setItem('authorities',authorities)
        sessionStorage.setItem('authorities', JSON.stringify(authorities));
        let authorisation='Bearer '+response.data.token;
        sessionStorage.setItem('authorisation',authorisation);
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['dashboard'])
      }else{
        response?.message?this.snackBar.open(response.message, 'Close', { duration: 3000 }):this.snackBar.open("An error occure, kindly contact the administrator", 'Close', { duration: 3000 });
      }
      this.isProcessing=false;
    },
      (err: any) => {
        console.error('Error during authentication:', err);
        this.isProcessing=false;
        err?.error?.message?this.snackBar.open(err?.error?.message, 'Close', { duration: 3000 }):this.snackBar.open('An unexpected error occurred, please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  requestReset() {
    if (this.email==''){
      this.snackBar.open('Empty values passed!', 'Close', { duration: 3000 });
      return;
    } 
    this.isProcessing=true;   
    this.http.resetPassword(this.email).subscribe((response: any) => {
      this.isProcessing=false;
      console.log(response.message);
      this.snackBar.open(response.message, 'Close', { duration: 3000 });
      this.router.navigate(['auth'])
    },
      (err: any) => {
        this.isProcessing=false;
        console.error('Error during password reset:', err);
        err?.error?.message?this.snackBar.open(err?.error?.message, 'Close', { duration: 3000 }):this.snackBar.open('An unexpected error occurred, please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  changePassword() {
    if (this.newPassword=='' || this.confirmPassword==''){
      this.snackBar.open('Empty values passed!', 'Close', { duration: 3000 });
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
      return;
    }
    this.isProcessing=true;
    this.changePasswordRequest={resetCode:this.resetRef,password:this.confirmPassword}
    this.http.changePassword(this.changePasswordRequest).subscribe((response: any) => {
      this.isProcessing=false;
      console.log(response.message);
      this.snackBar.open(response.message, 'Close', { duration: 3000 });
      this.switchView('login');
    },
      (err: any) => {
        this.isProcessing=false;
        console.error('Error during password reset:', err);
        err?.error?.message?this.snackBar.open(err?.error?.message, 'Close', { duration: 3000 }):this.snackBar.open('An unexpected error occurred, please try again.', 'Close', { duration: 3000 });
      }
    );
  }

}
