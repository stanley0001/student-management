import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { HttpService } from '../http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Output() searchFilters = new EventEmitter<any>();
  searchForm: FormGroup;
  searchModel = {
    studentId: '',
    class: '',
    startDate: '',
    endDate: ''
  };
  classOptions = [];
  @Input() data: any[]=[];

  constructor(private fb: FormBuilder,private http: HttpService,private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
      studentId: [''],
      class: [''],
      startDate: [''],
      endDate: ['']
    });
  }
  
  ngOnInit() {
    this.loadStudentClasses();
  }
  loadStudentClasses(){
    this.http.getStudentClasses().subscribe((response: any) => {
      console.log(response);
      this.classOptions=response.data;
    },
      (err: any) => {
        err?.error?.message?this.snackBar.open(err?.error?.message, 'Close', { duration: 3000 }):this.snackBar.open('An unexpected error occurred, please try again.', 'Close', { duration: 3000 });
      }
    );
  }
  applyFilters() {
    this.searchFilters.emit(this.searchModel);
  }

  exportToExcel(data: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Report');
    XLSX.writeFile(workbook, 'Student_Report.xlsx');
  }
}
