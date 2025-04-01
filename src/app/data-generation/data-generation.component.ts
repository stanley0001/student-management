import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  
    // Mock service call to simulate data generation
    generateData() {
      if (this.recordCount <= 0) {
        alert('Please enter a valid number of records.');
        return;
      }
  
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
  
      // Call the API to generate data (replace with actual backend service)
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = `${this.recordCount} student records generated successfully!`;
      }, 2000);
    }
  }