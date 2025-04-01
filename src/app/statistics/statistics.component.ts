import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../count-up.directive';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { Stats } from './stats';
import { LoaderComponent } from '../loader/loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, CountUpDirective,LoaderComponent],
   templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  statsData:Stats=new Stats();
  
  cards = [
    {
      title: 'Students',
      value: this.statsData.students,
      route: '/dashboard/student-management',
      iconClass: 'ni ni-money-coins',
      iconBg: 'bg-gradient-primary shadow-primary',
      permission: 'CAN_VIEW_USERS',
    },
    // {
    //   title: 'Users',
    //   value: this.statsData.users,
    //   route: '/dashboard/users',
    //   iconClass: 'ni ni-single-02',
    //   iconBg: 'bg-gradient-info shadow-info',
    //   permission: 'CAN_VIEW_USERS',
    // },
  ];
  
  isProcessing=false;
  constructor(private router:Router,private http:HttpService,private snackbar:MatSnackBar,@Inject(PLATFORM_ID) private platformId: any){}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isProcessing=true;
    this.http.getDashStats().subscribe((data: any) => {
      // this.statsData = data?.data;
      this.statsData.students = data?.data;
      
      this.cards = [
        {
          title: 'Students',
          value: this.statsData.students,
          route: '/dashboard/student-management',
          iconClass: 'ni ni-money-coins',
          iconBg: 'bg-gradient-primary shadow-primary',
          permission: 'CAN_VIEW_USERS',
        },
        // {
        //   title: 'Users',
        //   value: this.statsData.users,
        //   route: '/dashboard/users',
        //   iconClass: 'ni ni-single-02',
        //   iconBg: 'bg-gradient-info shadow-info',
        //   permission: 'CAN_VIEW_USERS',
        // },
      ];
      this.isProcessing=false;
    },
    (error: any) => {
      this.isProcessing=false;
      console.log("response error",error);
      this.snackbar.open('Response error:'+error.error.message.error.message, 'Close', { duration: 3000 });
    });
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  hasPermission(permission: string): boolean {
    const userPermissions = JSON.parse(sessionStorage.getItem('authorities') || '[]');
    return userPermissions.includes(permission);
  }
}

