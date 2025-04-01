import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface StudentReport {
  name: string;
  course: string;
  grade: string;
}

@Component({
  selector: 'app-student-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-report.component.html',
  styleUrl: './student-report.component.css'
})
export class StudentReportComponent {
  studentReports: StudentReport[] = [
    { name: 'John Doe', course: 'Computer Science', grade: 'A' },
    { name: 'Jane Smith', course: 'Business Admin', grade: 'B+' }
  ];
}
