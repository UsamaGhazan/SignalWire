import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./pages/components/footer/footer.component";
import { AuthGuardGuard } from "src/authGuard/auth-guard.guard";
import { AuthInterceptorInterceptor } from "src/service/auth-interceptor.interceptor";
import { CarouselModule } from "primeng/carousel";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/shared/shared.module";
import { NewsLayoutComponent } from './pages/app-layout/news-layout/news-layout.component';
import { NewsHeaderComponent } from './pages/components/news-header/news-header.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MoveContextMenuComponent } from './pages/components/move-context-menu/move-context-menu.component';
import { CalendarModule } from "primeng/calendar";
import { ReportComponent } from "./pages/report/report.component";
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminModule } from "./pages/modules/admin/admin.module";
import { SummaryModalComponent } from './summary-modal/summary-modal.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportHistoryModalComponent } from './report-history-modal/report-history-modal.component';
import { PasswordModalComponent } from './pages/components/password-modal/password-modal.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    FooterComponent,
    NewsLayoutComponent,
    NewsHeaderComponent,
    MoveContextMenuComponent,
    AdminLayoutComponent,
    SummaryModalComponent,
    ReportListComponent,
    ReportHistoryModalComponent,
    PasswordModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    HttpClientModule,
    SharedModule,
    CarouselModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    CalendarModule,
    BrowserAnimationsModule,
    
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: "toast-bottom-right",
    }),
       MatDialogModule,         // <-- Add this
    MatFormFieldModule,      // <-- Add this
    MatInputModule,          // <-- Add this
    MatButtonModule  
  ],
  // schemas: [ NO_ERRORS_SCHEMA],
  providers: [
    { provide: AuthGuardGuard, useClass: AuthGuardGuard },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
