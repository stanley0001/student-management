import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Student {
  id: number;          
  studentId: string;
  firstName: string;
  lastName: string;
  dob: string;        
  class: string; 
  score: number;
  status: string;
  photoPath: string;
}

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  student: Student = {} as Student;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: HttpService,  // Your HTTP service for making API calls
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get student ID from route params
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.getStudent(studentId);
    }

    // Initialize the form group
    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      class: ['', Validators.required],
      score: [0, Validators.required],
      status: ["Active", Validators.required],
      photoPath: [''],
    });
  }

  // Fetch student data by ID
  getStudent(id: string): void {
    this.studentService.getStudentById(id).subscribe((response) => {
      this.student = response.data as Student;
      // Populate the form with student data
      this.studentForm.patchValue({
        studentId: this.student.studentId,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        dob: this.student.dob,
        class: this.student.class,
        score: this.student.score,
        status: this.student.status
      });
    });
  }

  // Handle file selection (photo upload)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      this.selectedFile = file;
    } else {
      alert('Invalid file. Only JPEG/PNG files under 5MB are allowed.');
      this.selectedFile = null;
    }
  }

  // Update student data (with optional photo upload)
  updateStudent(): void {
    const formData = new FormData();
    formData.append('studentId', this.studentForm.value.studentId);
    formData.append('firstName', this.studentForm.value.firstName);
    formData.append('lastName', this.studentForm.value.lastName);
    formData.append('dob', this.studentForm.value.dob);
    formData.append('class', this.studentForm.value.class);
    formData.append('score', this.studentForm.value.score);
    formData.append('status', this.studentForm.value.status);

    if (this.selectedFile) {
      const filename = `${this.student.studentId}-${this.selectedFile.name}`;
      formData.append('photo', this.selectedFile, filename);
    }

    // Call the API to update student details
    this.studentService.updateStudent(this.student.id, formData).subscribe(() => {
      alert('Student updated successfully!');
      // Optionally, upload the photo if it's selected
      if (this.selectedFile) {
        this.uploadPhoto();
      }
    });
  }

  // Upload student photo after updating
  uploadPhoto(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('photo', this.selectedFile, this.selectedFile.name);

    this.studentService.uploadStudentPhoto(this.student.id, formData).subscribe(() => {
      alert('Student photo uploaded successfully!');
    });
  }

  // Soft delete the student (mark as inactive)
  deleteStudent(): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.softDeleteStudent(this.student.id).subscribe(() => {
        alert('Student deleted successfully!');
      });
    }
  }
}