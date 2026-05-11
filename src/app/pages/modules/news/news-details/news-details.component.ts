import { Component, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { CommonModule, Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { CdkDragStart, CdkDragMove } from "@angular/cdk/drag-drop";
import { ReportData } from "src/service/interfaces";
@Component({
  selector: "app-news-details",
  templateUrl: "./news-details.component.html",
  styleUrls: ["./news-details.component.css"],
})
export class NewsDetailsComponent implements OnInit {
  dropdownOptions: string[] = [
    "US Female",
    "US Male",
    "Asian Male",
    "Asian Female",
  ];
  selectedOption: string = "Asian Female";

  EastNewsList: any = {};
  keywords_list = [];
  relatedNewsList = [];
  similarNewsList = [];
  showHistory = false;
  is_loading = {
    news: true,
    related: true,
    history: true,
  };
  id: any = "";
  origin = "";
  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  cat_hits: string;
  summaryShow = false;
  currentTab: number;
  iran: boolean;
  isModalVisible: boolean = false;
  isVisible: boolean = true;
  modalVisiblity = false;
  summary = "";
  summaryObj: ReportData;
  modalLeft = 0;
  modalTop = 0;
  isLoading: boolean = false;
  audioPath: string = ""; // Path of the audio file
  isDropdownOpen: boolean = false;
  audioPlayed:boolean=false

  constructor(
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService
  ) {}
  ngOnInit(): void {
    this.currentTab = this.data.getCurrentWestTab();
    // if (history.state && history.state.cat_hits !== undefined) {
    //   this.cat_hits = history.state.cat_hits;
    // }
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.newsById();
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000);
    this.getHistoryNews();
  }



  toggleDropdown() {
    
    this.isDropdownOpen = !this.isDropdownOpen;

    
}
  selectOption(option: string) {

    // if( this.selectedOption===option && this.audioPath){
    //   return
    // }
    
    this.selectedOption = option;
    this.isDropdownOpen=false
    this.onOptionChange();
  }
  toggleModal() {
    this.audioPath=''
    this.modalVisiblity = !this.modalVisiblity;
    this.selectedOption='Asian Female'
    this.isDropdownOpen=false
  }
 isAudioLoading = false;

onOptionChange() {
  console.log("Selected option:", this.selectedOption);
  console.log("news to audio ", this.summary);

  this.audioPath = '';
  this.isAudioLoading = true;

  this.api
    .getNewsEditorialAudio(this.selectedOption, this.summaryObj)
    .subscribe({
      next: (path: any) => {
        this.audioPath = path;
      },
      error: () => {
        this.isAudioLoading = false;
      }
    });
}

  newsById() {
    this.EastNewsList = [];
    this.similarNewsList = [];
    this.is_loading.news = true;
    this.api.newsById(this.origin, this.id).subscribe({
      next: (data: any) => {
        var res: any = data?.result?.data;
        const parentIds = [];
        // If the similar news exist and length is greater then 0
        if (data?.similar_data && data.similar_data.length > 0) {
          const similarNews = data.similar_data;
          // Filtering the news to only get the news
          const filterSimilarNews = similarNews.filter((news) => {
            const parentIdExist = parentIds.includes(news.parent_id);
            console.log(parentIdExist);
            if (!parentIdExist) {
              console.log("Parent Id doesnt exist", news.parent_id);
              parentIds.push(news.parent_id);
              return true;
            }
            return false;
          });
          this.similarNews(filterSimilarNews);
        }
        if (res && Object.entries(res).length) {
          let hitkeywords = res.keywords_hits;
          let desx = res.description;
          let title_ = res.title;
          let newsFormate = {
            sub_cat_hits: res.sub_cat_hits,
            id: res._id,
            source: res.source,
            title: this.api.highlightWords(title_, hitkeywords),
            // description: this.api.highlightWords(desx, hitkeywords),
            description: this.convertToParagraphs(desx),
            news_link: res.news_link,
            published_date: this.api.formatDate(res.published_date),
            country: res.country,
            keywords: hitkeywords,
            image:
              (res?.thumbnail?.includes("pakistantoday.com")
                ? "https://getanainstasuny.osintcenter.org/instagram/index1.php?imagelink=" +
                  res?.thumbnail
                : res?.thumbnail) || "",
            summary: data?.result?.summary,
          };
          this.summary = data?.result?.summary;
          console.log(data?.result?.summary);
          this.EastNewsList = newsFormate;
          this.relatedNews(res.keywords_hits, res.sub_cat_hits, res.cat_hits);
        } else {
          this.is_loading.related = false;
        }
        // this.ngxService.stop();
        this.is_loading.news = false;
      },
      error: (error) => {
        this.is_loading.related = false;
        this.is_loading.news = false;
        // this.ngxService.stop();
      },
    });
  }
  convertToParagraphs(text, maxSentences = 5) {
    console.log("input text ", text);
    const doc = (window as any).nlp(text);
    console.log("doc ", doc);
    const sentences = doc.sentences().out("array");
    console.log("Sentences:", sentences);

    const paragraphs = [];
    let currentParagraph = "";
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence + " ";
      if ((index + 1) % maxSentences === 0 || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
    });
    console.log("pargraphs ", paragraphs);
    return paragraphs.join("<br><br>");
  }

  similarNews(data) {
    if (data && data.length) {
      data.forEach((element) => {
        let hitkeywords = element._source.data.keywords_hits;
        let desx = element._source.data.description;
        let title_ = element._source.data.title;
        let newsFormate = {
          id: element._id,
          source: element._source.source_news,
          title: this.api.highlightWords(title_, hitkeywords),
          description: this.api.highlightWords(desx, hitkeywords),
          news_link: element._source.data.news_link,
          published_date: this.api.formatDate(
            element._source.data.published_date
          ),
          country: element._source.data.country,
          keywords: hitkeywords,
          image: element._source.data.thumbnail || "",
        };
        this.similarNewsList.push(newsFormate);
      });
    }
  }
  NewsHistoryList = [];
  getHistoryNews() {
    this.NewsHistoryList = [];
    this.is_loading.history = true;
    this.api.fetch_historical_data(this.origin, this.id).subscribe(
      (data: any) => {
        this.is_loading.history = false;
        var res: any = data?.historical_news;
        if (res && res.length) {
          res.forEach((element, i) => {
            let newsFormate = {
              title: element.title,
              description: element.short_description,
              news_link: element.link,
              published_date: "",
              // keywords: element.keywords?.split(','),
            };
            this.NewsHistoryList.push(newsFormate);
          });
        }
        // this.ngxService.stop();
      },
      (error) => {
        // this.ngxService.stop();
        this.is_loading.history = false;
      }
    );
  }
  relatedNews(keywords, subCat, cat) {
    var str = "";
    var trending_ = false;
    keywords.forEach((element) => {
      str += element + ",";
    });
    str = str.replace(/(\s*,?\s*)*$/, "");
    str = str;
    // this.ngxService.start();
    this.is_loading.related = true;
    this.relatedNewsList = [];
    this.api
      .seacrhKeyword(this.origin, str, "news", trending_, this.id, cat, subCat)
      .subscribe(
        (data: any) => {
          var res: any = data.data;
          if (res) {
            res.forEach((element) => {
              let hitkeywords = element._source.data.keywords_hits;
              let desx = element._source.data.description;
              let title_ = element._source.data.title;
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, hitkeywords),
                description: this.api.highlightWords(desx, hitkeywords),
                news_link: element._source.data.news_link,
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
          this.is_loading.related = false;
          // this.ngxService.stop();
        },
        (error) => {
          this.is_loading.related = false;
          // this.ngxService.stop();
        }
      );
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
        this.router.createUrlTree(["/news-details", this.origin, id])
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

  getSummarydata(progress = ""): void {
    const overlay = document.querySelector(".ngx-overlay");
    // overlay.atrr = "";
    this.modalVisiblity = !this.modalVisiblity;
    const summaryData = this.parseReport(this.summary);
    this.summaryObj = summaryData;
    console.log(summaryData);

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
  isTouchDevice(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
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

  
}
