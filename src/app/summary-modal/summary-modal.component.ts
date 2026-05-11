import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";

interface ReportData {
  bulletPoints: string[];
  keyPeople: string[];
  keyAreas: string[];
}

@Component({
  selector: "app-summary-modal",
  templateUrl: "./summary-modal.component.html",
  styleUrls: ["./summary-modal.component.css"],
})
export class SummaryModalComponent implements OnInit {
  @Input() modalVisiblity :boolean;
  @Input() id: string = "";
  @Input() origin:string=""

  summary: string = "";
  summaryObj: ReportData;
  isVisible: boolean = true;
 
  constructor( private ngxService: NgxUiLoaderService,    public api: NewsService
  ) {}
  ngOnInit(): void {
    console.log('Summary Modal Working')
  }
  showModal() {
    this.modalVisiblity = !this.modalVisiblity;
  }
  inter: any = "";
  pwith = 5;
  summaryFlag = false;
  getSummary(id, progress) {
    progress.classList.add("active");
    let container = document.querySelector(".progress-container");
    container.classList.remove("d-none");
    this.inter = setInterval(() => {
      if (this.pwith < 90) {
        this.pwith += 10;
      }
      this.getSummarydata(progress);
    }, 6000);
  }
  getSummarydata(progress = ""): void {
    const overlay = document.querySelector(".ngx-overlay");
    // overlay.atrr = "";
    this.modalVisiblity = !this.modalVisiblity;
    console.log(this.summary);
    const summaryData = this.parseReport(this.summary);
    this.summaryObj = summaryData;

    if (!this.summary) {
      this.ngxService.start();
      this.api.getSummary(this.id, this.origin).subscribe({
        next: (data: any) => {
          this.summary = data?.summary;
        },

        complete: () => {
          this.ngxService.stop();
          const summaryData = this.parseReport(this.summary);
          this.summaryObj = summaryData;
          console.log(summaryData);
        },
      });
    }
  }

  parseReport(text: string): ReportData {
    const bulletPoints: string[] = [];
    const keyPeople: string[] = [];
    const keyAreas: string[] = [];

    // Split text into lines
    const lines = text.split("\n").map((line) => line.trim());

    // Flags to indicate which section is being processed
    let currentSection: "bulletPoints" | "keyPeople" | "keyAreas" | null = null;

    // Iterate through each line to categorize them
    lines.forEach((line) => {
      if (line.startsWith("•")) {
        currentSection = "bulletPoints";
        bulletPoints.push(line.slice(1).trim());
      } else if (line.startsWith("*")) {
        if (currentSection === "keyPeople") {
          keyPeople.push(line.slice(1).trim());
        } else if (currentSection === "keyAreas") {
          keyAreas.push(line.slice(1).trim());
        }
      } else if (line.toLowerCase().includes("key people")) {
        currentSection = "keyPeople";
      } else if (line.toLowerCase().includes("key areas")) {
        currentSection = "keyAreas";
      }
    });

    return { bulletPoints, keyPeople, keyAreas };
  }
}
