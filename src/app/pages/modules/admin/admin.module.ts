import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/shared/shared.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllKeywordsComponent } from './all-keywords/all-keywords.component';
import { AllHandlersComponent } from './all-handlers/all-handlers.component';
import { AllYtHandlersComponent } from './all-yt-handlers/all-yt-handlers.component';
import { FilterPipe } from 'src/pipes/filter.pipe';
import { StatusDashboardComponent } from './status-dashboard/status-dashboard.component';


@NgModule({
  declarations: [DashboardComponent, AddUserComponent, AllUsersComponent, AllKeywordsComponent, AllHandlersComponent, AllYtHandlersComponent,FilterPipe, StatusDashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    SharedModule,
    SpinnerModule,
    FormsModule,
    CalendarModule,
    DragDropModule,
    InfiniteScrollModule
  ]
})
export class AdminModule { }
