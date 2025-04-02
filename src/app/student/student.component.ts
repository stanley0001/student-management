import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

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
  studentPhoto={}

  constructor(
    private fb: FormBuilder,
    private studentService: HttpService, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.getStudent(studentId);
    }
    // this.student.photoPath="C:\var\log\applications\API\StudentPhotos\1_pa.png";

    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      class: ['', Validators.required],
      score: [0, Validators.required],
      status: ["Active", Validators.required],
      photoPath: '',
    });
  }

  getStudent(id: string): void {
    this.studentService.getStudentById(id).subscribe((response) => {
      this.student = response.data as Student;
      this.studentForm.patchValue({
        id: this.student.studentId,
        studentId: this.student.studentId,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        dob: this.student.dob,
        class: this.student.class,
        score: this.student.score,
        status: this.student.status,
        photoPath: this.student.photoPath
      });
      this.loadFile(this.student.photoPath)
    });
  }

  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      this.selectedFile = file;
      console.log("uploading file ")
      this.uploadPhoto();
    } else {
      alert('Invalid file. Only JPEG/PNG files under 5MB are allowed.');
      this.selectedFile = null;
    }
  }

  updateStudent(): void {
    const formData = new FormData();
    formData.append('id', this.studentForm.value.studentId);
    formData.append('studentId', this.studentForm.value.studentId);
    formData.append('firstName', this.studentForm.value.firstName);
    formData.append('lastName', this.studentForm.value.lastName);
    formData.append('dob', this.studentForm.value.dob);
    formData.append('class', this.studentForm.value.class);
    formData.append('score', this.studentForm.value.score);
    formData.append('status', this.studentForm.value.status);
    formData.append('photoPath', this.studentForm.value.photoPath);
    //Use new path to update the file or update with student details
    // if (this.selectedFile) {
    //   const filename = `${this.student.studentId}-${this.selectedFile.name}`;
    //   formData.append('photo', this.selectedFile, filename);
    // }
    

    this.studentService.updateStudent(this.studentForm.value.studentId, formData).subscribe(() => {
      alert('Student updated successfully!');
      //upload the photo if it's selected
      // if (this.selectedFile) {
      //   this.uploadPhoto();
      // }
    });
  }

  uploadPhoto(): void {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.studentService.uploadStudentPhoto(this.studentForm.value.studentId, formData).subscribe((response) => {
      console.log("response",response)
      this.studentForm.value.photoPath=response.data;
      alert('Student photo uploaded successfully!');
    });
  }

  loadFile(path:String){
    this.studentService.loadStudentPhoto(this.studentForm.value.photoPath).subscribe((response) => {
      // console.log("response",response)
      // this.studentPhoto=response;
      this.studentPhoto = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
    });
  }
    

  deleteStudent(): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.softDeleteStudent(this.studentForm.value.studentId).subscribe(() => {
        alert('Student deleted successfully!');
      });
    }
  }
}