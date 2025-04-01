import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthComponent } from './auth/auth.component';
import { DataGenerationComponent } from './data-generation/data-generation.component';
import { DataProcessingComponent } from './data-processing/data-processing.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StudentReportComponent } from './student-report/student-report.component';

export const routes: Routes = [
{
    path: 'dashboard',
    component: DashboardComponent,
    children: [
    {
      path: '',
      component: StatisticsComponent
    },
    {
      path: 'student-management',
      component: StudentManagementComponent,
    //   data: { permission: 'CAN_VIEW_STUDENTS' },
    //   canActivate: [PermissionGuard]
     
    },
    { path: 'edit-student/:id', 
      component: StudentManagementComponent,
     
    },
    {
      path: 'users',
      component: UserManagementComponent,
    },
    {
      path: 'profile',
      component: UserProfileComponent
    },
    { path: 'users/:id', 
      component: UserProfileComponent
    },
    { path: 'data-generation', 
      component: DataGenerationComponent
    },
    { path: 'data-processing', 
      component: DataProcessingComponent
    },
    { path: 'file-upload', 
      component: FileUploadComponent
    },
    { path: 'student-management', 
      component: StudentManagementComponent
    },
    { path: 'student-report', 
      component: StudentReportComponent
    },
    { path: '**', redirectTo: '' }
    ]
  },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/reset/:id', component: AuthComponent },
  { path: '**', redirectTo: '/auth' }
];
