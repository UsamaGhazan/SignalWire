import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NewsService } from "src/service/news.service";
import { ScrapperStatus } from "src/service/interfaces";

@Component({
  selector: "app-status-dashboard",
  templateUrl: "./status-dashboard.component.html",
  styleUrls: ["./status-dashboard.component.css"],
})
export class StatusDashboardComponent implements OnInit, OnDestroy {
  @ViewChild("regionSelect", { static: true })
  regionSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild("typeSelect", { static: true })
  typeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild("switch", { static: false }) switch!: ElementRef;
  intervalId: any;

  constructor(public api: NewsService) {}

  scrapperStatusList: ScrapperStatus[] = [];
  originalList: ScrapperStatus[] = [];
  regionFilter: string = "";
  typeFilter: string = "";
  errorCount: number = 0;
  runningCount: number = 0;
  ngOnInit(): void {
    this.getScrapperStatus();
    // interval for 10 minutes
    this.intervalId = setInterval(() => {
      this.getScrapperStatus();
      this.regionSelect.nativeElement.value = "";
      this.typeSelect.nativeElement.value = "";
      this.switch.nativeElement.checked = true;
    }, 1800000);
  }

  removeChecked() {
    this.switch.nativeElement.checked = false;
  }

  getScrapperStatus() {
    this.regionFilter = "";
    this.typeFilter = "";
    this.api.getScrapperStatus().subscribe((response: any) => {
      this.originalList = response.data;
      this.showErrors();
      this.errorCount = this.originalList.filter(
        (itm) => itm.status === "error"
      ).length;
      this.runningCount = this.originalList.length - this.errorCount;
    });
  }
  updateCount() {
    console.log("updatecount called ", this.scrapperStatusList);
    this.errorCount = this.scrapperStatusList.filter(
      (itm) => itm.status === "error"
    ).length;
    this.runningCount = this.scrapperStatusList.length - this.errorCount;
  }
  filterRegion(event: any) {
    this.removeChecked();
    this.regionFilter = event.target.value;

    if (this.typeFilter) {
      this.scrapperStatusList = this.originalList.filter(
        (item) =>
          item.category === this.regionFilter && item.type === this.typeFilter
      );
    } else {
      this.scrapperStatusList = this.originalList.filter(
        (item) => item.category === this.regionFilter
      );
    }
    console.log("filterdList ", this.scrapperStatusList);
    this.updateCount();
  }
  filterType(event: any) {
    this.removeChecked();

    this.typeFilter = event.target.value;

    // If both filters are 'all', reset to the original list
    if (
      this.typeFilter === "all" &&
      (!this.regionFilter || this.regionFilter === "all")
    ) {
      this.scrapperStatusList = this.originalList;
      return;
    }

    this.scrapperStatusList = this.originalList.filter((item) => {
      const typeMatch =
        this.typeFilter === "all" || item.type === this.typeFilter;
      const regionMatch =
        !this.regionFilter ||
        this.regionFilter === "all" ||
        item.category === this.regionFilter;
      console.log(
        "this.typeFilter ",
        this.typeFilter,
        " item.type ",
        item.type,
        " typeMatch ",
        typeMatch
      );
      return typeMatch && regionMatch;
    });

    console.log("Filtered List: ", this.scrapperStatusList);
    this.updateCount();
  }

  onToggle(event: any) {
    if (event.target.checked) {
      this.showErrors();
      return;
    }
    // Initialize scrapperStatusList as the originalList
    let filteredList = this.originalList;
    // Apply region filter if it's set and not 'all'
    if (this.regionFilter && this.regionFilter !== "all") {
      filteredList = filteredList.filter(
        (itm) => itm.category === this.regionFilter
      );
    }
    // Apply type filter if it's set and not 'all'
    if (this.typeFilter && this.typeFilter !== "all") {
      filteredList = filteredList.filter((itm) => itm.type === this.typeFilter);
    }

    // Update scrapperStatusList with the filtered result
    this.scrapperStatusList = filteredList;
    console.log("scrapperStatusList ", this.scrapperStatusList);
    this.errorCount = this.scrapperStatusList.filter(
      (itm) => itm.status === "error"
    ).length;
    console.log(this.errorCount);
  }

  // showError()
  showErrors() {
    this.scrapperStatusList = this.originalList.filter((itm) => {
      const matchesRegion = this.regionFilter
        ? itm.category === this.regionFilter
        : true;
      const matchesType = this.typeFilter ? itm.type === this.typeFilter : true;
      return itm.status === "error" && matchesRegion && matchesType;
    });
  }

  convertDateFormat(input: string): string {
    if(input){

      const date = new Date(input);
    
      // Extract hours, minutes, seconds with leading zeros
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
    
      // Time part
      const timePart = `${hours}${minutes}${seconds}`;
    
      // Month abbreviation
      const monthAbbr = date.toLocaleString('en-US', { month: 'short' });
    
      // Day of month
      const day = String(date.getDate()).padStart(2, '0');
    
      // Combine all parts
      return `${timePart} ${monthAbbr} ${day}`;
    }else{
      return 'Data not inserted'
    }
  }
  
  capitalizeFirstLetter(input: string): string {
    return input
      .split(" ")
      .map((word) => {
        if (word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word; // Return empty string if the word is empty
      })
      .join(" ");
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetFilter() {
    this.removeChecked();
    this.scrapperStatusList = this.originalList;
    this.errorCount = this.scrapperStatusList.filter(
      (itm) => itm.status === "error"
    ).length;
    this.runningCount = this.scrapperStatusList.length - this.errorCount;
    this.regionSelect.nativeElement.value = "";
    this.typeSelect.nativeElement.value = "";
    this.regionFilter = "";
    this.typeFilter = "";
  }
}
