import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
@Component({
  selector: "app-news-details",
  templateUrl: "./news-details.component.html",
  styleUrls: ["./news-details.component.css"],
})
export class NewsDetailsComponent implements OnInit {
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

  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService
  ) {}

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.newsById();
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000);
    this.getHistoryNews();
  }

  newsById() {
    this.EastNewsList = [];
    this.similarNewsList = [];
    // this.ngxService.start();
    this.is_loading.news = true;
    this.api.newsById(this.origin, this.id).subscribe(
      (data: any) => {
        var res: any = data?.result?.data;
        this.similarNews(data?.similar_data);
        if (res && Object.entries(res).length) {
          let hitkeywords = res.keywords_hits;
          let desx = res.description;
          let title_ = res.title;

          let newsFormate = {
            id: res._id,
            source: res.source,
            title: this.api.highlightWords(title_, hitkeywords),
            description: this.api.highlightWords(desx, hitkeywords),
            news_link: res.news_link,
            published_date: this.api.formatDate(res.published_date),
            country: res.country,
            keywords: hitkeywords,
            image:
              (res?.thumbnail?.includes("pakistantoday.com")
                ? "https://getanainstasuny.osintcenter.org/instagram/index1.php?imagelink=" +
                  res?.thumbnail
                : res?.thumbnail) || "",
          };
          this.EastNewsList = newsFormate;
          if (res.keywords_hits.length) {
            this.relatedNews(res.keywords_hits);
          } else {
            this.is_loading.related = false;
          }
        } else {
          this.is_loading.related = false;
        }
        // this.ngxService.stop();
        this.is_loading.news = false;
      },
      (error) => {
        this.is_loading.related = false;
        this.is_loading.news = false;
        // this.ngxService.stop();
      }
    );
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
  relatedNews(keywords) {
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
      .seacrhKeyword(this.origin, str, "news", trending_, this.id)
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
  summary = "";
  getSummarydata(progress) {
    this.api.getSummary(this.id, this.origin).subscribe((data: any) => {
      if (data?.summary?.includes("in_process")) {
      } else {
        let container = document.querySelector(".progress-container");
        progress.classList.remove("active");
        container.classList.add("d-none");
        clearInterval(this.inter);
        this.summary = data?.summary;
      }
    });
  }
}
