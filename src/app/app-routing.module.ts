import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from 'src/authGuard/auth-guard.guard';
import { NewsLayoutComponent } from './pages/app-layout/news-layout/news-layout.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';

const routes: Routes = [

  {
    path: '',
    
    children: [
      {
        path: '',
        component:NewsLayoutComponent,
        loadChildren: () =>
          import(`../../src/app/pages/modules/news/news.module`).then(
            (m) => m.NewsModule
          ),
        // canActivate: [AuthGuardGuard]
      }
    ],
  },
  {
    path: 'login',
    
    children: [
      {
        path: '',
        loadChildren: () =>
          import(`../../src/app/pages/modules/login/login.module`).then(
            (m) => m.LoginModule
          ),
        // canActivate: [AuthGuardGuard]
      }
    ],
  },
  {
    path: 'admin',
    
    children: [
      {
        path: '',
        component:AdminLayoutComponent,
        loadChildren: () =>
          import(`../../src/app/pages/modules/admin/admin.module`).then(
            (m) => m.AdminModule
          ),
        // canActivate: [AuthGuardGuard]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
