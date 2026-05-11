import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";

@Component({
  selector: "app-military",
  templateUrl: "./common-route.component.html",
  styleUrls: ["./common-route.component.css"],
})
export class CommonRoute implements OnInit {
  cat = "mil";
  corner = "";
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
  forcesCombined: any[] = [];
  keyword = {
    news: "",
    tweet: "",
    podcast: "",
    editorial: "",
    report: "",
  };

  country = "";
  temvar: any = {};

  // Everytime this count is greater then i wanna show the shadow only
  editorialSliderCount = 0;
  // For multiple carousels in domestic
  currentDomesticCat: string;
  // Keeps track of which categories have had a scroll listener attached
  scrollListenersAttached: { [category: string]: boolean } = {};

  // Dynamic count tracking per slider
  sliderCount: { [key: string]: number } = {};
  isScrollLocked: { [key: string]: boolean } = {};

  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService
  ) {
    let page = window.location.hash.split("/")?.[1]; // first pathname (explore, news-details etc)
    let hash = window.location.hash.split("/")?.[2]; // second pathname (west_corner, internal_security etc)
    let country = window.location.hash.split("/")?.[3];

    this.corner = page;
    this.cat = hash;
    console.log("hash ", country);
    this.country = country;
    console.log("countryhehe ", country);
    // For the east corner;
    console.log("hash ", hash, "this.corner, ", this.corner);
    if (hash == "mil" && this.corner == "east_corner") {
      this.cat = "mil";
      this.arr = Object.keys(this.api.section_combined[this.corner][this.cat]);
    } else if (hash == "intl" && this.corner == "east_corner") {
      this.cat = "intl";
      this.arr = Object.keys(this.api.section_combined[this.corner][this.cat]);
    } else {
      // For the internal security;
      if (this.cat == "govt" && this.corner == "internal_security") {
        this.cat = "govt";
      } else if (this.cat == "pol" && this.corner == "internal_security") {
        this.cat = "polparties";
      } else if (this.cat == "mil" && this.corner == "internal_security") {
        this.cat = "military";
      } else if (this.cat == "diplo" && this.corner == "internal_security") {
        this.cat = "diplomat";
      }
      if (this.corner == "internal_security" || this.corner == "east_corner") {
        console.log(this.cat, this.corner);

        this.arr = Object.keys(
          this.api.section_combined[this.corner][this.cat]
        );
        console.log("this.arr ", this.arr);
      } else if (this.corner == "west_corner") {
        const tempCat = this.country;
        this.country = this.cat;
        this.cat = tempCat;
        console.log(this.cat, this.corner, this.country);
        this.arr = Object.keys(
          this.api.section_combined[this.corner][this.country][this.cat]
        );
      }
    }
    console.log(this.cat, this.corner);
    let obj;
    if (this.corner == "east_corner") {
      obj = this.api.sections_main[this.cat];
      console.log(obj);
    } else if (this.corner === "internal_security") {
      obj = this.api.sections_main_internal[this.cat];
      console.log(obj);
    } else {
      obj = this.api.section_west_internal[this.country][this.cat];
    }
    Object.keys(obj).forEach((key, i) => {
      // Setting the default values;
      this.multiselect_date[key] = "";
      this.Dates[key] = "latest";
      this.keywords[key] = "";
      this.trending[key] = false;
      this.api.tweetList["tweetsCombined"] = [];
      // For the page number and the loader;
      this.page_number[key] = 1;
      this.page_number_[key] = 1;
      console.log(key);
      console.log(this.page_number[key]);
      this.lazy_loader[key] = false;
      this.page_end[key] = false;

      // Getting the all cats;
      let arr: any = Object.values(obj)[i];
      this.all_cats.push(...arr);
    });
    console.log("final allcats ", this.all_cats);

    this.all_cats.forEach((x) => {
      this.page_number[x] = 1;
      this.page_number["tweetsCombined"] = 1;

      this.lazy_loader[x] = false;
      this.lazy_loader["forcesCombined"] = false;
      this.lazy_loader["tweetsCombined"] = false;
      this.page_end[x] = false;
      this.page_end["tweetsCombined"] = false;
    });
    if (this.corner == "east_corner") {
      this.api.sub_cats_t[this.cat].forEach((x) => {
        this.page_number_[x] = 1;
        this.page_number_["tweetsCombined"] = 1;
        this.lazy_loader_[x] = false;
        this.lazy_loader["forcesCombined"] = false;
        this.lazy_loader["tweetsCombined"] = false;
        this.page_end_[x] = false;
        this.page_end_["tweetsCombined"] = false;
      });
      this.api.sub_cats[this.cat].forEach((x) => {
        this.loading[x] = true;
        this.loading["forcesCombined"] = true;
      });
      this.loaderMethod(this.api.sub_cats[this.cat], true);
    } else if (this.corner === "internal_security") {
      this.api.sub_cats_t_internal[this.cat].forEach((x) => {
        this.page_number_[x] = 1;
        this.page_number_["tweetsCombined"] = 1;
        this.lazy_loader_[x] = false;
        this.lazy_loader_["tweetsCombined"] = false;
        this.page_end_[x] = false;
        this.page_end_["tweetsCombined"] = false;
      });
    } else {
      // For the west corner;
    }

    // this.loaderMethod(this.api.sub_cats[this.cat], true);
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
  loadmap = {
    m2m: true,
    inland: true,
  };

  arr: any[];
  ngOnInit(): void {
    // this.corner = "east_corner"; // internal_security | west_corner
    // this.ngxService.start();
    console.log("tomu cou", this.country);
    // if (
    //   (this.cat == "pkCorner" && this.country === "iran") ||
    //   this.cat == "inCorner"
    // ) {
    //   this.fetch_sub_news_subcatOne();
    // } else {
    this.fetch_sub_news();
    if (this.cat == "mil") {
      this.fetch_sub_news("indian_forces", "fetch_sub_news_cat");
    }
    // }
    // Conditional for time being ;
    // if (this.corner !== "west_corner") {
    this.getTitleBar();
    console.log("temp calling");
    // }
    console.log("before calling editorials");
    this.getEditorials();
    this.fetch_twitter_data();
    this.getTrendingHashtag();

    // this.getMap(null,'m2m');
    // this.getMap(null,'inland');

    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000);
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

  fetch_methods(context, bool = true) {
    console.log("context  fetch_methods ", context);
    if (
      (this.cat == "pkCorner" && this.country === "iran") ||
      this.cat == "inCorner"
    ) {
      this.fetch_sub_news_subcatOne(context, bool);
    } else {
      this.fetch_sub_news(context);
    }
  }

  fetch_sub_news(
    context = "all",
    url = "fetch_sub_news",
    sub_cat = "",
    lazy_flag = false
  ) {
    console.log(context);
    let sub_cats = [sub_cat];
    console.log(
      "getting subcat in fetch_sub_news ",
      sub_cat,
      " context ",
      context,
      " this.arr[1] ",
      this.arr[1],
      "this.currentDomesticCat ",
      this.currentDomesticCat,
      "this.cat ",
      this.cat
    );

    if (this.country === "afghanistan" && this.cat === "pkCorner") {
      this.cat = "afgMil";
    }
    console.log(
      "tissue country",
      this.country,
      "this.cat ",
      this.cat,
      "sub_cat ",
      sub_cat
    );
    if (!sub_cat || context === "horizontalNews") {
      // turning the loading flags on

      console.log(this.cat, this.country);
      sub_cats = this.api.getSubCats(
        this.cat,
        context,
        this.corner,
        this.country
      );

      console.log("dhickn ", sub_cats);

      // Commenting for time being (Debugging)
      // this.loaderMethod(sub_cats, true);

      // formatting filter date
      let now = this.multiselect_date[context];
      this.Dates[context] = now
        ? now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate()
        : this.Dates[context];

      // emptying the selected lists
      sub_cats.forEach((x, i) => {
        this.api.newsList[x] = [];
        this.page_number[x] = 1;
        this.page_end[x] = false;
      });
    } else {
      if (sub_cat == this.arr[1]) {
        console.log("inse sub_cat===this.currentDomesticCat");
        console.log(this.cat, context);
        sub_cats = this.api.getSubCats(
          this.cat,
          context,
          this.corner,
          this.country
        );

        console.log(sub_cats);
      }

      // Making the lazy loading true;
      this.lazy_loader[context] = true;
    }

    let newCorner = this.corner;
    if (this.corner === "west_corner") {
      if (this.data.getCurrentWestTab()) {
        newCorner = "west_corner_iran";
      } else {
        newCorner = "west_corner";
      }
    }
    console.log(
      "final corner ",
      newCorner,
      " subcats ",
      sub_cats,
      " dates",
      this.Dates,
      "keywords ",
      this.keywords,
      " tendirng ",
      this.trending
    );
    this.api
      .fetch_sub_news(
        newCorner,
        sub_cats.join(","),
        this.Dates[context],
        this.keywords[context],
        this.trending[context],
        url,
        sub_cat ? this.page_number[sub_cat] : 1,
        this.getMainCat(newCorner, this.cat, this.country)
      )
      .subscribe({
        next: (data: any) => {
          console.log("datafromapi ", data);
          if (
            !data ||
            !Object.entries(data)?.length ||
            !Object.values(data)?.find((x: any) => x.length)
          ) {
            console.log("loaderMethod sub_cats ", sub_cats);
            this.ngxService.stop();
            !sub_cat && this.loaderMethod(sub_cats, false);
            sub_cat && (this.lazy_loader[sub_cat] = false);

            sub_cat && (this.page_end[sub_cat] = true);
            return;
          }
          console.log("subcats before iteration ", sub_cats);
          sub_cats.forEach((x, i) => {
            if (!sub_cat) {
              console.log("tango if x", x);
              this.api.newsList[x] = data[x] ? this.formatData(data[x], x) : [];
              console.log("zing 1", this.api.newsList);
              // This is for the east_corner only
              if (this.cat == "mil" && this.corner == "east_corner") {
                this.api.newsList["forcesCombined"] =
                  this.api.newsList.indian_airforce.concat(
                    this.api.newsList.indian_coast_guard,
                    this.api.newsList.indian_navy
                  );
              }

              // FOR ADDING EXTRA OTHER CATS ON WEST_CORNER ##############
              if (this.corner === "west_corner") {
                console.log("jazz ", this.cat, this.corner);
                if (!this.api || !this.api.newsList) {
                  console.error("Error: newsList is undefined.");
                  return;
                }

                if (this.cat === "internalEnvmt") {
                  if (this.api.newsList["Other News and Activity"]) {
                    this.api.newsList["others_" + this.cat] = [
                      ...this.api.newsList["Other News and Activity"],
                    ];
                  } else {
                    console.warn('"Other News and Activity" is undefined.');
                    this.api.newsList["others_" + this.cat] = [];
                  }
                } else if (this.cat === "diplomacy") {
                  const otherActivities = this.api.newsList["Other Activities"];
                  const otherNews =
                    this.api.newsList["Other News and Activity"];

                  this.api.newsList["others_" + this.cat] = [];

                  if (Array.isArray(otherActivities)) {
                    this.api.newsList["others_" + this.cat] = [
                      ...otherActivities,
                    ];
                  } else {
                    console.warn(
                      '"Other Activities" is undefined or not an array.'
                    );
                  }

                  if (Array.isArray(otherNews)) {
                    this.api.newsList["others_" + this.cat].push(...otherNews);
                  } else {
                    console.warn(
                      '"Other News and Activity" is undefined or not an array.'
                    );
                  }
                }
              }

              console.log("main print this.api.newsList ", this.api.newsList);
            } else {
              console.log("I happend");
              data[x] &&
                this.api.newsList[x].push(...this.formatData(data[x], x));
            }
          });
          console.log("sub_catsqqq ", sub_cats);
          !sub_cat && this.loaderMethod(sub_cats, false);
          sub_cat && (this.lazy_loader[sub_cat] = false);
          // this.forcesCombined= this.api.newsList.indian_airforce.concat(this.api.newsList.indian_coast_guard,this.api.newsList.indian_navy)
          // console.log('tango forcesCombined',this.forcesCombined)
          this.ngxService.stop();
        },
        error: (error) => {
          this.ngxService.stop();
          this.lazy_loader[context] = false;

          !sub_cat && this.loaderMethod(sub_cats, false);
          sub_cat && (this.lazy_loader[sub_cat] = false);
          console.error("fetch_sub_news error: ", error);
        },

        complete: () => {
          console.log(this.api.newsList);

          // For the internation / M2M Combined Data;
          if (context == "all") {
            this.api.newsList[this.arr[0]] = this.requiredArr(
              this.api.newsList,
              this.arr[0]
            );

            // For the inland activities;

            if (this.arr[1]) {
              this.api.newsList[this.arr[1]] = this.requiredArr(
                this.api.newsList,
                this.arr[1]
              );
            }
            console.log("zalimm ", this.api.newsList);
          } else {
            // When context is not "all" (such as filters and the search etc;)
            this.api.newsList[context] = this.requiredArr(
              this.api.newsList,
              context
            );
          }

          // Making the lazy loading false
          this.lazy_loader[context] = false;
        },
      });
  }
  getMainCat(corner, cat, country) {
    console.log("jack ", corner, " cat ", cat, "country ", country);
    if (corner === "east_corner") {
      if (cat === "mil") {
        return "army";
      } else if (cat === "intl") {
        return "international";
      } else if (cat === "iiojk") {
        return "kashmir";
      }
    }
    if (corner === "west_corner" && country === "afghanistan") {
      if (cat === "internalEnvmt") {
        return "dom_env";
      } else if (cat === "diplomacy") {
        return "diplo_econ";
      } else if (cat === "xHair") {
        return "is_tsm";
      } else if (cat === "afgMil") {
        return "mil";
      }
    }
    if (corner === "west_corner_iran" && country === "iran") {
      console.log("dawoodsaeed ,", cat);
      if (cat === "internalEnvmt") {
        return "Internal_Envmt";
      } else if (cat === "diplomacy") {
        return "Diplo_Overtures";
      } else if (cat === "pkCorner") {
        return "Pakistan_Corner";
      } else if (cat === "xHair") {
        return "Terrorist_Groups";
      }
    }
    if (corner === "internal_security") {
      if (cat === "govt") {
        return "govt";
      } else if (cat === "polparties") {
        return "polparties";
      } else if (cat === "military") {
        return "military";
      } else if (cat === "diplomat") {
        return "diplomat";
      }
    }
    return "";
  }
  requiredArr(arr, context) {
    console.log("requiredArr called ");
    console.log("arr ", arr);
    console.log("context ", context);
    const newsArr = [];
    let requiredKeys;
    if (this.corner != "west_corner") {
      console.log("not west corder");
      requiredKeys = this.api.section_combined[this.corner][this.cat][context];
    } else {
      if (
        (context === "pkCorner_temp" || context === "inCorner_temp") &&
        this.country === "afghanistan"
      ) {
        context = "afgMil";
      }
      console.log("contextgg ", context, this.corner, this.cat, this.country);

      requiredKeys =
        this.api.section_combined[this.corner][this.country][this.cat][context];
    }
    console.log(requiredKeys);
    for (const key of requiredKeys) {
      console.log(key);
      newsArr.push(...arr[key]);
    }

    console.log("newsArrrrrrrrrrrrrrr ", newsArr);
    // Sorting combined data based on published_date
    return newsArr.sort((a, b) => {
      return (
        new Date(b.published_date).getTime() -
        new Date(a.published_date).getTime()
      );
    });
  }

  // For the subCat One categories (such as pakistan corner and the india corner)

  fetch_sub_news_subcatOne(
    context = "all",
    filter = true,
    url = "fetch_sub_news",
    sub_cat = "",
    lazy_flag = false
  ) {
    let sub_cats = [sub_cat];
    let now = this.multiselect_date[context];
    this.Dates[context] = now
      ? now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate()
      : this.Dates[context];

    this.loading[this.arr[0]] = true;

    if (!sub_cat) {
    } else {
      // this.page_number[sub_cat]==1 && (this.api.newsList[sub_cat]=[])
      this.lazy_loader[sub_cat] = true;
    }

    let newCorner = this.corner;
    if (this.corner === "west_corner") {
      if (this.data.getCurrentWestTab()) {
        newCorner = "west_corner_iran";
      } else {
        newCorner = "west_corner";
      }
    }
    this.api
      .filterNewsandTweets(
        newCorner,
        "news",
        this.Dates[context],
        this.keywords[context] ? this.keywords[context] : "",
        false,
        "Pakistan Corner,India Corner",
        context ? this.page_number[context] : 1
      )
      // this.cat == "pkCorner" ? "Pakistan Corner" : "India Corner",
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (!data || !Object.entries(data)?.length) {
            console.log(data);
            return;
          }

          // When the India and Pakistan corner were seperated entities.
          console.log("dush ", this.arr);
          // const x = this.arr[0];
          // console.log(x);
          // const objName =
          //   x == "pkCorner_temp" ? "Pakistan Corner" : "India Corner";

          // This is the logic for after combing the pakistan and India COrner.

          for (const x of this.arr) {
            console.log(x);
            const objName =
              x == "pkCorner_temp" ? "Pakistan Corner" : "India Corner";

            console.log(objName);
            const formatedData = this.formatData(
              data.data[objName],
              objName,
              true
            );
            console.log(formatedData);

            if (!this.api.newsList[this.arr[0]]) {
              this.api.newsList[this.arr[0]] = [];
            }
            if (formatedData.length) {
              this.api.newsList[this.arr[0]].push(...formatedData);
              console.log(this.api.newsList[this.arr[0]]);
            }
          }

          this.ngxService.stop();
        },

        error: (error) => {
          this.ngxService.stop();

          this.loading[this.arr[0]] = false;

          !sub_cat && this.loaderMethod(sub_cats, false);
          sub_cat && (this.lazy_loader[sub_cat] = false);
          console.error("fetch_sub_news error: ", error);
        },

        complete: () => {
          this.loading[this.arr[0]] = false;
          console.log(this.api.newsList[this.arr[0]]);
          // this.api.newsList[this.arr[0]] = this.api.newsList[
          //   this.arr[0]
          // ].filter((itm) => {
          //   return itm["subCatHit"] !== "Other News";
          // });
        },
      });
  }

  formatData(arr, sub_cat, subCatHit = false) {
    let formatted_news = [];
    arr.forEach((element) => {
      let hitkeywords = element._source.data.keywords_hits;
      let desx = element._source.data.description;
      let title_ = element._source.data.title;
      let subCatHitData = element._source.data.sub_cat_hits;
      console.log(subCatHitData);
      const obj = {
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
      };

      if (subCatHit) {
        console.log(subCatHit);
        obj["subCatHit"] = subCatHitData;
      }
      formatted_news.push(obj);
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
    console.log("hy event ", event);
    let context = event.context;
    let value = event.value;
    this.Dates[context] = value;
    this.multiselect_date[context] = "";
    console.log(
      "this.Dates ",
      this.Dates,
      " this.multiselect_date",
      this.multiselect_date
    );
    console.log("context ", context);
    console.log("value ", value);
    // if (
    //   (this.cat == "pkCorner" && this.country === "iran") ||
    //   this.cat == "inCorner"
    // ) {
    //   console.log("duz ");
    //   this.fetch_sub_news_subcatOne(context, true);
    // } else {
    this.fetch_sub_news(context);
    // }
  }

  loaderMethod(sub_cats, flag) {
    console.log(
      "Inside loader ",
      " sub_cats ",
      sub_cats,
      " flag",
      flag,
      "this.cat ",
      this.cat,
      "corner ",
      this.corner
    );
    if (this.corner == "east_corner") {
      this.api.sub_cats[this.cat].forEach((x) => {
        this.loading[x] = sub_cats.includes(x) ? flag : this.loading[x];
      });
    } else if (this.corner == "west_corner") {
      console.log(this.api.sub_cats_t_west[this.country][this.cat]);
      this.api.sub_cats_t_west[this.country][this.cat].forEach((x) => {
        this.loading[x] = sub_cats.includes(x) ? flag : this.loading[x];
      });
      console.log("westcats ", this.loading);
    } else {
      this.api.sub_cats_t_internal[this.cat].forEach((x) => {
        this.loading[x] = sub_cats.includes(x) ? flag : this.loading[x];
      });
    }
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
    console.log("checkScrolled called");
    console.log(
      this.page_end[context],
      this.lazy_loader[context],
      !this.api.newsList[context].length
    );
    if (
      this.page_end[context] ||
      this.lazy_loader[context] ||
      !this.api.newsList[context].length
    )
      return;
    let { target } = event;
    let scroll_offset = 20;
    var isFullyScrolled =
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - scroll_offset;
    if (isFullyScrolled) {
      console.log(context);
      this.loadMore(context, sub_cat);
    }
  }

  loadMore(context, sub_cat) {
    console.log("inside loadmore");
    console.log(context, sub_cat);
    this.page_number[context] += 1;

    console.log(this.page_number[context]);
    let url = this.api.sections_main.mil.indian_forces.includes(sub_cat)
      ? "fetch_sub_news_cat"
      : "fetch_sub_news";
    console.log("load more url");

    console.log(context, sub_cat, this.country);
    this.fetch_sub_news(context, url, sub_cat);
  }

  checkScrolled_(event, context, sub_cat) {
    console.log("checkscrolled called");
    console.log("context ", context);
    console.log("sub_cat ", sub_cat);
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
    console.log("calling editorials");
    this.editorialList = [];

    this.loader_flag.editorial = false;
    this.api
      .getEditorials(
        this.corner,
        this.Dates_["editorial"],
        this.keywords_["editorial"],
        this.trending_flag["editorial"]
      )
      .subscribe({
        next: (data: any) => {
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
        error: (error) => {},
      });
  }

  fetch_twitter_data(context = "tweet", sub_cat = "", lazy_flag = false) {
    console.log("Fetchtwitter data passed subcat ", sub_cat);
    let sub_cats = [];

    this.loader_flag.tweet = false;

    if (sub_cat) {
      this.lazy_loader_[sub_cat] = true;

      if (sub_cat === "tweetsCombined") {
        // sub_cats =
        //   this.corner === "east_corner"
        //     ? this.api.sub_cats_t[this.cat]
        //     : this.api.sub_cats_t_internal[this.cat];

        sub_cats = this.api.getSubCats(
          this.cat,
          "all",
          this.corner,
          this.country
        );
        console.log("tweet subcats");
      } else {
        sub_cats = [sub_cat];
      }
    } else {
      // sub_cats =
      //   this.corner === "east_corner"
      //     ? this.api.sub_cats_t[this.cat]
      //     : this.api.sub_cats_t_internal[this.cat];
      sub_cats = this.api.getSubCats(
        this.cat,
        "all",
        this.corner,
        this.country,
        true
      );
      // Emptying the selected lists
      sub_cats.forEach((x) => {
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
          console.log(data);
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
            console.log("Inside if");
            if (!sub_cat) {
              this.api.tweetList[x] = data[x] ? this.formatData_(data[x]) : [];
              if (!this.api.tweetList["tweetsCombined"]) {
                this.api.tweetList["tweetsCombined"] = [];
              }
              if (data[x]) {
                this.api.tweetList["tweetsCombined"].push(
                  ...this.formatData_(data[x])
                );
              }
              console.log("twitter data ", this.api.tweetList);
              console.log("this.corner ", this.corner);
            } else {
              console.log("Inside else");
              data[x] &&
                this.api.tweetList[x].push(...this.formatData_(data[x]));
              if (data[x]) {
                this.api.tweetList["tweetsCombined"].push(
                  ...this.formatData_(data[x])
                );
              }
              console.log("twitter data ", this.api.tweetList);
              console.log("this.corner ", this.corner);
            }
          });

          sub_cat && (this.lazy_loader_[sub_cat] = false);
          this.ngxService.stop();

          // this.is_loading_tweets[origin] = false
        },
        error: (error) => {
          this.ngxService.stop();
          sub_cat && (this.lazy_loader_[sub_cat] = false);
          console.error("fetch_sub_news error: ", error);

          this.loader_flag.tweet = true;
        },

        complete: () => {
          this.ngxService.stop();
          console.log(this.api.tweetList["tweetsCombined"]);
          this.loader_flag.tweet = true;
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
    console.log("This happens");
    this.api.getTrendingHashtag(this.corner).subscribe({
      next: (data: any) => {
        if (!data?.hashtag?.length && !data?.keywords?.length) {
          return;
        }
        this.trendingHashtagList = data.hashtag;
        this.trendingwordsList = data.keywords;
      },
      error: (error) => {
        console.log("getTimes() error:", error);
      },
    });
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
    let resolved_cat =
      this.cat == "mil"
        ? "army"
        : this.cat == "intl"
        ? "international"
        : this.cat == "iiojk"
        ? "kashmir"
        : "domestic";
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
        this.api.sections_main[this.cat][ctx],
        this.corner,
        this.map_date[ctx]
      )
      .subscribe({
        next: (data: any) => {
          let res = data?.all_locations;
          this.map_loading[ctx] = false;
          if (!res || !Object.entries(res).length) return;
          this.news_locations[ctx] = res.slice(0, 100);
        },
        error: (error) => {
          console.log(error, "news: getMap()");
        },
      });
  }
  readMore(linkurl, id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.corner, id])
      )
    );
    window.open(url);
  }
  goBack(): void {
    window.location.href = "/#/explore/" + this.corner;
    window.location.reload();
    // this.router.navigate(['/explore',this.corner]);
  }
  isScrolling: any = false;

  // Editorials Function
  // scrollX(
  //   el: HTMLElement,
  //   by: number,
  //   val: number = 0,
  //   forDomestic = "",
  //   i = 0
  // ) {
  //   if (!el) return;
  //   if (this.isScrolling) return;
  //   this.isScrolling = true;
  //   console.log("el ", el, "by ", by, "val ", val);
  //   // Adjust editorialSliderCount

  //   if (val && forDomestic) {
  //     this.sliderCount["editorialSliderCount" + i]++;
  //   } else if (!val && forDomestic) {
  //     this.sliderCount["editorialSliderCount" + i]--;
  //   } else {
  //     if (val) {
  //       this.editorialSliderCount++;
  //     } else {
  //       this.editorialSliderCount--;
  //     }
  //   }

  //   // Scroll the element
  //   el.scrollBy({ left: by, behavior: "smooth" });

  //   // Set timeout to reset isScrolling
  //   setTimeout(() => {
  //     this.isScrolling = false;
  //   }, 300);
  //   let currentCat = forDomestic ? forDomestic : this.arr[0];
  //   // Check if the element has reached the end of the scroll
  //   el.addEventListener("scroll", () => {
  //     if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
  //       if (this.loading[currentCat]) {
  //         return;
  //       }

  //       console.log("this.page_number ", this.page_number[currentCat]);

  //       this.page_number[currentCat] = this.page_number[currentCat] + 1;
  //       this.fetch_methods(currentCat, false);
  //       console.log("Reached the end of the scroll");
  //       // Trigger your logic here when the end is reached
  //     }
  //   });
  // }

  // scrollX(el: HTMLElement, by: number, val: number = 0, forDomestic = '', i?: number) {
  //   if (!el) return;
  //   if (this.isScrolling) return;

  //   this.isScrolling = true;

  //   // Adjust editorialSliderCount using dynamic key if index provided
  //   const sliderKey = 'editorialSliderCount' + (i ?? '');
  //   if (val) {
  //     this.sliderCount[sliderKey] = (this.sliderCount[sliderKey] || 0) + 1;
  //   } else {
  //     this.sliderCount[sliderKey] = Math.max((this.sliderCount[sliderKey] || 0) - 1, 0);
  //   }

  //   // Perform smooth scroll
  //   el.scrollBy({ left: by, behavior: "smooth" });

  //   // Reset scroll lock
  //   setTimeout(() => {
  //     this.isScrolling = false;
  //   }, 300);

  //   const currentCat = forDomestic || this.arr[0];
  //   this.currentDomesticCat=forDomestic

  //   // ✅ Attach scroll listener ONCE per category
  //   if (!this.scrollListenersAttached[currentCat]) {
  //     el.addEventListener("scroll", () => {
  //       if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
  //         if (this.loading[currentCat]) return;

  //         this.page_number[currentCat] = this.page_number[currentCat] + 1;
  //         this.fetch_methods(currentCat, false);
  //         console.log("Reached the end of the scroll for", currentCat);
  //       }
  //     });

  //     this.scrollListenersAttached[currentCat] = true;
  //   }
  // }
  // Add this to your component class:
  scrollX(
    el: HTMLElement,
    by: number,
    val: number = 0,
    forDomestic = "",
    i?: number
  ) {
    if (!el) return;
    if (this.isScrolling) return;

    this.isScrolling = true;

    // Update slider count per index (unique key)
    const sliderKey = "editorialSliderCount" + (i ?? "");
    if (forDomestic) {
      if (val) {
        this.sliderCount[sliderKey] = (this.sliderCount[sliderKey] || 0) + 1;
      } else {
        this.sliderCount[sliderKey] = Math.max(
          (this.sliderCount[sliderKey] || 0) - 1,
          0
        );
      }
    } else {
      if (val) {
        this.editorialSliderCount++;
      } else {
        this.editorialSliderCount--;
      }
    }

    // Scroll the element
    el.scrollBy({ left: by, behavior: "smooth" });

    // Unlock after short delay
    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
    const currentCat = forDomestic || this.arr[0];
    console.log("forDomesticx ", currentCat);
    this.currentDomesticCat = currentCat;

    // Attach scroll listener once for the given category
    this.attachScrollListener(el, currentCat);
  }

  attachScrollListener(el: HTMLElement, category: string) {
    console.log("attachScrollListener called");
    console.log(
      "category ",
      category,
      "this.loading ",
      this.loading,
      " scrollListenersAttached ",
      this.scrollListenersAttached
    );
    if (!el || this.scrollListenersAttached[category]) return;

    el.addEventListener("scroll", () => {
      console.log("listener attached");
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;

      if (atEnd) {
        console.log("atEnd ", atEnd, this.loading, ",this.loading");
        if (this.loading[category]) return;

        this.page_number[category] = (this.page_number[category] || 1) + 1;
        this.fetch_methods(category, false);
        console.log("Reached the end of scroll for", category);
      }
    });

    this.scrollListenersAttached[category] = true;
  }

  scrollEdges(el, context) {
    console.log("scrollEdges called");
    console.log("ell ", el);
    el.parentElement.classList.remove("hide_right");
    el.parentElement.classList.remove("hide_left");
    if (el.scrollLeft <= 0) {
      el.parentElement.classList.add("hide_left");
    }
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 0.5) {
      el.parentElement.classList.add("hide_right");
      this.loadMoreHorizontalContent(context);
    }
  }

  loadMoreHorizontalContent(context) {
    console.log("loadMoreHorizontalContent called");
    if (this.page_end[context] || this.lazy_loader[context]) return;

    this.page_number[context] += 1;
    let url = "fetch_sub_news";

    this.lazy_loader[context] = true;

    this.fetch_sub_news(context, url);
  }

  getColumns(n) {
    return Math.ceil(n / 2);
  }

  // This method will returhn
  getKeysArray(): any[] {
    if (this.corner === "east_corner") {
      return this.api.sub_cats_t[this.cat];
    } else if (this.corner === "internal_security") {
      return this.api.sub_cats_t_internal[this.cat];
    }
    return [];
  }
  setRootVariable(variable: string, value: string): void {
    document.documentElement.style.setProperty(variable, value);
  }
  getTitleBar() {
    console.log("➡️ getTitleBar called");

    let titleBar = "",
      background = "",
      button = "";

    try {
      if (this.corner !== "west_corner") {
        if (this.api.theme?.[this.cat]) {
          titleBar = this.api.theme[this.cat].titleBar || "";
          background = this.api.theme[this.cat].background || "";
          button = this.api.theme[this.cat].buttonBg || "";
        } else {
          console.warn("⚠️ Missing theme for cat:", this.cat);
        }
      } else {
        if (this.api.theme?.[this.corner]?.[this.cat]) {
          titleBar = this.api.theme[this.corner][this.cat].titleBar || "";
          background = this.api.theme[this.corner][this.cat].background || "";
          button = this.api.theme[this.corner][this.cat].buttonBg || "";
        } else {
          console.warn(
            "⚠️ Missing theme for corner/cat:",
            this.corner,
            this.cat
          );
        }
      }

      this.setRootVariable("--text-gradient1", background);
      this.setRootVariable("--background", titleBar);
      this.setRootVariable("--buttonBg", button);
    } catch (err) {
      console.error("❌ Error in getTitleBar():", err);
    }
  }
}
