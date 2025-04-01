import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-generation',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './data-generation.component.html',
  styleUrl: './data-generation.component.css'
})

export class DataGenerationComponent {
    recordCount: number = 0;
    isLoading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
    constructor(private http: HttpService,private snackBar: MatSnackBar) {}
  
    generateData() {
      //TODO handle 0 record request
      // if (this.recordCount <= 0) {
      //   alert('Please enter a valid number of records.');
      //   return;
      // }
  
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
  
     // Call the API to generate data
     this.http.generateData(this.recordCount).subscribe((response: any) => {
      console.log(response);
      this.snackBar.open(response.message, 'Close', { duration: 3000 });
      // this.successMessage=response.message;
      //Handle success here
      this.isLoading=false;
    },
      (err: any) => {
        this.isLoading=false;
        err?.error?.message?this.snackBar.open(err?.error?.message, 'Close', { duration: 3000 }):this.snackBar.open('An unexpected error occurred, please try again.', 'Close', { duration: 3000 });
      }
    );
    }
  }