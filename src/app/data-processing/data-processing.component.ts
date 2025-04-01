import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-processing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-processing.component.html',
  styleUrl: './data-processing.component.css'
})
export class DataProcessingComponent {
  selectedFile: File | null = null;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private http: HttpService,private snackBar: MatSnackBar) {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  processData(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    let processId="1";
    this.http.processDataToCvs(processId).subscribe((response: any) => {
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
