import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { SectionInfoWest } from "src/service/interfaces";

@Component({
  selector: "app-government",
  templateUrl: "./internalenv.component.html",
  styleUrls: ["./internalenv.component.css"],
})
export class InternalenvComponent implements OnInit {
  cat = "Internal Envmt";
  corner = "west_corner";
  Dates: any = {};
  keywords: any = {};
  trending: any = {};
  multiselect_date = {};
  page_number: any = {};
  lazy_loader: any = {};
  page_end: any = {};
  page_number_: any = {};
  lazy_loader_: any = {};
  page_end_: any = {};
  loading: any = {};
  all_cats: any = [];
  selectedPillis = 0;
  selectedPillMultiLateral = 0;
  subNews = {
    is: {
      tabs: ["all", "Tsm", "Protests"],
      all: [],
      Tsm: [],
      Protests: [],
    },
    political: {
      tabs: ["all", "Elections", "Conferences"],
      all: [],
      Elections: [],
      Conferences: [],
    },
  };

  twitter_internal_subcats = [
    "parliament",
    "xhair",
    "policies_and_holidays",
    "notifications",
    "judiciary",
    "economy",
    "other_govt",
    "g2g",
    "neighbours",
    "regional",
    "international",
    "others_diplomat",
  ];

  twitter_section_info = {
    parliament: "Parliament",
    xhair: "Xhair",
    policies_and_holidays: "Policies and_holidays",
    notifications: "Notifications",
    judiciary: "Judiciary",
    economy: "Economy",
    other_govt: "Govt Others",
    g2g: "G2G",
    neighbours: "Neighbours",
    regional: "Regional",
    international: "International",
    others_diplomat: "Diplomat Others",
  };

  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService
  ) {
    // Get all the sub categories;
    let obj: SectionInfoWest["Internal Envmt"] =
      this.api.section_info_west[this.cat];
    // Object.keys(obj).forEach((key, i) => {
    //   let arr: any = Object.values(obj)[i];
    //   this.all_cats.push(...arr);
    // });
    for (const key of Object.keys(obj)) {
      this.Dates[key] = "latest";
      this.keywords[key] = "";
      this.trending[key] = false;
      this.multiselect_date[key] = "";
    }
    console.log(this.keywords);
    console.log(this.Dates);
    console.log(this.trending);
    Object.values(obj).forEach((val, idx) => {
      this.all_cats.push(...val);
    });

    this.all_cats.forEach((key: string) => {
      this.page_number[key] = 1;
      this.lazy_loader[key] = false;
      this.page_end[key] = false;

      this.loading[key] = true;
    });

    this.multiselect_date["all"] = "";
    this.Dates["all"] = "latest";
    this.keywords["all"] = "";
    this.trending["all"] = false;

    console.log(this.all_cats);
    this.twitter_internal_subcats = this.all_cats;
    // this.all_cats.forEach((x) => {});
    // this.all_cats.forEach((x) => {});
    // this.twitter_internal_subcats.forEach((x) => {
    //   this.page_number_[x] = 1;
    //   this.lazy_loader_[x] = false;
    //   this.page_end_[x] = false;
    // });
    this.loaderMethod(this.all_cats, true);
  }

  armyList = [];
  multiselect_date_: any = {
    editorial: "",
    tweet: "",
  };
  keywords_ = {
    editorial: "",
    tweet: "",
  };
  Dates_ = {
    editorial: "latest",
    tweet: "latest",
  };
  trending_flag = {
    editorial: false,
    tweet: false,
  };
  loader_flag = {
    editorial: false,
    tweet: false,
  };

  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  loadmap = true;
  ngOnInit(): void {
    if (!this.data.currentWestTab) {
      this.corner = "west_corner"; // internal_security | west_corner
    } else {
      this.corner = "west_corner_iran"; // internal_security | west_corner
    }
    // this.ngxService.start();
    this.fetch_sub_news();
    this.getEditorials();
    this.fetch_twitter_data();
    this.getTrendingHashtag();
    // this.getMap(null,'m2m');
    // this.getMap(null,'inland');
  }
  convertDate(dateStr: string): string {
    // Parse the date string using the Date object
    const date = new Date(dateStr);

    // Extract the year, month, and day
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth returns month from 0-11, so add 1
    const day = date.getUTCDate() + 1;

    // Format the date in the desired output
    const formattedDate = `${year},${month},${day}`;
    return formattedDate;
  }
  searchedis(context: string) {
    this.selectedPillis = 0;
    this.resetLateralsFields("is");

    if (this.multiselect_date["is"] && this.Dates["is"] != "latest") {
      this.Dates["is"] = this.convertDate(this.multiselect_date["is"]);
    } else {
      this.Dates["is"] = "latest";
    }

    console.log(this.Dates["is"]);
    this.fetch_sub_news(context);
  }

  searchedMultilateral() {
    this.selectedPillMultiLateral = 0;
    this.resetLateralsFields("political");
    if (this.Dates["political"] && this.Dates["political"] != "latest") {
      this.Dates["political"] = this.convertDate(
        this.multiselect_date["political"]
      );
    } else {
      this.Dates["is"] = "latest";
    }

    console.log(this.Dates["political"]);
    this.fetch_sub_news("political");
  }

  resetLateralsFields(context: string) {
    for (const key of Object.keys(this.subNews[context])) {
      if (key !== "tabs") {
        this.subNews[context][key] = [];
      }
    }
  }

  fetch_sub_news(
    context = "all",
    url = "fetch_sub_news",
    sub_cat = "",
    lazy_flag = false
  ) {
    let sub_cats = [sub_cat];

    if (!sub_cat) {
      // turning the loading flags on
      // sub_cats = this.api.section_info_west[this.cat];
      // console.log(sub_cats);
      sub_cats = this.all_cats;
      // this.loaderMethod(sub_cats, true);
      if (context !== "all") {
        sub_cats = [...this.subNews[context].tabs];

        sub_cats.shift();
      }
      // formatting filter date
      // let now = this.multiselect_date[context];
      // this.Dates[context] = now
      //   ? now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate()
      //   : this.Dates[context];
      // // emptying the selected lists
      this.all_cats.forEach((key) => {
        this.api.newsList[key] = [];
        this.page_number[key] = 1;
        this.page_end[key] = false;
      });

      console.log(this.all_cats);
    } else {
      // this.page_number[sub_cat]==1 && (this.api.newsList[sub_cat]=[])
      this.lazy_loader[sub_cat] = true;
    }
    console.log(context);
    this.api
      .fetch_sub_news(
        this.corner,
        sub_cats,
        this.Dates[context],
        this.keywords[context],
        this.trending[context],
        url,
        sub_cat ? this.page_number[sub_cat] : 1
      )
      .subscribe({
        next: (data: any) => {
          if (
            !data ||
            !Object.entries(data)?.length ||
            !Object.values(data)?.find((x: any) => x.length)
          ) {
            this.ngxService.stop();
            !sub_cat && this.loaderMethod(sub_cats, false);
            sub_cat && (this.lazy_loader[sub_cat] = false);
            sub_cat && (this.page_end[sub_cat] = true);
            return;
          }
          console.log(data);
          console.log(sub_cats);
          sub_cats.forEach((x, i) => {
            if (!sub_cat) {
              this.api.newsList[x] = data[x] ? this.formatData(data[x], x) : [];
              console.log('this.api.newsList internal ',this.api.newsList)
            } else {
              data[x] &&
                this.api.newsList[x].push(...this.formatData(data[x], x));
            }
          });

          console.log(this.api.newsList, "custom news formattt");

          !sub_cat && this.loaderMethod(sub_cats, false);
          sub_cat && (this.lazy_loader[sub_cat] = false);

          this.ngxService.stop();
        },
        error: (error) => {
          this.ngxService.stop();
          !sub_cat && this.loaderMethod(sub_cats, false);
          sub_cat && (this.lazy_loader[sub_cat] = false);
          console.error("fetch_sub_news error: ", error);
        },

        complete: () => {
          if (this.api.newsList) {
            console.log(this.api.newsList);

            for (const [key, value] of Object.entries(this.api.newsList)) {
              if (context === "all") {
                console.log("Tiggered");
                if (this.subNews["is"][key]) {
                  this.subNews["is"][key] = value;
                  this.subNews["is"][key].forEach((itm) => {
                    this.subNews["is"]["all"].push(itm);
                  });
                } else {
                  this.subNews["political"][key] = value;
                  this.subNews["political"][key].forEach((itm) => {
                    this.subNews["political"]["all"].push(itm);
                  });
                }
              }

              if (context !== "all" && this.subNews[context][key]) {
                console.log("Triggered");
                this.subNews[context][key] = value;
                this.subNews[context][key].forEach((itm) => {
                  this.subNews[context]["all"].push(itm);
                });
              }
            }

            console.log(this.subNews);
          }
        },
      });
  }

  formatData(arr, sub_cat) {
    let formatted_news = [];
    arr.forEach((element) => {
      let hitkeywords = element._source.data.keywords_hits;
      let desx = element._source.data.description;
      let title_ = element._source.data.title;

      formatted_news.push({
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
        sub_cat: sub_cat,
      });
    });
    return formatted_news;
  }
  formatData_(arr) {
    let formatted_news = [];
    arr.forEach((element) => {
      let desc_ = element.text;
      let keywords_ = element.exist_keywords;

      let newsFormate = {
        id: element._id,
        name: element.user.name,
        screen_name: element.user.screen_name,
        profile_image_url: element.user.profile_image_url,
        description: this.api.highlightWords(desc_, keywords_),
        created_at: this.api.formatDate(element.created_at),
        keywords: element.exist_keywords,
        id_str: element.id_str,
        cat_hits: element.cat_hits,
        tweet_image: element.tweet_image,
      };
      formatted_news.push(newsFormate);
    });
    return formatted_news;
  }

  changeFilter(event) {
    let context = event.context;
    let value = event.value;
    this.Dates[context] = value;
    this.multiselect_date[context] = "";
    console.log(context);
    this.resetLateralsFields(context);
    this.fetch_sub_news(context);
  }

  loaderMethod(sub_cats: string[], flag) {
    // this.api.section_info_west[this.cat].forEach((x) => {
    //   // this.loading[x] = sub_cats.includes(x) ? flag : this.loading[x];
    // });

    sub_cats.forEach((cat: string) => {
      this.loading[cat] = true;
    });
  }

  navigate(path, corner, extra = "") {
    let paths = [path, corner];
    extra && paths.push(extra);
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(paths))
    );
    window.open(url);
  }

  checkScrolled(event, context, sub_cat) {
    console.log(context);
    console.log(sub_cat);
    if (
      this.page_end[sub_cat] ||
      this.loader_flag[context] ||
      !this.api.newsList[sub_cat].length
    )
      return;
    let { target } = event;
    let scroll_offset = 20;
    var isFullyScrolled =
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - scroll_offset;
    if (isFullyScrolled) {
      this.loadMore(context, sub_cat);
    }
  }

  loadMore(context, sub_cat) {
    this.page_number[sub_cat] += 1;
    let url = this.api.sections_main.mil.indian_forces.includes(sub_cat)
      ? "fetch_sub_news_cat"
      : "fetch_sub_news";
    this.fetch_sub_news(context, url, sub_cat);
  }

  checkScrolled_(event, context, sub_cat) {
    if (
      this.page_end_[sub_cat] ||
      !this.loader_flag.tweet ||
      !this.api.tweetList[sub_cat].length
    )
      return;
    let { target } = event;
    let scroll_offset = 20;
    var isFullyScrolled =
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - scroll_offset;

 
    if (isFullyScrolled) {
      this.loadMore_(context, sub_cat);
    }
  }

  loadMore_(context, sub_cat) {
    this.page_number_[sub_cat] += 1;
    this.fetch_twitter_data(context, sub_cat);
  }

  gotoLink(url, event: any = "") {
    event && event.stopPropagation();
    url = url.includes("http") ? url : "https://" + url;
    window.open(url);
  }

  editorialList = [];
  getEditorials() {
    this.editorialList = [];

    this.loader_flag.editorial = false;
    this.api
      .getEditorials(
        this.corner,
        this.Dates_["editorial"],
        this.keywords_["editorial"],
        this.trending_flag["editorial"]
      )
      .subscribe(
        (data: any) => {
          var res: any = data?.data;
          this.loader_flag.editorial = true;
          if (res && res.length) {
            res.forEach((element, i) => {
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: element?._source?.data?.title,
                description: element?._source?.data?.description,
                link: element._source.data.link,
                country: element._source.data.country,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || "",
              };
              this.editorialList.push(newsFormate);
            });
            console.log("editorial", this.editorialList);
          }
        },
        (error) => {}
      );
  }

  fetch_twitter_data(context = "tweet", sub_cat = "", lazy_flag = false) {
    let sub_cats = [];

    this.loader_flag.tweet = false;
    sub_cat && (this.lazy_loader_[sub_cat] = true);
    if (sub_cat) {
      sub_cats = [sub_cat];
    } else {
      // sub_cats = this.twitter_internal_subcats;
      sub_cats = this.all_cats;
      console.log(sub_cats);
      // emptying the selected lists
      sub_cats.forEach((x, i) => {
        this.api.tweetList[x] = [];
        this.page_number_[x] = 1;
        this.page_end_[x] = false;
      });
    }
    this.api
      .fetch_twitter_data(
        this.corner,
        sub_cats?.join(","),
        this.Dates_[context],
        this.keywords_[context],
        false,
        "fetch_twitter_data",
        sub_cat ? this.page_number_[sub_cat] : 1
      )
      .subscribe({
        next: (data: any) => {
          this.loader_flag.tweet = true;
          if (
            !data ||
            !Object.entries(data)?.length ||
            !Object.values(data)?.find((x: any) => x.length)
          ) {
            sub_cat && (this.lazy_loader_[sub_cat] = false);
            sub_cat && (this.page_end_[sub_cat] = true);
            return;
          }

          sub_cats.forEach((x, i) => {
            if (!sub_cat) {
              this.api.tweetList[x] = data[x] ? this.formatData_(data[x]) : [];
            } else {
              data[x] &&
                this.api.tweetList[x].push(...this.formatData_(data[x]));
            }
          });

          sub_cat && (this.lazy_loader_[sub_cat] = false);

          this.ngxService.stop();

          // this.is_loading_tweets[origin] = false
        },
        complete: () => {
          console.log(this.api.tweetList);
        },
        error: (error) => {
          this.ngxService.stop();
          sub_cat && (this.lazy_loader_[sub_cat] = false);
          console.error("fetch_sub_news error: ", error);
        },
      });
  }

  filter_report_date(context) {
    if (!this.multiselect_date_[context]) {
      return;
    }
    var now = this.multiselect_date_[context];

    this.Dates_[context] =
      now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate();

    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "tweet") {
      this.fetch_twitter_data();
    }
  }

  changeFilter_(event) {
    let value = event.value;
    let context = event.context;
    this.Dates_[context] = value;
    this.multiselect_date_ = [];

    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "tweet") {
      this.fetch_twitter_data();
    }
  }

  trendingHashtagList = [];
  trendingwordsList = [];
  getTrendingHashtag() {
    this.api.getTrendingHashtag(this.corner).subscribe(
      (data: any) => {
        if (!data?.hashtag?.length && !data?.keywords?.length) {
          return;
        }
        this.trendingHashtagList = data.hashtag;
        this.trendingwordsList = data.keywords;
      },
      (error) => {
        console.log("getTimes() error:", error);
      }
    );
  }

  map_context: any = "m2m";
  map_loading: any = {
    m2m: false,
    inland: false,
  };
  map_date: any = {
    m2m: "48hours",
    inland: "48hours",
  };
  news_locations: any = {
    m2m: [],
    inland: [],
  };
  getMap(event = null, ctx = "m2m") {
    let context,
      value = "";
    let resolved_cat = this.cat;
    if (event?.context) {
      context = event.context;
      value = event.value;
      this.map_date[ctx] = value;
    }
    this.map_loading[ctx] = true;
    this.news_locations[ctx] = [];
    this.api
      .fetch_locations(
        resolved_cat,
        this.api.sub_cats_t_internal[this.cat],
        this.corner,
        this.map_date[ctx]
      )
      .subscribe(
        (data: any) => {
          let res = data?.all_locations;
          this.map_loading[ctx] = false;
          if (!res || !Object.entries(res).length) return;
          this.news_locations[ctx] = res.slice(0, 100);
        },
        (error) => {
          console.log(error, "news: getMap()");
        }
      );
  }
  readMore(linkurl, id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.corner, id])
      )
    );
    window.open(url);
  }

  generateId(index: number): string {
    return `item_${index}`;
  }

  generateMultiLateralId(index: number): string {
    return `multilateral_${index}`;
  }

  onisSelect(index: number) {
    this.selectedPillis = index;
  }

  onMultilateralSelect(index: number) {
    this.selectedPillMultiLateral = index;
  }
}
