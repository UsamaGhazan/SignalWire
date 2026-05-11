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
  errors?: string;
}

@Component({
  selector: "app-youtube-details",
  templateUrl: "./youtube-details.component.html",
  styleUrls: ["./youtube-details.component.css"],
})
export class YoutubeDetailsComponent implements OnInit {
  youtubeData: any = {};
  playlistArray = [];
  relatedArray = [];
  id = "";
  origin = "";
  keyword = "";
  is_loading = {
    youtube: true,
    playlist: true,
    related: true,
  };
  trustedURL: any = "";
  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  isModalVisible: boolean = false;
  isVisible: boolean = true;
  modalVisiblity = false;
  summary = "";
  summaryShow = false;
  summaryObj: ReportData = {
    keyPeople: [],
    keyAreas: [],
    bulletPoints: [],
    errors: "There is an erorr while generating the summary of this news.",
  };
  modalLeft = 0;
  modalTop = 0;
  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private location: Location,
    public data: DataService,
    public _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.youtubeById();
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000);
  }
  secure(link) {
    this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }
  youtubeById() {
    this.is_loading.youtube = true;
    this.is_loading.playlist = true;
    this.is_loading.related = true;
    this.api.youtubeById(this.origin, this.id).subscribe({
      next: (data: any) => {
        var res: any = data;
        if (res && Object.entries(res).length) {
          if (res.data.summary) {
            this.summary = res.data.summary;
          }
          let newsFormate = {
            // id: res.data._id,
            link: res.data.link,
            title: res.data.title,
            desc: res.data?.data?.description
              ? this.api.highlightWords(
                  res.data?.data?.description,
                  res.data?.data?.keywords_hits
                )
              : "",
            published_date: this.api.formatDate(res.data?.data.publishedAt),
            channel_handle: res.data.channel_handle,
            video_id: res.data.video_id,
            keywords: res.data?.data?.keywords_hits,
          };
          this.trustedURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            "https://www.youtube.com/embed/" + res.data.video_id
          );
          this.youtubeData = newsFormate;
          if (res.playlist?.length) {
            this.playListorRelatedData(res.playlist, "playlist");
          }
          if (res.related?.length) {
            this.playListorRelatedData(res.related, "related");
          }
        }

        this.is_loading.youtube = false;
        this.is_loading.playlist = false;
        this.is_loading.related = false;
      },
      error: (error) => {
        this.is_loading.youtube = false;
        this.is_loading.playlist = false;
        this.is_loading.related = false;
      },
    });
  }

  playListorRelatedData(data, type) {
    if (data.length) {
      data.forEach((element) => {
        let newsFormate = {
          id: element._id,
          link: element._source.link,
          title: element._source.title,
          published_date: this.api.formatDate(element._source.published_date),
          channel_handle: element._source.channel_handle,
          video_id: element._source.video_id,
          cat_hits: element._source?.data?.cat_hits,
        };
        if (type == "playlist") {
          this.playlistArray.push(newsFormate);
        } else {
          this.relatedArray.push(newsFormate);
        }
      });
      console.log({ play: this.playlistArray, related: this.relatedArray });
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

  readMore(linkurl, id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.origin, id])
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

  changeVideo(id) {
    // var vid:any=document.querySelector('#f_id')
    // vid.src="https://www.youtube.com/embed/"+id
    window.open("#/youtube-details/" + this.origin + "/" + id, "_self");
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["youtube-details/" + this.origin + "/" + id]);
    });
  }

  // For the summary
  getSummarydata(progress = ""): void {
    const overlay = document.querySelector(".ngx-overlay");
    // overlay.atrr = "";
    this.modalVisiblity = !this.modalVisiblity;
    const summaryData = this.parseReport(this.summary);
    this.summaryObj = summaryData;

    console.log(this.summary);
    // if the summary is not availible......
    if (!this.summary) {
      this.ngxService.start();
      this.api.getSummary(this.id, this.origin, true).subscribe({
        next: (data: any) => {
          this.summary = data?.summary;
        },
        complete: () => {
          this.ngxService.stop();
          const summaryData = this.parseReport(this.summary);
          this.summaryObj = summaryData;
          console.log(summaryData);

          if (
            !this.summaryObj["bulletPoints"].length &&
            !this.summaryObj["keyAreas"].length &&
            !this.summaryObj["keyPeople"].length
          ) {
            this.summaryObj["errors"] =
              "There is no summary because no transcript was availible for this video.";
          }
        },
        error: (error) => {
          console.log("Usama Bin Ghazan");
          console.log(this.summary);
          this.ngxService.stop();
          if (
            !this.summaryObj["bulletPoints"].length &&
            !this.summaryObj["keyAreas"].length &&
            !this.summaryObj["keyPeople"].length
          ) {
            this.summaryObj["errors"] =
              "There is no summary because no transcript was availible for this video.";
          }
        },
      });
    } else {
      // If nothing is availible then
      if (
        !this.summaryObj["bulletPoints"].length &&
        !this.summaryObj["keyAreas"].length &&
        !this.summaryObj["keyPeople"].length
      ) {
        this.summaryObj["errors"] =
          "There is no summary because no transcript was availible for this video.";
      }
    }
  }

  processSummaryText(text: string) {}
  onCloseModal(): void {
    // Handle additional logic when the modal is closed if needed
    this.summaryShow = false;
  }
  open(): void {
    console.log("open called");
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
    // this.closeModal.emit()
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

    return { bulletPoints, keyPeople, keyAreas };
  }

  showModal() {
    this.modalVisiblity = !this.modalVisiblity;
  }
}
