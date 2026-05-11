import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ToastrService } from "ngx-toastr";
import { global_pointer } from "src/assets/js/global_config";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit {
  @Input() origin: string;
  currentWestTab = this.data.getCurrentWestTab();
  report_format: any = "pdf";
  u_id: string = "";
  NewsList_report: any = {
    // mil: [],
    // intl: [],
    // iiojk: [],
    // domestic: []
  };
  tweetList_report: any = {
    // mil: [],
    // intl: [],
    // iiojk: [],
    // domestic: []
  };
  loader_flag = {
    report: false,
  };
  keyword = {
    report: "",
  };
  Dates = {
    report: "current",
  };
  trending_flag = {
    report: false,
  };

  data_limit: any = 50;
  for_all = "";

  catsArr =[]
  // Temporary array for changing cats for west corner
  catsArr_Afg_Temp = [
    "international_env",
    "diplo",
    "pak_corner",
    // "india_corner",
    "x_hair",
  ];

  catsArr_Iran_Temp = [
    "iran_internal_env",
    "iran_diplo",
    "iran_pak_corner",
    // "iran_india_corner",
    "iran_x_hair",
  ];

  s_id: any = "";

  getCatNameId(catName: string) {
    return catName.replace(" ", "_");
  }
  constructor(
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService,
    private cdr: ChangeDetectorRef
  ) {


  }

  ngOnInit(): void {
    console.log('gcgcgc');
    if (this.origin == "east_corner") {
      this.for_all = "army,international,kashmir,domestic";
    } else if (this.origin == "internal_security") {
      this.for_all = "govt,polparties,is,military,diplomat";
    } else if (this.data.currentWestTab == 1 || this.data.currentWestTab == 0) {
      // Afg
      if(this.data.currentWestTab == 0){
      this.for_all =
                "dom_env,diplo_econ,mil,is_tsm";
      }else{
        this.for_all =
          "Internal_Envmt,Diplo_Overtures,Terrorist_Groups,X-Hairs";

      }
    }
    setTimeout(() => {
      this.s_id = this.api.getCookie("session  ");
      console.log("session ", this.s_id);
    }, 2000);

    // this.getSessionId();

    // this.getReportNews()
    // this.getReportTweets()
  
  }

  // getSessionId() {
  //   const sessionId = this.cookieService.get('session');  // Replace 'sessionId' with the name of your session ID cookie
  //   console.log('sessionId ',sessionId);
  // }
  setAfgIranCatsArr(){
      this.catsArr=this.data.getCurrentWestTab()===0?["dom_env","diplo_econ","mil","is_tsm"]: [
    "Internal_Envmt",
    "Diplo_Overtures",
    "Terrorist_Groups",
     
    "X-Hairs",
  ];
  }
  getReportNews() {
    this.setAfgIranCatsArr()
    if (this.origin == "east_corner") {
      this.NewsList_report["mil"] = [];
      this.NewsList_report["intl"] = [];
      this.NewsList_report["iiojk"] = [];
      this.NewsList_report["domestic"] = [];
    } else if (this.origin == "internal_security") {
      this.NewsList_report["govt"] = [];
      this.NewsList_report["polparties"] = [];
      this.NewsList_report["is"] = [];
      this.NewsList_report["military"] = [];
      this.NewsList_report["diplomat"] = [];
    } else if (
      // this.origin == "west_corner" ||
      // this.origin == "west_corner_iran"
      this.data.currentWestTab == 1 ||
      this.data.currentWestTab == 0
    ) {
      if(this.data.currentWestTab == 0){
        this.NewsList_report["dom_env"] = [];
        this.NewsList_report["diplo_econ"] = [];
        this.NewsList_report["mil"] = [];
        this.NewsList_report["is_tsm"] = [];

      }else{

        this.NewsList_report["Internal_Envmt"] = [];
        this.NewsList_report["Diplo_Overtures"] = [];
        this.NewsList_report["Terrorist_Groups"] = [];
        this.NewsList_report["X-Hairs"] = [];
      }
    }

    this.loader_flag.report = true;
    if (this.origin == "west_corner" && this.data.currentWestTab == 1) {
      this.origin = "iran_corner";
    } else if (this.origin == "iran_corner" && this.data.currentWestTab == 0) {
      this.origin = "west_corner";
    }
    // this.ngxService.start();
    console.log('this.for_ally ',this.for_all);
    this.api
      .filterNewsandTweets_report(
        this.origin,
        "news",
        this.Dates["report"],
        this.keyword["report"],
        false,
        this.for_all
      )
      .subscribe({
        next: (data: any) => {
          console.log("rnews data ", data);
          this.u_id = data.uid;
          console.log('u_idx ',typeof(this.u_id));
          var res: any = data?.data;
          this.loader_flag.report = false;
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values: any = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i]?.slice(0, this.data_limit);
            news_.forEach((element) => {
              let keywords_ = element?._source?.data?.keywords_hits;
              let desc_ = element?._source?.data?.description;
              let title_ = element?._source?.data?.title;
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
                description: this.api.highlightWords(desc_, keywords_),
                report_description: desc_,
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || "",
              };
              let resolved_key = key;
              if (this.origin == "east_corner") {
                resolved_key =
                  key == "army"
                    ? "mil"
                    : key == "international"
                    ? "intl"
                    : key == "kashmir"
                    ? "iiojk"
                    : "domestic";
              }
              this.NewsList_report[resolved_key]?.push({
                data: newsFormate,
                flag: true,
              });
            });
          });
          // this.ngxService.stop();
        },
        error: (error) => {
          // this.ngxService.stop();
        },

        complete: () => {
          console.log("this.NewsList_report ", this.NewsList_report);
        },
      });
  }

  getReportTweets() {
    if (this.origin == "east_corner") {
      this.tweetList_report["mil"] = [];
      this.tweetList_report["intl"] = [];
      this.tweetList_report["iiojk"] = [];
      this.tweetList_report["domestic"] = [];
    } else if (this.origin == "internal_security") {
      this.tweetList_report["govt"] = [];
      this.tweetList_report["polparties"] = [];
      this.tweetList_report["is"] = [];
      this.tweetList_report["military"] = [];
      this.tweetList_report["anti_state"] = [];
    } else if (this.data.currentWestTab == 0 || this.data.currentWestTab == 1) {
      // this.tweetList_report["Internal_Envmt"] = [];
      // this.tweetList_report["Diplo_Overtures"] = [];
      // this.tweetList_report["Terrorist_Groups"] = [];
      // this.tweetList_report[ ] = [];
      // this.tweetList_report["X-Hairs"] = [];

      // Temporarily changing
      this.tweetList_report["international_env"] = [];
      this.tweetList_report["diplo"] = [];
      this.tweetList_report["pak_corner"] = [];
      // this.tweetList_report["india_corner"] = [];
      this.tweetList_report["x_hair"] = [];

      this.tweetList_report["iran_internal_env"] = [];
      this.tweetList_report["iran_diplo"] = [];
      this.tweetList_report["iran_pak_corner"] = [];
      // this.tweetList_report["iran_india_corner"] = [];
      this.tweetList_report["iran_x_hair"] = [];
    }
    if (this.origin == "west_corner" && this.data.currentWestTab == 1) {
      this.origin = "iran_corner";
    } else if (this.origin == "iran_corner" && this.data.currentWestTab == 0) {
      this.origin = "west_corner";
    }
    this.loader_flag.report = true;
    this.api
      .filterNewsandTweets_report(
        this.origin,
        "tweet",
        this.Dates["report"],
        this.keyword["report"],
        this.trending_flag["report"],
        this.for_all.replace("diplomat", "anti_state")
      )
      .subscribe({
        next: (data: any) => {
          this.loader_flag.report = false;
          var res: any = data?.data;
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values: any = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i]?.slice(0, this.data_limit);
            news_.forEach((element) => {
              let desc_ = element.text;
              let keywords_ = element.exist_keywords;

              let newsFormate = {
                id: element._id,
                name: element.user.name,
                screen_name: element.user.screen_name,
                profile_image_url: element.user.profile_image_url,
                description: this.api.highlightWords(desc_, keywords_),
                report_desc: desc_,
                created_at: this.api.formatDate(element.created_at),
                keywords: element.exist_keywords,
                id_str: element.id_str,
                cat_hits: element.cat_hits,
              };
              let resolved_key = key;
              if (this.origin == "east_corner") {
                resolved_key =
                  key == "army"
                    ? "mil"
                    : key == "international"
                    ? "intl"
                    : key == "kashmir"
                    ? "iiojk"
                    : "domestic";
              }
              this.tweetList_report[resolved_key]?.push({
                data: newsFormate,
                flag: false,
              });
            });
          });

          // this.is_lazy_loader_tweets[origin] = false
        },
        error: (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        },
      });
  }

  _link = "";
  rep_flag = "";
  anychange = false;
  printReport() {
    console.log("Print Report...");
    console.log("printing report");
    if (!this.anychange && this.rep_flag) {
      // window.open(this._link)
      this.openPdfInNewTab(this._link);
      return;
    }

    this.api
      .registerLog(
        encodeURIComponent(
          JSON.stringify({
            type: "component",
            page: "explore",
            category: this.origin,
            path: window.location.href,
            id: this.report_format + " Report",
          })
        )
      )
      .subscribe();

    var NewsReportData: any = {};
    var TweetReportData: any = {};
    var originx = this.origin.toUpperCase().replace("_", " ");
    console.log("this.NewsList_report ", this.NewsList_report);

    for (const key of Object.keys(this.NewsList_report)) {
      var data = this.NewsList_report[key].filter((x) => {
        return x.flag;
      });
      NewsReportData[key] = data;
    }
    for (const key of Object.keys(this.tweetList_report)) {
      var data = this.tweetList_report[key].filter((x) => {
        return x.flag;
      });
      TweetReportData[key] = data;
    }
    this.rep_flag = "pending";

    let ws_ = new WebSocket(global_pointer.news_addr_ws);
    var key_json = {};

    key_json = {
      corner: originx,
      type: this.report_format,
      news: NewsReportData,
      tweets: TweetReportData,
    };

    console.log(key_json);
    ws_.onopen = function () {
      ws_.send(JSON.stringify(key_json));
    };
    ws_.onmessage = (evt) => {
      let b_ = JSON.parse(evt?.data);
      if (b_?.path) {
        this._link = (this.api.ip + b_.path).replace("/api", "");
        this.rep_flag = "done";
        this.anychange = false;
        // window.open(this._link)
        this.openPdfInNewTab(this._link);
      }
    };
  }
  //
  newsSummaryReport() {
    console.log("this.report_format ", this.report_format);

    // if(this.report_format==='pdf'){
    //   alert('AI Summarized Report is only available in docx format')
    //   return
    // }

    console.log("short report");
    if (!this.anychange && this.rep_flag) {
      // window.open(this._link)
      this.openPdfInNewTab(this._link);
      return;
    }
    this.api
      .registerLog(
        encodeURIComponent(
          JSON.stringify({
            type: "component",
            page: "explore",
            category: this.origin,
            path: window.location.href,
            id: this.report_format + " Report",
          })
        )
      )
      .subscribe();

    var NewsReportData: any = {};
    var originx = this.origin.toUpperCase().replace("_", " ");

    for (const key of Object.keys(this.NewsList_report)) {
      var data = this.NewsList_report[key].filter((x) => {
        return x.flag;
      });
      NewsReportData[key] = data;
    }

    this.rep_flag = "pending";

    let ws_ = new WebSocket(global_pointer.news_addr_ws);
    var key_json = {};
    key_json = {
      corner: originx,
      type: this.report_format,
      news: NewsReportData,
      uid: this.u_id,
    };
    console.log("keyjson");
    console.log(key_json);
    ws_.onopen = function () {
      console.log("connection opened");
      ws_.send(JSON.stringify(key_json));
    };
    ws_.onmessage = (evt) => {
      let b_ = JSON.parse(evt?.data);
      if (b_?.path) {
        this._link = (this.api.ip + b_.path).replace("/api", "");
        this.rep_flag = "done";
        this.anychange = false;
        // window.open(this._link)
        console.log("open link ", this._link);
        this.openPdfInNewTab(this._link);
      }
    };
  }
  getFileName() {}
  transformName(name) {
    // "international_env,diplo,pak_corner,india_corner,x_hair"
    switch (name) {
      case "international_env":
        return "Internal_Envmt";
      case "diplo":
        return "Diplo_Overtures";
      case "pak_corner":
        return "Terrorist_Groups";
      // case "india_corner":
      //   return  ;
      case "x_hair":
        return "X-Hairs";
      default:
        return "Unknown";
    }
  }
  openPdfInNewTab(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // This will set the filename to the last part of the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  customReport(event: any = "", context = "", type = "") {
    this.anychange = true;
    this.rep_flag = "";
    if (event) {
      if (type != "tweet") {
        this.NewsList_report[context].forEach(
          (x) => (x.flag = event.target.checked)
        );
      } else {
        this.tweetList_report[context].forEach(
          (x) => (x.flag = event.target.checked)
        );
      }
    }
  }

  multiselect_date = [];
  changeFilter(value) {
    let context = "report";
    this.Dates[context] = value;
    this.multiselect_date = [];
    if (context == "report") {
      this.getReportNews();
      this.getReportTweets();
    }
    this.customReport();
  }

  // changeFilter(value) {
  //   this.onChange.emit({
  //     context: this.context,
  //     value: value
  //   })
  // }
}
