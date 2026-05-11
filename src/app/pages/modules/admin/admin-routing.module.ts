import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllKeywordsComponent } from './all-keywords/all-keywords.component';
import { AllHandlersComponent } from './all-handlers/all-handlers.component';
import { AllYtHandlersComponent } from './all-yt-handlers/all-yt-handlers.component';
import { StatusDashboardComponent } from './status-dashboard/status-dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'adduser',
    component: AddUserComponent,
  },
  {
    path: 'users',
    component: AllUsersComponent,
  },
  {
    path: 'keywords',
    component: AllKeywordsComponent,
  },
  {
    path: 'handler',
    component: AllHandlersComponent,
  },
  {
    path: 'youtube',
    component: AllYtHandlersComponent,
  },
  {
    path: 'status',
    component: StatusDashboardComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
