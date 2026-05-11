import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { CdkDragStart, CdkDragMove } from "@angular/cdk/drag-drop";

interface ReportData {
  bulletPoints: string[];
  keyPeople: string[];
  keyAreas: string[];
}

@Component({
  selector: "app-editorial-details",
  templateUrl: "./editorial-details.component.html",
  styleUrls: ["./editorial-details.component.css"],
})
export class EditorialDetailsComponent implements OnInit {
  editorialList: any = {};
  keywords_list = [];
  relatedNewsList = [];
  similarNewsList = [];
  showHistory = false;
  modalVisiblity = false;
  modalLeft = 0;
  modalTop = 0;
  audioPath: string = ""; // Path of the audio file
  dropdownOptions: string[] = [
    "US Female",
    "US Male",
    "Asian Male",
    "Asian Female",
  ];
  is_loading = {
    news: true,
    related: true,
  };
  id: any = "";
  origin = "";
  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  summaryObj: ReportData;
  selectedOption: string = "Asian Female";
  isDropdownOpen: boolean = false;
  audioPlayed:boolean=false
  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService
  ) {}

  auth_search_keyword = "";

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.newsById();
  }

  newsById() {
    this.editorialList = [];
    this.relatedNewsList = [];
    // this.ngxService.start();
    this.is_loading.news = true;
    this.api.editorialById(this.origin, this.id).subscribe(
      (data: any) => {
        console.log("tango data", data);
        var res: any = data?.data;
        if (data?.related) {
          this.relatedNews(data.related);
        }
        if (res && Object.entries(res).length) {
          let newsFormate = {
            id: res._id,
            source: res.source_news,
            title: this.api.highlightWords(
              res.data?.title,
              res.data?.keywords_hits
            ),
            // description:this.api.highlightWords(res.data?.description, res.data?.keywords_hits),
            description: this.api.makeParagraphs(res.data?.description),
            link: res.data.link,
            country: res.data.country,
            published_date: this.api.formatDate(res?.data?.published_date),
            cat_hits: res.data?.cat_hits,
            image: res.data?.thumbnail || "",
            published_by: res.data?.published_by || "",
            keywords: res.data?.keywords_hits,
            areas: res.data.area_hits?.length
              ? JSON.parse(res.data.area_hits)
              : [],
          };
          console.log(res.data?.description);
          this.editorialList = newsFormate;

          if (this.editorialList.description.split(" ").length < 60) {
            console.log("Left is less then 60");
            window.location.href = this.editorialList.link;
          }
        } else {
          this.is_loading.news = false;
        }
        // this.ngxService.stop();
        this.is_loading.news = false;
        this.is_loading.related = false;
      },
      (error) => {
        this.is_loading.related = false;
        this.is_loading.news = false;
        // this.ngxService.stop();
      }
    );
  }

  toggleDropdown() {
    
    this.isDropdownOpen = !this.isDropdownOpen;

 
  }
  selectOption(option: string) {
    console.log('selectOption called');
    this.selectedOption = option;
    this.isDropdownOpen=false
    this.onOptionChange();
  }
  onOptionChange() {
    this.audioPath = "";
    this.api
      .getNewsEditorialAudio(this.selectedOption, this.summaryObj)
      .subscribe((path: any) => {
        this.audioPath = path;
        console.log(this.audioPath);
      });
  }
  relatedNews(data) {
    if (data && data.length) {
      data.forEach((element) => {
        let hitkeywords = element._source.data.keywords_hits;

        let newsFormate = {
          id: element._id,
          source: element._source.source_news,
          title: this.api.highlightWords(
            element._source?.data?.title,
            element._source?.data?.keywords_hits
          ),
          description: element._source.data.description,
          news_link: element._source.data.link,
          published_date: this.api.formatDate(
            element._source.data.published_date
          ),
          country: element._source.data.country,
          keywords: hitkeywords,
          image: element._source.data.thumbnail || "",
        };
        this.relatedNewsList.push(newsFormate);
      });
    }
  }

  getTimes() {
    let d = new Date();
    this.now_t = d.toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    });
    this.now_d = d.toLocaleDateString("pk", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  showModal() {
    this.audioPath=''
    this.modalVisiblity = !this.modalVisiblity;
    this.selectedOption='Asian Female'
    this.isDropdownOpen=false
  }
  readMore(linkurl, id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.origin, id])
      )
    );
    window.open(url);
  }

  hitDateFormate(date, country) {
    if (this.origin == "internal_security") {
      country = "";
    }
    return this.api.dateFormate(date, country);
  }
  gotoLink(link, event: any = "") {
    event && event.stopPropagation();
    window.open(link, "_blank");
  }
  newsDetails(id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/editorial-details", this.origin, id])
      )
    );
    window.open(url);
  }
  explore(cat) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(["/east_corner", cat]))
    );
    window.open(url);
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
  summary = "";
  getSummarydata(progress = "") {
    console.log("get summary called edit");
    this.modalVisiblity = !this.modalVisiblity;
    console.log("this.origin ", this.origin);

    console.log(this.summary);
    const summaryData = this.parseReport(this.summary);
    this.summaryObj = summaryData;

    let editorial;
    editorial =
      this.origin === "internal_security"
        ? "_editorials"
        : this.origin === "west_corner"
        ? "_afghanistan_editorial"
        : "_editorial";
    console.log("editoriallll ", editorial);
    if (!this.summary) {
      this.ngxService.start();
      console.log(this.origin);
      const newOrigin =
        this.origin == "premium_editorials"
          ? "premium_editorials"
          : this.origin + editorial;
      this.api.getSummary(this.id, newOrigin).subscribe({
        next: (data: any) => {
          this.summary = data?.summary;
        },

        complete: () => {
          this.ngxService.stop();
          const summaryData = this.parseReport(this.summary);
          console.log('summaryData ',summaryData);
          this.summaryObj = summaryData;
          console.log('this.summaryObj ',this.summaryObj );
        },
      });
    }
  }

  onDragStart(event: CdkDragStart) {
    console.log("Drag started:", event);
    // Optionally, adjust initial position or styles
  }

  onDragMove(event: CdkDragMove) {
    const { x, y } = event.source.getFreeDragPosition();
    this.modalLeft += x;
    this.modalTop += y;
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

    return { bulletPoints, keyAreas , keyPeople};
  }
}
