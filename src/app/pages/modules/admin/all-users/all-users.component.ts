import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DataService } from "src/service/data.service";
import { NewsService } from "src/service/news.service";
import Swal from "sweetalert2";
import { global_pointer } from "src/assets/js/global_config";

// import * as jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { offset } from "highcharts";
@Component({
  selector: "app-all-users",
  templateUrl: "./all-users.component.html",
  styleUrls: ["./all-users.component.css"],
})
export class AllUsersComponent implements OnInit {
  @ViewChild("table", { static: false }) table: ElementRef;
  allusersList = [];
  originalUsersList=[]
  edit_flag = false;
  searchtext = "";
  sortAsending: boolean = true;
  sort24hrs: boolean = true;
  csvPath:string=''
  ip: string = global_pointer.newsIp;
  logCount: number;

  constructor(
    private api: NewsService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllUser();
    $("#editModal").on("hidden.bs.modal", () => {
      this.edit_flag = false;
      if (document.body.classList.contains("news-modal-true")) {
        this.getAllUser();
        document.body.classList.remove("news-modal-true");
      }
    });
    this.api.getCsvFile().subscribe((file:any)=>this.csvPath=file.csv_path)
  }
  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    // Options for formatting the date and time
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Format the date and time separately
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    // Combine date and time without "at"
    return `${formattedDate} ${formattedTime}`;
  }
  downloadCSV(): void {
    if (!this.csvPath) {
      console.error('CSV path not available');
      return;
    }
  
    // Extract filename from full path
    // const filename = this.csvPath.split('\\').pop(); // "user_data.csv"
  
    // Build the full URL (assuming backend serves it at /downloads/)
    const url = `${this.ip}static/generated_speech/${this.csvPath}`;
  
    // Trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = this.csvPath;
    link.click();
  }
  generatePdf() {
    const pdf: any = new jsPDF();

    // Define columns
    const columns = ["Sr", "Date", "Page", "Category", "Action", "Path"];

    // Create rows data
    const rows = this.reportlogs.map((obj, i) => [
      i + 1,
      obj.timestamp,
      obj.message.page,
      obj.message.category || "--",
      obj.message?.id
        ? obj.message?.id?.includes(" ") || obj.message?.id?.length < 20
          ? obj.message?.id
          : "Visit Link"
        : "--",
      obj.message.path.length > 10
        ? obj.message.path.slice(0, 10) + "..."
        : obj.message.path,
    ]);

    // Add header row
    const header = [columns];

    // Set up autoTable options
    const options = {
      head: header,
      body: rows,
      startY: 20, // Adjust startY position as needed
    };

    // Add autoTable to PDF
    pdf.autoTable(options);

    // Save PDF
    pdf.save("history.pdf");
  }

  getAllUser() {
    this.ngxService.start();
    this.api.getAllUser().subscribe(
      (data: any) => {
        if (data?.data) {
          this.allusersList = data.data;
          this.originalUsersList=data.data 
          this.logCount=this.originalUsersList.reduce((acc,curr)=>{
            let sum=acc+curr.log_count
            return sum
          },0)
          console.log("userdatax ", this.allusersList);
          console.log(this.logCount);
          this.ngxService.stop();
        }
      },
      (error) => {
        this.ngxService.stop();
        console.log(error.error.message);
        this.toastr.error(error.error.message);
      }
    );
  }

  sortData() {
    if (this.sortAsending) {
      // Desending order... latest login first
      this.allusersList = this.originalUsersList.sort(
        (a, b) =>
          Number(b.last_login_time_stamp) - Number(a.last_login_time_stamp)
      );
    } else {
      // oldest login first
      this.allusersList = this.originalUsersList.sort(
        (a, b) =>
          Number(a.last_login_time_stamp) - Number(b.last_login_time_stamp)
      );
    }

    this.sortAsending = !this.sortAsending;
  }
  sortDataby24hrs(){
    if (this.sort24hrs) {
      // Desending order... latest login first
      this.allusersList = this.originalUsersList.sort(
        (a, b) =>
          b.log_count -a.log_count
      );
    } else {
      // oldest login first
      this.allusersList = this.originalUsersList.sort(
        (a, b) =>
        a.log_count - b.log_count
      );
    }

    this.sort24hrs = !this.sort24hrs;
  }
  deleteUser(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to delete?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.api.deleteUser(id).subscribe(
          (data: any) => {
            if (data?.message.includes("successfully")) {
              this.toastr.success("Deleted Successfully");
              this.getAllUser();
            }
          },
          (error) => {
            this.ngxService.stop();
            console.log(error.error.message);
            this.toastr.error(error.error.message);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  modalList = [];
  updateUser(rec) {
    this.edit_flag = true;
    this.modalList = [];
    this.modalList.push(rec);
    ($("#editModal") as any).modal("show");
    // this.api.deleteUser(id).subscribe(
    //   (data: any) => {
    //   if(data?.data){
    //     this.allusersList=data.data
    //   }
    //   })
  }
  logsData = {
    activity: [],
    user: null,
  };
  logs_flag: any = false;
  offset = 1;
  onscrolllog() {
    this.offset++;
    this.getLogsoffset(this.logsData["user"], true);
  }
  getLogsoffset(user, offset = false) {
    this.logsData["user"] = user;
    this.logs_flag = true;
    if (!offset) {
      this.logsData["activity"] = [];
      this.offset = 1;
    }
    this.api.getLogsoffset(user.id, this.offset).subscribe(
      (data: any) => {
        this.logs_flag = false;
        data = data?.data;
        if (data && Object.entries(data).length) {
          data.forEach((x) => {
            let msg = JSON.parse(decodeURIComponent(x.message));
            msg["path"] = msg.path.includes("#") ? msg.path : "#" + msg.path;
            x["timestamp"] = this.api.formatDate(
              new Date(x.timestamp * 1000).toString()
            );
            x["message"] = msg;
            this.logsData["activity"].push(x);
          });
        }
      },
      (error) => {
        console.log("error", error);
        this.logs_flag = false;
      }
    );
  }
  reportlogs = [];
  getLogs() {
    this.reportlogs = [];
    this.api.getLogs(this.logsData["user"].id).subscribe(
      (data: any) => {
        this.logs_flag = false;
        data = data?.data;
        if (data && Object.entries(data).length) {
          this.reportlogs = data.map((x) => {
            let msg = JSON.parse(decodeURIComponent(x.message));
            msg["path"] = msg.path.includes("#") ? msg.path : "#" + msg.path;
            x["timestamp"] = this.api.formatDate(
              new Date(x.timestamp * 1000).toString()
            );
            x["message"] = msg;
            return x;
          });
          setTimeout(() => {
            this.generatePdf();
          }, 200);
        }
      },
      (error) => {
        console.log("error", error);
        this.logs_flag = false;
      }
    );
  }

  toggleUserStatus(event, id) {
    console.log("called");
    if (event.target.checked) {
      this.api.toggleUserStatus(id, true).subscribe((data: any) => {
        console.log("user enabled ", data);
      });
    } else {
      this.api.toggleUserStatus(id, false).subscribe((data: any) => {
        console.log("user disabled ", data);
      });
    }
  }

  updateOTPStatus(event, id) {
    console.log("called");
    if (event.target.checked) {
      this.api.updateOTPStatus(id, true).subscribe((data: any) => {
        console.log("OTP enabled ", data);
      });
    } else {
      this.api.updateOTPStatus(id, false).subscribe((data: any) => {
        console.log("OTP disabled ", data);
      });
    }
  }
}
