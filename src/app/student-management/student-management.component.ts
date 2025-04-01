import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface Student {
  name: string;
  course: string;
}

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
   templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css'
})
export class StudentManagementComponent implements OnInit {
  students: Student[] = [
    { name: 'John Doe', course: 'Computer Science' },
    { name: 'Jane Smith', course: 'Business Administration' }
  ];

  displayedColumns: string[] = ['index', 'name', 'course', 'actions'];
  dataSource = new MatTableDataSource<Student>(this.students);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addStudent() {
    const newStudent: Student = { name: 'New Student', course: 'Undecided' };
    this.students.push(newStudent);
    this.dataSource.data = [...this.students];
  }

  // editStudent(student: Student) {
  //   const newName = prompt('Edit Student Name:', student.name);
  //   if (newName) student.name = newName;
  //   this.dataSource.data = [...this.students];
  // }

  // deleteStudent(student: Student) {
  //   this.students = this.students.filter(s => s !== student);
  //   this.dataSource.data = [...this.students];
  // }
  editStudent(index: number) {
    const name = prompt('Edit student name:', this.students[index].name);
    const course = prompt('Edit course:', this.students[index].course);
    if (name && course) {
      this.students[index] = { name, course };
    }
  }

  deleteStudent(index: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.students.splice(index, 1);
    }
  }
}
