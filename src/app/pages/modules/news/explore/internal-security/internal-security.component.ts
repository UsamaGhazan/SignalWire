import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
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
  selector: "app-internal-security",
  templateUrl: "./internal-security.component.html",
  styleUrls: ["./internal-security.component.css"],
})
export class InternalSecurityComponent implements OnInit, OnDestroy {
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
  ) {}

  antiStateInterval: any;
  antiStateTopCursor: string | null = null;
  antiStateBottomCursor: string | null = null;

  militaryInterval: any;
  militaryTopCursor: string | null = null;
  militaryBottomCursor: string | null = null;

  isInterval: any;
  isTopCursor: string | null = null;
  isBottomCursor: string | null = null;

  polpartiesInterval: any;
  polpartiesTopCursor: string | null = null;
  polpartiesBottomCursor: string | null = null;

  govtInterval: any;
  govtTopCursor: string | null = null;
  govtBottomCursor: string | null = null;

  now_time: any = new Date();

  id: any = "";
  origin = "";
  weathers: any = [];
  zSearch = "";
  NewsList_report: any = {
    govt: [],
    polparties: [],
    is: [],
    military: [],
    diplomat: [],
  };
  tweetList_report: any = {
    govt: [],
    polparties: [],
    is: [],
    military: [],
    anti_state: [],
  };
  sub_cats = {
    govt: ["govt"],
    polparties: ["polparties"],
    is: ["is"],
    military: ["military"],
    diplomat: ["diplomat"],
    all: ["govt", "polparties", "is", "military", "diplomat"],
  };

  editorials: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  multiselect_date: any = {
    news: "",
    tweet: "",
    podcast: "",
    editorial: "",
  };
d
  auth_search_keyword = "";

  ngOnInit(): void {
    // this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    // this.origin="east_corner"
    this.getNews();
    this.getTweets();
    this.getProdCasts();
    this.getEditorials();
    this.fetchPriorities(this.origin);
    this.getChannels(this.origin);

    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop();
    }, 5000);
    // this.getReportNews()

    // this.fetchInitialAntiState();
    // this.antiStateInterval = setInterval(() => {
    //   this.fetchNewerAntiState();
    // }, 10000);

    // this.fetchInitialMilitary();
    // this.militaryInterval = setInterval(() => {
    //   this.fetchNewerMilitary();
    // }, 10000);

    // this.fetchInitialIs();
    // this.isInterval = setInterval(() => {
    //   this.fetchNewerIs();
    // }, 10000);

    // this.fetchInitialPolparties();
    // this.polpartiesInterval = setInterval(() => {
    //   this.fetchNewerPolparties();
    // }, 10000);

    // this.fetchInitialGovt();
    // this.govtInterval = setInterval(() => {
    //   this.fetchNewerGovt();
    // }, 10000);
  }

  ngOnDestroy(): void {
    // if (this.antiStateInterval) {
    //   clearInterval(this.antiStateInterval);
    // }
    // if (this.militaryInterval) {
    //   clearInterval(this.militaryInterval);
    // }
    // if (this.isInterval) {
    //   clearInterval(this.isInterval);
    // }
    // if (this.polpartiesInterval) {
    //   clearInterval(this.polpartiesInterval);
    // }
    // if (this.govtInterval) {
    //   clearInterval(this.govtInterval);
    // }
  }

  fetchInitialAntiState(): void {
    this.lazy_loader_["anti_state"] = true;
    fetch('http://192.168.100.110:8090/internal_corner_anti_state?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.antiStateTopCursor = data.top_cursor;
          this.antiStateBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["anti_state"] = [];
          this.processCursorData(data.data, 'initial', 'anti_state');
        }
        this.lazy_loader_["anti_state"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Anti State data:', err);
        this.lazy_loader_["anti_state"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerAntiState(): void {
    if (!this.antiStateTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/internal_corner_anti_state?top_cursor=${encodeURIComponent(this.antiStateTopCursor)}`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.antiStateTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'anti_state');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Anti State data:', err);
      });
  }

  fetchOlderAntiState(): void {
    if (!this.antiStateBottomCursor || this.lazy_loader_["anti_state"]) return;
    
    this.lazy_loader_["anti_state"] = true;
    fetch(`http://192.168.100.110:8090/internal_corner_anti_state?bottom_cursor=${encodeURIComponent(this.antiStateBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.antiStateBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'anti_state');
        }
        this.lazy_loader_["anti_state"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Anti State data:', err);
        this.lazy_loader_["anti_state"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialMilitary(): void {
    this.lazy_loader_["military"] = true;
    fetch('http://192.168.100.110:8090/internal_corner_military?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.militaryTopCursor = data.top_cursor;
          this.militaryBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["military"] = [];
          this.processCursorData(data.data, 'initial', 'military');
        }
        this.lazy_loader_["military"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Military data:', err);
        this.lazy_loader_["military"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerMilitary(): void {
    if (!this.militaryTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/internal_corner_military?top_cursor=${encodeURIComponent(this.militaryTopCursor)}`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.militaryTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'military');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Military data:', err);
      });
  }

  fetchOlderMilitary(): void {
    if (!this.militaryBottomCursor || this.lazy_loader_["military"]) return;
    
    this.lazy_loader_["military"] = true;
    fetch(`http://192.168.100.110:8090/internal_corner_military?bottom_cursor=${encodeURIComponent(this.militaryBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.militaryBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'military');
        }
        this.lazy_loader_["military"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Military data:', err);
        this.lazy_loader_["military"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialIs(): void {
    this.lazy_loader_["is"] = true;
    fetch('http://192.168.100.110:8090/internal_corner_is?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.isTopCursor = data.top_cursor;
          this.isBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["is"] = [];
          this.processCursorData(data.data, 'initial', 'is');
        }
        this.lazy_loader_["is"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial IS data:', err);
        this.lazy_loader_["is"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerIs(): void {
    if (!this.isTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/internal_corner_is?top_cursor=${encodeURIComponent(this.isTopCursor)}`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.isTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'is');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer IS data:', err);
      });
  }

  fetchOlderIs(): void {
    if (!this.isBottomCursor || this.lazy_loader_["is"]) return;
    
    this.lazy_loader_["is"] = true;
    fetch(`http://192.168.100.110:8090/internal_corner_is?bottom_cursor=${encodeURIComponent(this.isBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.isBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'is');
        }
        this.lazy_loader_["is"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older IS data:', err);
        this.lazy_loader_["is"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialPolparties(): void {
    this.lazy_loader_["polparties"] = true;
    fetch('http://192.168.100.110:8090/internal_corner_polparties?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.polpartiesTopCursor = data.top_cursor;
          this.polpartiesBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["polparties"] = [];
          this.processCursorData(data.data, 'initial', 'polparties');
        }
        this.lazy_loader_["polparties"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Polparties data:', err);
        this.lazy_loader_["polparties"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerPolparties(): void {
    if (!this.polpartiesTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/internal_corner_polparties?top_cursor=${encodeURIComponent(this.polpartiesTopCursor)}`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.polpartiesTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'polparties');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Polparties data:', err);
      });
  }

  fetchOlderPolparties(): void {
    if (!this.polpartiesBottomCursor || this.lazy_loader_["polparties"]) return;
    
    this.lazy_loader_["polparties"] = true;
    fetch(`http://192.168.100.110:8090/internal_corner_polparties?bottom_cursor=${encodeURIComponent(this.polpartiesBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.polpartiesBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'polparties');
        }
        this.lazy_loader_["polparties"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Polparties data:', err);
        this.lazy_loader_["polparties"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialGovt(): void {
    this.lazy_loader_["govt"] = true;
    fetch('http://192.168.100.110:8090/internal_corner_govt?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.govtTopCursor = data.top_cursor;
          this.govtBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["govt"] = [];
          this.processCursorData(data.data, 'initial', 'govt');
        }
        this.lazy_loader_["govt"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Govt data:', err);
        this.lazy_loader_["govt"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerGovt(): void {
    if (!this.govtTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/internal_corner_govt?top_cursor=${encodeURIComponent(this.govtTopCursor)}`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.govtTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'govt');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Govt data:', err);
      });
  }

  fetchOlderGovt(): void {
    if (!this.govtBottomCursor || this.lazy_loader_["govt"]) return;
    
    this.lazy_loader_["govt"] = true;
    fetch(`http://192.168.100.110:8090/internal_corner_govt?bottom_cursor=${encodeURIComponent(this.govtBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.govtBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'govt');
        }
        this.lazy_loader_["govt"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Govt data:', err);
        this.lazy_loader_["govt"] = false;
        this.cdr.detectChanges();
      });
  }

  processCursorData(items: any[], type: 'initial' | 'top' | 'bottom', cat: string): void {
    const processedItems = items.map((element: any) => {
      const desc_ = element.text;
      const keywords_ = element.exist_keywords || [];
      
      return {
        id: element._id,
        name: element.user?.name || '',
        screen_name: element.user?.screen_name || '',
        profile_image_url: element.user?.profile_image_url || '',
        description: this.api.highlightWords(desc_, keywords_),
        report_desc: desc_,
        created_at: this.api.formatDate(element.created_at),
        keywords: keywords_,
        id_str: element.id_str,
        cat_hits: element.cat_hits,
        tweet_image: element.tweet_image || '',
      };
    });

    if (!this.api.tweetList_explore[cat]) {
      this.api.tweetList_explore[cat] = [];
    }

    if (type === 'top') {
      for (let i = processedItems.length - 1; i >= 0; i--) {
        const item = processedItems[i];
        if (!this.api.tweetList_explore[cat].some((t: any) => t.id_str === item.id_str)) {
          this.api.tweetList_explore[cat].unshift(item);
        }
      }
    } else {
      processedItems.forEach(item => {
        if (!this.api.tweetList_explore[cat].some((t: any) => t.id_str === item.id_str)) {
          this.api.tweetList_explore[cat].push(item);
        }
      });
    }
  }

  moveNews(id, cat, sub_cat) {
    console.log({ news_id: id, catagory: cat });
    this.api.moveNews(cat, sub_cat, this.origin, id).subscribe((data: any) => {
      if (data.message) {
        this.toastr.success("Catagory updated Successfully");
      }
    });
  }
  // dropx(event:any) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  //                       this.moveNews(event.item.data.id,event.container.id)
  //                       // $("#"+event.container.element.nativeElement.id+'_notfound').hide()
  //                     }

  // }

  getColumns(n) {
    return Math.ceil(n / 2);
  }

  keyword = {
    news: "",
    tweet: "",
    podcast: "",
    editorial: "",
    report: "",
  };
  Dates = {
    news: "latest",
    tweet: "latest",
    podcast: "latest",
    editorial: "latest",
    report: "latest",
  };
  trending_flag = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
  };
  loader_flag = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
    report: false,
  };

  lazy_loader = {
    govt: false,
    polparties: false,
    is: false,
    military: false,
    diplomat: false,
  };
  page_number = {
    govt: 1,
    polparties: 1,
    is: 1,
    military: 1,
    diplomat: 1,
  };
  lazy_loader_ = {
    govt: false,
    polparties: false,
    is: false,
    military: false,
    anti_state: false,
  };
  page_number_ = {
    govt: 1,
    polparties: 1,
    is: 1,
    military: 1,
    anti_state: 1,
  };
  lazy_loader_p = {
    govt: false,
    polparties: false,
    is: false,
    military: false,
    diplomat: false,
  };
  page_number_p = {
    govt: 1,
    polparties: 1,
    is: 1,
    military: 1,
    diplomat: 1,
  };

  getNews(context = "all") {
    let cats_ = this.sub_cats[context]?.join(",");
    if (context == "all") {
      this.api.NewsList_explore["govt"] = [];
      this.api.NewsList_explore["polparties"] = [];
      this.api.NewsList_explore["is"] = [];
      this.api.NewsList_explore["military"] = [];
      this.api.NewsList_explore["diplomat"] = [];
      this.lazy_loader = {
        govt: false,
        polparties: false,
        is: false,
        military: false,
        diplomat: false,
      };
      this.page_number = {
        govt: 1,
        polparties: 1,
        is: 1,
        military: 1,
        diplomat: 1,
      };
      this.loader_flag.news = false;
    } else {
    }
    // this.ngxService.start();
    this.api
      .filterNewsandTweets(
        this.origin,
        "news",
        this.Dates["news"],
        this.keyword["news"],
        this.trending_flag["news"],
        cats_,
        context != "all" ? this.page_number[context] : 1
      )
      .subscribe(
        (data: any) => {
          var res: any = data?.data;
          this.loader_flag.news = true;
          context != "all" && (this.lazy_loader[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
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
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || "",
              };
              let resolved_key = key; //== 'govt' ? 'govt' : key == 'polparties' ? 'polparties' : key == 'is' ? 'is' : 'military';
              this.api.NewsList_explore[resolved_key]?.push(newsFormate);
              // this.NewsList_report[resolved_key]?.push({ "data": newsFormate, "flag": true })
            });
            // element?._source?.data?.cat_hits == "army" ? this.api.NewsList_explore['govt'].push(newsFormate) : element?._source?.data?.cat_hits == "international" ? this.api.NewsList_explore['polparties'].push(newsFormate) : element?._source?.data?.cat_hits == "kashmir" ? this.api.NewsList_explore['is'].push(newsFormate) : this.api.NewsList_explore['military'].push(newsFormate)
          });
          // this.ngxService.stop();
        },
        (error) => {
          // this.ngxService.stop();
        }
      );
  }

  getReportNews() {
    this.NewsList_report["govt"] = [];
    this.NewsList_report["polparties"] = [];
    this.NewsList_report["is"] = [];
    this.NewsList_report["military"] = [];

    this.loader_flag.report = true;

    // this.ngxService.start();
    this.api
      .filterNewsandTweets(
        this.origin,
        "news",
        this.Dates["report"],
        this.keyword["report"],
        false,
        "govt,polparties,is,military,diplomat",
        1
      )
      .subscribe(
        (data: any) => {
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
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
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
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || "",
              };
              let resolved_key = key; //== 'govt' ? 'govt' : key == 'polparties' ? 'polparties' : key == 'is' ? 'is' : 'military';
              this.NewsList_report[resolved_key]?.push({
                data: newsFormate,
                flag: true,
              });
            });
          });
          // this.ngxService.stop();
        },
        (error) => {
          // this.ngxService.stop();
        }
      );
  }

  getReportTweets() {
    this.tweetList_report["govt"] = [];
    this.tweetList_report["polparties"] = [];
    this.tweetList_report["is"] = [];
    this.tweetList_report["military"] = [];
    this.loader_flag.report = true;

    this.api
      .filterNewsandTweets(
        this.origin,
        "tweet",
        this.Dates["report"],
        this.keyword["report"],
        this.trending_flag["report"],
        "govt,polparties,is,military,anti_state",
        1
      )
      .subscribe(
        (data: any) => {
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
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
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
                tweet_image: element.tweet_image,
              };
              let resolved_key = key; //== 'govt' ? 'govt' : key == 'polparties' ? 'polparties' : key == 'is' ? 'is' : 'military';
              this.tweetList_report[resolved_key]?.push({
                data: newsFormate,
                flag: false,
              });
            });
          });

          // this.is_lazy_loader_tweets[origin] = false
        },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        }
      );
  }

  getTweets(context = "all") {
    let cats_ =
      this.sub_cats[context == "anti_state" ? "diplomat" : context]?.join(",");
    if (cats_) cats_ = cats_.replace("diplomat", "anti_state");

    if (context == "all") {
      this.api.tweetList_explore["govt"] = [];
      this.api.tweetList_explore["polparties"] = [];
      this.api.tweetList_explore["is"] = [];
      this.api.tweetList_explore["military"] = [];
      // this.api.tweetList_explore["anti_state"] = [];
      this.lazy_loader_ = {
        govt: false,
        polparties: false,
        is: false,
        military: false,
        anti_state: false,
      };
      this.page_number_ = {
        govt: 1,
        polparties: 1,
        is: 1,
        military: 1,
        anti_state: 1,
      };
      this.loader_flag.tweet = false;
    } else {
    }
    this.api
      .filterNewsandTweets(
        this.origin,
        "tweet",
        this.Dates["tweet"],
        this.keyword["tweet"],
        this.trending_flag["tweet"],
        cats_,
        context != "all" ? this.page_number_[context] : 1
      )
      .subscribe(
        (data: any) => {
          this.loader_flag.tweet = true;
          var res: any = data?.data;
          context != "all" && (this.lazy_loader_[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
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
                tweet_image: element.tweet_image,
              };
              let resolved_key = key; //== 'govt' ? 'govt' : key == 'polparties' ? 'polparties' : key == 'is' ? 'is' : 'military';
              this.api.tweetList_explore[resolved_key]?.push(newsFormate);
              // this.tweetList_report[resolved_key]?.push({ "data": newsFormate, "flag": false })
            });
          });

          // this.is_lazy_loader_tweets[origin] = false
        },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        }
      );
  }

  loadMore(context, type) {
    if (type == "news") {
      this.lazy_loader[context] = true;
      this.page_number[context] += 1;
      this.getNews(context);
    } else if (type == "tweet") {
      if (context === "anti_state") {
        this.fetchOlderAntiState();
      } else if (context === "military") {
        this.fetchOlderMilitary();
      } else if (context === "is") {
        this.fetchOlderIs();
      } else if (context === "polparties") {
        this.fetchOlderPolparties();
      } else if (context === "govt") {
        this.fetchOlderGovt();
      }
      this.lazy_loader_[context] = true;
      this.page_number_[context] += 1;
      this.getTweets(context);
    } else {
      this.lazy_loader_p[context] = true;
      this.page_number_p[context] += 1;
      this.getProdCasts(context);
    }
  }

  prodList = [];
  getProdCasts(context = "all") {
    let cats_ = this.sub_cats[context]?.join(",");
    if (context == "all") {
      this.api.podcastList_explore["govt"] = [];
      this.api.podcastList_explore["polparties"] = [];
      this.api.podcastList_explore["is"] = [];
      this.api.podcastList_explore["military"] = [];
      this.api.podcastList_explore["diplomat"] = [];
      this.lazy_loader_p = {
        govt: false,
        polparties: false,
        is: false,
        military: false,
        diplomat: false,
      };
      this.page_number_p = {
        govt: 1,
        polparties: 1,
        is: 1,
        military: 1,
        diplomat: 1,
      };
      this.loader_flag.tweet = false;
    } else {
    }
    this.api
      .getProdCasts(
        this.Dates["podcast"],
        this.origin,
        this.keyword["podcast"],
        context != "all" ? this.page_number_p[context] : 1,
        cats_
      )
      .subscribe(
        (data: any) => {
          var res: any = data?.data;
          this.loader_flag.podcast = true;
          context != "all" && (this.lazy_loader_p[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            var yt_: any = values[i];

            yt_.forEach((element) => {
              let newsFormate = {
                id: element._id,
                link: element._source.link,
                title: element._source.title,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                channel_handle: element._source.channel_handle,
                video_id: element._source.video_id,
                cat_hits: element._source?.data?.cat_hits,
              };
              let resolved_key = key; //== 'govt' ? 'govt' : key == 'polparties' ? 'polparties' : key == 'is' ? 'is' : 'military';
              this.api.podcastList_explore[resolved_key]?.push(newsFormate);
              // this.prodList.push(newsFormate)
            });
          });
          // this.is_lazy_loader_tweets[origin] = false
        },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        }
      );
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
      },
      (error) => {
        console.log("getTimes() error:", error);
      }
    );
  }
  flashNewsList = [];

  editorialList = [];
  getEditorials() {
    this.editorialList = [];

    this.loader_flag.editorial = false;
    this.api
      .getEditorials(
        this.origin,
        this.Dates["editorial"],
        this.keyword["editorial"],
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
            setTimeout(() => {
              this.scrollEdges(($("#editorial_scroller") as any)[0]);
            }, 1000);
            console.log("editorial", this.editorialList);
          }
        },
        (error) => {}
      );
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
  isScrolling: any = false;
  scrollX(el, by) {
    if (!el) return;
    if (this.isScrolling) return;
    this.isScrolling = true;
    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
    el?.scrollBy({ left: by, behavior: "smooth" });
  }

  scrollEdges(el) {
    el.parentElement.classList.remove("hide_right");
    el.parentElement.classList.remove("hide_left");
    if (el.scrollLeft <= 0) {
      el.parentElement.classList.add("hide_left");
    }
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 0.5) {
      el.parentElement.classList.add("hide_right");
    }
  }

  filter_report_date(context) {
    if (!this.multiselect_date[context]) {
      return;
    }
    var now = this.multiselect_date[context];

    this.Dates[context] =
      now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate();

    if (context == "news") {
      this.getNews();
    }
    if (context == "tweet") {
      this.getTweets();
    }
    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "podcast") {
      this.getProdCasts();
    }
  }
  // newsDetails(id) {
  //   const url = this.location.prepareExternalUrl(
  //     this.router.serializeUrl(
  //       this.router.createUrlTree(["/news-details", this.origin, id])
  //     )
  //   );
  //   window.open(url);
  // }
  // newsDetails(id: string, cat_hits: string) {
  //   console.log("tango cat_hits afghanistan ", cat_hits);
  //   this.router.navigate(["/news-details", this.origin, id], {
  //     state: { cat_hits },
  //   });
  // }
  newsDetails(id: string, cat_hits: string) {
 
  window.open(`${window.location.origin}/#/news-details/${this.origin}/${id}?cat_hits=${cat_hits}`, '_blank');

}
  changeFilter(event) {
    let context = event.context;
    let value = event.value;

    this.Dates[context] = value;
    this.multiselect_date = [];
    if (context == "report") {
      this.getReportNews();
      this.getReportTweets();
    }
    if (context == "news") {
      this.getNews();
    }
    if (context == "tweet") {
      this.getTweets();
    }
    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "podcast") {
      this.getProdCasts();
    }
  }

  gotoLink(link, direct: any = "") {
    if (!direct) {
      link = link.includes("http") ? link : "https://" + link;
    } else {
      typeof direct == "object" && direct.stopPropagation();
    }
    window.open(link);
  }

  gotoHome() {
    this.router.navigate([""]);
  }

  includesText(list, text) {
    return JSON.stringify(list).includes(`"cat_hits":"${text}"`);
  }

  all_channels = [];
  selected_priorities = [];
  priority_flag = false;

  fetchPriorities(origin) {
    this.api.getProrities(origin).subscribe(
      (data: any) => {
        if (!data || !Object.entries(data).length) return;
        if (data.priority) {
          this.selected_priorities = data.priority;
        }
      },
      (error) => {
        console.log(error, "priorities-error");
      }
    );
  }

  getChannels(origin) {
    this.api.getChannels(origin).subscribe(
      (data: any) => {
        if (!data || !Object.entries(data).length) return;
        if (data.priority) {
          this.all_channels = data.priority;
        }
      },
      (error) => {
        console.log(error, "channels-error");
      }
    );
  }

  addPriority(value) {
    if (this.selected_priorities.includes(value)) {
      this.toastr.warning("already exists in priority list!");
      return;
    }
    if (this.selected_priorities.length > 4) {
      this.toastr.warning("Priority Stack is full!");
      return;
    }
    this.selected_priorities.push(value);
    this.priority_flag = true;
  }

  removePriority(value) {
    this.selected_priorities = this.selected_priorities.filter(
      (x) => x != value
    );
    this.priority_flag = true;
  }

  drop(event) {
    moveItemInArray(
      this.selected_priorities,
      event.previousIndex,
      event.currentIndex
    );
    this.priority_flag = true;
  }

  applyFilter(event) {
    let form_body = new URLSearchParams();
    form_body.append(
      "priority_list",
      this.selected_priorities?.map((x) => x.channel)?.join(",")
    );
    form_body.append(
      "priority_name",
      this.selected_priorities?.map((x) => x.name)?.join(",")
    );
    form_body.append("user_id", this.api.uid + "");
    form_body.append("category", this.origin);

    fetch(this.api.ip + "update_priority", {
      method: "POST",
      body: form_body,
    })
      .then((y) => y.json())
      .then((data: any) => {
        console.log("data: ", data);
        if (data?.message?.includes("success")) {
          this.toastr.success("Priority list updated successfully!");
          this.fetchPriorities(this.origin);
        } else {
          this.toastr.error("something went wrong! try again!");
        }
      });
  }
  addToList(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
  _link = "";
  rep_flag = "";
  anychange = false;
  printReport() {
    if (!this.anychange && this.rep_flag) {
      window.open(this._link);
      return;
    }
    var NewsReportData: any = {};
    var TweetReportData: any = {};
    var originx = this.origin.toUpperCase().replace("_", " ");
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
    console.log({
      corner: originx,
      news: NewsReportData,
      tweets: TweetReportData,
    });
    let ws_ = new WebSocket(global_pointer.news_addr_ws);
    var key_json = {};

    key_json = {
      corner: originx,
      news: NewsReportData,
      tweets: TweetReportData,
    };
    ws_.onopen = function () {
      ws_.send(JSON.stringify(key_json));
    };
    ws_.onmessage = (evt) => {
      let b_ = JSON.parse(evt?.data);
      if (b_?.path) {
        this._link = (this.api.ip + b_.path).replace("/api", "");
        this.rep_flag = "done";
        this.anychange = false;
        window.open(this._link);
      }
    };
  }
  customReport() {
    this.anychange = true;
    this.rep_flag = "";
  }

  // translateByMSApi(text,i){

  //   const apiKey = 'da28ea7eebc1426a91c49a140326f0b8';
  //   const apiUrl = 'https://api.cognitive.microsofttranslator.com/translate';
  //   // Build the request URL with language detection and translation to English
  //   const requestUrl = `${apiUrl}?api-version=3.0&to=en`;
  //   // const requestUrl = `${apiUrl}?api-version=3.0&from=mr&to=en`;

  //   // Request payload
  //   const requestBody = [
  //     { 'Text': text }
  //   ];

  //   // Make the API request
  //   fetch(requestUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Ocp-Apim-Subscription-Key': apiKey,
  //       'Ocp-Apim-Subscription-Region': 'eastasia',
  //     },
  //     body: JSON.stringify(requestBody),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Handle the translation response
  //       console.log('Detected Source Language:', data[0].detectedLanguage.language);
  //       console.log('Translation to English:', data[0].translations[0].text);
  //       $("#trans"+i).text(data[0].translations[0].text)
  //       // return data[0].translations[0].text;
  //     })
  //     .catch(error => {
  //       // Handle errors
  //       console.error('Error:', error);
  //     });
  // }
  setimage(url) {
    return url.includes("pakistantoday.com")
      ? "https://getanainstasuny.osintcenter.org/instagram/index1.php?imagelink=" +
          url
      : url;
  }
  results = new Array(10);
  onScrollx(): void {
    console.log("scrolled");
    this.results = this.results.concat(new Array(10));
  }
}
