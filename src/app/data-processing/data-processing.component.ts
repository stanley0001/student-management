import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  processData() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate backend processing (Replace with actual API call)
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = `File "${this.selectedFile?.name}" processed successfully!`;
    }, 2000);
  }
}
