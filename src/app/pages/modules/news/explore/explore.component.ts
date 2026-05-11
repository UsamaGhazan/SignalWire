import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ToastrService } from "ngx-toastr";
import { global_pointer } from "src/assets/js/global_config";
import { offset } from "highcharts";

@Component({
  selector: "app-explore",
  templateUrl: "./explore.component.html",
  styleUrls: ["./explore.component.css"],
})
export class ExploreComponent implements OnInit {
  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.origin_country =
      this._Activatedroute.snapshot.paramMap.get("origin_country");

    // this url redirects to right one if origin_country is not present
    if (this.origin === "west_corner" && !this.origin_country) {
      // window.location.hash = "explore/west_corner/afghanistan";
      window.location.hash = "explore/west_corner/west";
    }
  }

  now_time: any = new Date();

  id: any = "";
  origin = "";
  origin_country = "";
  weathers: any = [];
  zSearch = "";

  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  localtime: any = {
    Islamabad: "---, -- --- ---- --:--:-- --",
    "New Delhi": "---, -- --- ---- --:--:-- --",
    Srinager: "---, -- --- ---- --:--:-- --",
    Washington: "---, -- --- ---- --:--:-- --",
  };

  ngOnInit(): void {
    // this.id = this._Activatedroute.snapshot.paramMap.get("id");

    if (this.origin === "west_corner") {
      if (this.data.getCurrentWestTab()) {
        this.origin = "west_corner_iran";
      }
    }
    console.log(this.origin);
    this.getWeather(this.origin);
    this.getTopKeywords();
    this.getTrendingHashtag();
    this.getFlashNews();

    this.getTimes();

    setInterval(() => {
      this.getTimes();
    }, 1000);

    // this.ngxService.start();
    // setTimeout(() => {
    //   this.ngxService.stop();
    // }, 5000);
    // this.getReportNews()
  }

  getWeather(region) {
    this.api.getWeather(region).subscribe({
      next: (data: any) => {
        let w = data?.data;

        if (!w || !Object.entries(w).length) {
          return;
        }

        let weekly_report = w?.days?.map((x) => {
          let date = new Date(x.datetime);
          let day = date?.toDateString()?.split(" ")?.[0];
          return {
            day: day,
            icon: "/assets/weather-icons/colorfull/" + x.icon + ".png",
            text: x.description,
            maxtemp_c: ((x.tempmax - 32) * (5 / 9)).toFixed(1),
            maxtemp_f: x.tempmax.toFixed(1),
            mintemp_c: ((x.tempmin - 32) * (5 / 9)).toFixed(1),
            mintemp_f: x.tempmin.toFixed(1),
            temp_c: ((x.temp - 32) * (5 / 9)).toFixed(1),
            temp_f: x.temp.toFixed(1),
            wind_kph: x.windspeed,
            humidity: x.humidity,
            last_updated: date?.toLocaleTimeString("en", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            city: w.address,
            country:
              region == "east_corner"
                ? "India"
                : region == "west_corner"
                ? "Afghanistan"
                : "Pakistan",
            key: region,
          };
        });

        this.weathers = weekly_report;
      },
      error: (error) => {
        console.log(error, "getWeather error");
      },
    });
  }
  moveNews(id, cat, sub_cat) {
    console.log({ news_id: id, catagory: cat });
    this.api.moveNews(cat, sub_cat, this.origin, id).subscribe((data: any) => {
      if (data.message) {
        this.toastr.success("Catagory updated Successfully");
      }
    });
  }

  getTimeInLocation(timeZone) {
    // Create a new Date object for the current time
    const now = new Date();
    // Create an Intl.DateTimeFormat object with the specified time zone
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    // Format the current date and time in the specified time zone
    const formattedTime = formatter.format(now);
    return formattedTime;
  }

  getTimes() {
    let minute_in_milliseconds = 60000;
    let hour_in_milliseconds = 3.6e6;

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

    // Islamabad Time (GMT+5:00)
    let d_ = new Date(d.getTime());
    let formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["Islamabad"] = formatted;

    // New Delhi Time (GMT+5:30)
    d_ = new Date(d.getTime() + minute_in_milliseconds * 30);
    formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["New Delhi"] = formatted;

    // Srinager Time (GMT+5:30)
    const Beijing = this.getTimeInLocation("Asia/Shanghai");

    this.localtime["Beijing China"] = Beijing;

    // Washington Time (GMT-4:00)
    d_ = new Date(d.getTime() - hour_in_milliseconds * 9);
    formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["Washington"] = formatted;

    // London Time (GMT-4:00)
    const londonTime = this.getTimeInLocation("Europe/London");

    this.localtime["London"] = londonTime;
  }

  getColumns(n) {
    return Math.ceil(n / 2);
  }

  topKeywordsList = [];
  getTopKeywords() {
    this.api.getTopKeywords(this.origin).subscribe({
      next: (data: any) => {
        var res: any = data?.trending_keywords;
        if (res && res.length) {
          for (let i = 0; i < res.slice(0, 8).length; i++) {
            this.topKeywordsList.push(res[i][0]);
          }
        }
      },
      error: (error) => {
        this.ngxService.stop();
      },
    });
  }
  trendingHashtagList = [];
  trendingwordsList = [];
  getTrendingHashtag() {
    this.api.getTrendingHashtag(this.origin).subscribe(
      (data: any) => {
        if (!data?.hashtag?.length && !data?.keywords?.length) {
          return;
        }
        this.trendingHashtagList = data.hashtag;
        this.trendingwordsList = data.keywords;
        console.log("trendingHashtagList ", this.trendingHashtagList);
        console.log("trendingwordsList ", this.trendingwordsList);
      },
      (error) => {
        console.log("getTimes() error:", error);
      }
    );
  }
  flashNewsList = [];
  getFlashNews() {
    this.api.getFlashNews(this.origin).subscribe({
      next: (data: any) => {
        console.log("Flash data ", data);
        var res: any = data?.data;
        if (res && res.length) {
          res.forEach((element, i) => {
            let keywords_ = element?._source?.data?.keywords_hits;
            let desc_ = element?._source?.data?.description;
            let title_ = element?._source?.data?.title;
            let newsFormate = {
              id: element._id,
              source: element._source.source_news,
              title: this.api.highlightWords(title_, keywords_),
              description: this.api.highlightWords(desc_, keywords_),
              news_link: element._source.data.news_link,
              country: element._source.data.country,
              published_date: this.api.formatDate(
                element._source.published_date
              ),
              keywords: keywords_,
              cat_hits: element?._source?.data?.cat_hits,
              image: element?._source?.data?.thumbnail || "",
            };
            if (element?._source?.data?.thumbnail) {
              this.flashNewsList.push(newsFormate);
            }
          });
        }
      },
      error: (error) => {
        this.ngxService.stop();
      },

      complete: () => {
        console.log(this.flashNewsList);
      },
    });
  }
  readMore(linkurl, id, context = "") {
    if (!id && !context) {
      return;
    }
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
  zoomRedirect(linkurl, keyword) {
    if (!keyword) {
      return;
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.origin, keyword])
      )
    );
    window.open(url);
  }
  gotoLink(link, direct: any = "") {
    if (!direct) {
      link = link.includes("http") ? link : "https://" + link;
    } else {
      typeof direct == "object" && direct.stopPropagation();
    }
    window.open(link);
  }

  exploreNews(linkUrl: string, id: number) {
    if (!id) {
      return;
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkUrl, this.origin, id])
      )
    );
    window.open(url);
  }
}
