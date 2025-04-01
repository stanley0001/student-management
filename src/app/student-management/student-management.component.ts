import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpService } from '../http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from "../filter/filter.component";
import { Router } from '@angular/router';

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
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    FilterComponent
],
   templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css'
})
export class StudentManagementComponent implements OnInit {

  students: Student[] = [];
  page=0;
  size=20;
  isLoading=false;
  pageSizeOptions=[5,10,20,25,50,100];
  totalPages= 0;
  studentId='';
  class='';
  startDate='';
  endDate='';
  displayedColumns: string[] = ['index', 'name', 'course', 'actions'];
  dataSource = new MatTableDataSource<Student>(this.students);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private http: HttpService,private snackBar: MatSnackBar,private router: Router) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadStudents();
  }
  loadStudents(){
    this.isLoading=true;
    this.http.getStudents(this.page,this.size,this.studentId,this.class,this.startDate,this.endDate).subscribe((response: any) => {
      console.log(response);
      // this.students=response.data;
      this.students = Array.isArray(response.data) ? response.data : [response.data];
      this.totalPages=response.totalPages;
      // this.snackBar.open(response.message, 'Close', { duration: 3000 });
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

  changePageSize(event: Event) {
    // console.log("event",event)
    this.loadStudents();

  }
  nextPage() {
    this.page=this.page+1;
    this.loadStudents();
  }
  prevPage() {
    this.page=this.page-1;
    this.loadStudents();
  }

  editStudent(id: string) {
    this.router.navigate([`dashboard/student/${id}`])
  }

  deleteStudent(index: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.students.splice(index, 1);
    }
  }

  applyFilters($event: any) {
    this.studentId=$event?.studentId;
    this.class=$event?.class;
    this.startDate=$event?.startDate;
    this.endDate=$event?.endDate;
    this.loadStudents();
  }
}
