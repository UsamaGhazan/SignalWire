import { ChangeDetectorRef, Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { DataService } from 'src/service/data.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { global_pointer } from 'src/assets/js/global_config';
import { offset } from 'highcharts';

@Component({
  selector: 'app-east-corner',
  templateUrl: './east-corner.component.html',
  styleUrls: ['./east-corner.component.css']
})

export class EastCornerComponent implements OnInit, OnDestroy {

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
    ) { }
    customSummary:any=''
    now_time: any = new Date()
  youtubeLink:any=''
    id: any = ""
    origin = ""
    weathers: any = []
    zSearch = ""
    NewsList_report: any = {
      mil: [],
      intl: [],
      iiojk: [],
      domestic: []
    }
    tweetList_report: any = {
      mil: [],
      intl: [],
      iiojk: [],
      domestic: []
    }
    customTweetsState: any = {
      'mil': { topCursor: '', bottomCursor: '', interval: null, endpoint: 'east_corner_army' },
      'intl': { topCursor: '', bottomCursor: '', interval: null, endpoint: 'east_corner_international' },
      'iiojk': { topCursor: '', bottomCursor: '', interval: null, endpoint: 'east_corner_kashmir' },
      'domestic': { topCursor: '', bottomCursor: '', interval: null, endpoint: 'east_corner_domestic' }
    };
    
    visionPulseList: any = {
      mil: [],
      intl: [],
      iiojk: [],
      domestic: []
    }
    visionPulseState: any = {
      interval: null
    };

    sub_cats = {
      "mil": ["army"],
      "intl": ["international"],
      "iiojk": ["kashmir"],
      "domestic": ["domestic"],
      "all": ["army", "international", "kashmir", "domestic"]
    }
  
    // now_t: any = "--:-- --"
    // now_d: any = "---, -- ----"
    // localtime: any = {
    //   "Islamabad": "---, -- --- ---- --:--:-- --",
    //   "New Delhi": "---, -- --- ---- --:--:-- --",
    //   "Srinager": "---, -- --- ---- --:--:-- --",
    //   "Washington": "---, -- --- ---- --:--:-- --"
    // }
    editorials: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    multiselect_date: any = {
      news: "",
      tweet: "",
      podcast: "",
      editorial: ""
    }

    auth_search_keyword = ""
  
    ngOnInit(): void {
      // this.id = this._Activatedroute.snapshot.paramMap.get("id");
      this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
      // this.getWeather(this.origin);
      // this.getTopKeywords()
      // this.getTrendingHashtag()
      // this.getFlashNews()
      this.getNews()
      // this.getTimes();
      // this.getCustomTweetsInitial('mil');
      // this.getCustomTweetsInitial('intl');
      // this.getCustomTweetsInitial('iiojk');
      // this.getCustomTweetsInitial('domestic');
      this.getProdCasts()
      this.getEditorials()
      this.fetchPriorities(this.origin)
      this.getChannels(this.origin)
      this.getTweets()
      this.getVisionPulse()
      // setInterval(() => {
      //   this.getTimes();
      // }, 1000)
  
      this.ngxService.start();
      setTimeout(() => {
        this.ngxService.stop();
      }, 5000);
      // this.getReportNews()
      // this.getEditorialSourceOrAuth(this.origin,"sources")
      // this.getEditorialSourceOrAuth(this.origin,"authors") 
    }
  
    ngOnDestroy() {
      ['mil', 'intl', 'iiojk', 'domestic'].forEach(cat => {
        if (this.customTweetsState[cat].interval) {
          clearInterval(this.customTweetsState[cat].interval);
        }
      });
      if (this.visionPulseState.interval) {
        clearInterval(this.visionPulseState.interval);
      }
    }

    getCustomTweetsInitial(category: string) {
      this.fetchCustomTweets(category, '', 'bottom').then(() => {
          this.customTweetsState[category].interval = setInterval(() => {
              if (this.customTweetsState[category].topCursor) {
                  this.fetchCustomTweets(category, this.customTweetsState[category].topCursor, 'top');
              }
          }, 10000);
      });
    }

    fetchCustomTweets(category: string, cursor: string = '', cursorType: 'top' | 'bottom' = 'bottom') {
      let endpoint = this.customTweetsState[category].endpoint;
      let url = `http://192.168.100.110:8090/${endpoint}`;
      let params = new URLSearchParams();
      if (cursor) {
          params.append(cursorType, cursor);
      }
      params.append('size', '20');
      
      return fetch(url + '?' + params.toString(), {
        method: 'GET',
        headers: {
          'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4; session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4; session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && data.data) {
          if (!cursor) {
              this.customTweetsState[category].topCursor = data.top_cursor;
              this.customTweetsState[category].bottomCursor = data.bottom_cursor;
          } else if (cursorType === 'top') {
              this.customTweetsState[category].topCursor = data.top_cursor;
          } else if (cursorType === 'bottom') {
              this.customTweetsState[category].bottomCursor = data.bottom_cursor;
          }

          let newTweets = data.data.map((element: any) => {
              let desc_ = element.text;
              let keywords_ = element.exist_keywords || [];
              return {
                  id: element._id,
                  name: element.user?.name,
                  screen_name: element.user?.screen_name,
                  profile_image_url: element.user?.profile_image_url,
                  description: this.api.highlightWords(desc_, keywords_),
                  report_desc: desc_,
                  created_at: this.api.formatDate(element.created_at),
                  keywords: keywords_,
                  id_str: element.id_str,
                  cat_hits: element.cat_hits,
                  tweet_image: element.tweet_image
              };
          });

          if (!this.api.tweetList_explore[category]) {
              this.api.tweetList_explore[category] = [];
          }

          const existingIds = new Set(this.api.tweetList_explore[category].map((t: any) => t.id_str));
          newTweets = newTweets.filter((t: any) => !existingIds.has(t.id_str));

          if (cursorType === 'top') {
             this.api.tweetList_explore[category] = [...newTweets, ...this.api.tweetList_explore[category]];
          } else {
             this.api.tweetList_explore[category] = [...this.api.tweetList_explore[category], ...newTweets];
          }
        }
      }).catch(err => {
          console.error(`Error fetching ${category} tweets from external source`, err);
      }).finally(() => {
          this.lazy_loader_[category] = false;
      });
    }

    getWeather(region) {
      this.api.getWeather(region).subscribe(
        (data: any) => {
          let w = data?.data;
  
          if (!w || !Object.entries(w).length) {
            return;
          }
  
          let weekly_report = w?.days?.map(x => {
            let date = new Date(x.datetime);
            let day = date?.toDateString()?.split(' ')?.[0]
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
              last_updated: date?.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
              city: w.address,
              country: region == 'east_corner' ? 'India' : region == 'west_corner' ? 'Afghanistan' : 'Pakistan',
              key: region,
            }
          })
  
          this.weathers = weekly_report;
        },
        error => {
          console.log(error, "getWeather error")
        }
      )
    }
    moveNews(id, cat, sub_cat) {
      console.log({ "news_id": id, "catagory": cat })
      this.api.moveNews(cat, sub_cat, this.origin, id).subscribe(
        (data: any) => {
          if (data.message) {
            this.toastr.success("Catagory updated Successfully")
          }
        })
  
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
  
    // getTimes() {
    //   let minute_in_milliseconds = 60000
    //   let hour_in_milliseconds = 3.6e+6
  
    //   let d = new Date();
    //   this.now_t = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    //   this.now_d = d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: '2-digit' })
  
    //   // Islamabad Time (GMT+5:00)
    //   let d_ = new Date(d.getTime())
    //   let formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    //   this.localtime["Islamabad"] = formatted;
  
    //   // New Delhi Time (GMT+5:30)
    //   d_ = new Date(d.getTime() + (minute_in_milliseconds * 30))
    //   formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    //   this.localtime["New Delhi"] = formatted;
  
    //   // Srinager Time (GMT+5:30)
    //   d_ = new Date(d.getTime() + minute_in_milliseconds * 30)
    //   formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    //   this.localtime["Srinager"] = formatted;
  
    //   // Washington Time (GMT-4:00)
    //   d_ = new Date(d.getTime() - (hour_in_milliseconds * 9))
    //   formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    //   this.localtime["Washington"] = formatted;
  
  
    // }
  
    getColumns(n) {
      return Math.ceil(n / 2)
    }
  
    keyword = {
      news: "",
      tweet: "",
      podcast: "",
      editorial: "",
      report: "",
    }
    Dates = {
      news: "latest",
      tweet: "latest",
      podcast: "latest",
      editorial: "latest",
      report: "latest",
    }
    trending_flag = {
      news: false,
      tweet: false,
      podcast: false,
      editorial: false
    }
    loader_flag = {
      news: false,
      tweet: false,
      podcast: false,
      editorial: false,
      report: false
    }
    topKeywordsList = []
    getTopKeywords() {
      this.api.getTopKeywords(this.origin).subscribe(
        (data: any) => {
          var res: any = data?.trending_keywords
          if (res && res.length) {
            for (let i = 0; i < res.slice(0, 8).length; i++) {
              this.topKeywordsList.push(res[i][0])
            }
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    }
  
    getFlashNews() {
      this.api.getFlashNews(this.origin).subscribe(
        (data: any) => {
          var res: any = data?.data
          if (res && res.length) {
            res.forEach((element, i) => {
              let keywords_ = element?._source?.data?.keywords_hits
              let desc_ = element?._source?.data?.description
              let title_ = element?._source?.data?.title
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                description: this.api.highlightWords(desc_, keywords_),
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(element._source.published_date),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || ''
              }
              if (element?._source?.data?.thumbnail) {
                this.flashNewsList.push(newsFormate)
              }
            })
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    }
  
    // endpage = {
    //   mil: false,
    //   intl: false,
    //   iiojk: false,
    //   domestic: false,
    // }
    lazy_loader = {
      mil: false,
      intl: false,
      iiojk: false,
      domestic: false,
    }
    page_number = {
      mil: 1,
      intl: 1,
      iiojk: 1,
      domestic: 1,
    }
    // endpage_ = {
    //   mil: false,
    //   intl: false,
    //   iiojk: false,
    //   domestic: false,
    // }
    lazy_loader_ = {
      mil: false,
      intl: false,
      iiojk: false,
      domestic: false,
    }
    page_number_ = {
      mil: 1,
      intl: 1,
      iiojk: 1,
      domestic: 1,
    }
    // endpage_p = {
    //   mil: false,
    //   intl: false,
    //   iiojk: false,
    //   domestic: false,
    // }
    lazy_loader_p = {
      mil: false,
      intl: false,
      iiojk: false,
      domestic: false,
    }
    page_number_p = {
      mil: 1,
      intl: 1,
      iiojk: 1,
      domestic: 1,
    }
  
    getNews(context = "all") {
      let cats_ = this.sub_cats[context]?.join(",");
      if (context == "all") {
        this.api.NewsList_explore["mil"] = [];
        this.api.NewsList_explore["intl"] = [];
        this.api.NewsList_explore["iiojk"] = [];
        this.api.NewsList_explore["domestic"] = [];
        this.lazy_loader = {
          mil: false,
          intl: false,
          iiojk: false,
          domestic: false,
        }
        // this.endpage = {
        //   mil: false,
        //   intl: false,
        //   iiojk: false,
        //   domestic: false,
        // }
        this.page_number = {
          mil: 1,
          intl: 1,
          iiojk: 1,
          domestic: 1,
        }
        this.loader_flag.news = false
      } else {
      }
      // this.ngxService.start();
      this.api.filterNewsandTweets(this.origin, "news", this.Dates['news'], this.keyword['news'], this.trending_flag['news'], cats_, (context != 'all' ? this.page_number[context] : 1)).subscribe(
        (data: any) => {
          var res: any = data?.data
          this.loader_flag.news = true
          context != "all" && (this.lazy_loader[context] = false);
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
            // context != "all" && (this.endpage[context] = true);
            return;
          }
  
          let keys = Object.keys(res);
          let values = Object.values(res);
  
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach(element => {
              let keywords_ = element?._source?.data?.keywords_hits
              let desc_ = element?._source?.data?.description
              let title_ = element?._source?.data?.title
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
                description: this.api.highlightWords(desc_, keywords_),
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(element._source.published_date),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || '',
              }
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              this.api.NewsList_explore[resolved_key]?.push(newsFormate)
              // this.NewsList_report[resolved_key]?.push({ "data": newsFormate, "flag": true })
            })
            // element?._source?.data?.cat_hits == "army" ? this.api.NewsList_explore['mil'].push(newsFormate) : element?._source?.data?.cat_hits == "international" ? this.api.NewsList_explore['intl'].push(newsFormate) : element?._source?.data?.cat_hits == "kashmir" ? this.api.NewsList_explore['iiojk'].push(newsFormate) : this.api.NewsList_explore['domestic'].push(newsFormate)
  
          })
          // this.ngxService.stop();
        },
        (error) => {
          // this.ngxService.stop();
        }
      );
    }
  
    getReportNews() {
  
      this.NewsList_report["mil"] = [];
      this.NewsList_report["intl"] = [];
      this.NewsList_report["iiojk"] = [];
      this.NewsList_report["domestic"] = [];
  
      this.loader_flag.report = true
  
      // this.ngxService.start();
      this.api.filterNewsandTweets(this.origin, "news", this.Dates['report'], this.keyword['report'], false, "army,international,kashmir,domestic", 1).subscribe(
        (data: any) => {
          var res: any = data?.data
          this.loader_flag.report = false
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
  
            return;
          }
  
          let keys = Object.keys(res);
          let values = Object.values(res);
  
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach(element => {
              let keywords_ = element?._source?.data?.keywords_hits
              let desc_ = element?._source?.data?.description
              let title_ = element?._source?.data?.title
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
                description: this.api.highlightWords(desc_, keywords_),
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(element._source.published_date),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || '',
              }
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              this.NewsList_report[resolved_key]?.push({ "data": newsFormate, "flag": true })
            })
  
          })
          // this.ngxService.stop();
        },
        (error) => {
          // this.ngxService.stop();
        }
      );
    }
  
    getReportTweets() {
  
      this.tweetList_report["mil"] = [];
      this.tweetList_report["intl"] = [];
      this.tweetList_report["iiojk"] = [];
      this.tweetList_report["domestic"] = [];
      this.loader_flag.report = true
  
      this.api.filterNewsandTweets(this.origin, "tweet", this.Dates['report'], this.keyword['report'], this.trending_flag['report'], "army,international,kashmir,domestic", 1).subscribe(
        (data: any) => {
          this.loader_flag.report = false;
          var res: any = data?.data
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
            return;
          }
  
          let keys = Object.keys(res);
          let values = Object.values(res);
  
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach(element => {
              let desc_ = element.text
              let keywords_ = element.exist_keywords
  
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
                tweet_image: element.tweet_image
              }
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              this.tweetList_report[resolved_key]?.push({ "data": newsFormate, "flag": false })
            });
          })
  
          // this.is_lazy_loader_tweets[origin] = false
        },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        }
      );
    }
  
    getTweets(context = "all") {
      let cats_ = this.sub_cats[context]?.join(",");
      if (context == "all") {
        this.api.tweetList_explore["mil"] = [];
        this.api.tweetList_explore["intl"] = [];
        this.api.tweetList_explore["iiojk"] = [];
        this.api.tweetList_explore["domestic"] = [];
        this.lazy_loader_ = {
          mil: false,
          intl: false,
          iiojk: false,
          domestic: false,
        }
        // this.endpage_ = {
        //   mil: false,
        //   intl: false,
        //   iiojk: false,
        //   domestic: false,
        // }
        this.page_number_ = {
          mil: 1,
          intl: 1,
          iiojk: 1,
          domestic: 1,
        }
        this.loader_flag.tweet = false
      } else {
      }
      this.api.filterNewsandTweets(this.origin, "tweet", this.Dates['tweet'], this.keyword['tweet'], this.trending_flag['tweet'], cats_, (context != 'all' ? this.page_number_[context] : 1)).subscribe(
        (data: any) => {
          this.loader_flag.tweet = true;
          var res: any = data?.data
          context != "all" && (this.lazy_loader_[context] = false);
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
            // context != "all" && (this.endpage_[context] = true);
            return;
          }
  
          let keys = Object.keys(res);
          let values = Object.values(res);
  
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach(element => {
              let desc_ = element.text
              let keywords_ = element.exist_keywords
  
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
                tweet_image:element.tweet_image
              }
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              if (!this.api.tweetList_explore[resolved_key]) {
                  this.api.tweetList_explore[resolved_key] = [];
              }
              if (!this.api.tweetList_explore[resolved_key].find((t: any) => t.id_str === newsFormate.id_str)) {
                  this.api.tweetList_explore[resolved_key].push(newsFormate);
              }
              // this.tweetList_report[resolved_key]?.push({ "data": newsFormate, "flag": false })
            });
          })
  
          // this.is_lazy_loader_tweets[origin] = false
        },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        }
      );
    }
  
    getVisionPulse() {
      // Clear existing interval if any
      if (this.visionPulseState.interval) {
        clearInterval(this.visionPulseState.interval);
      }
      
      // Reset the vision pulse list
      this.visionPulseList = {
        mil: [],
        intl: [],
        iiojk: [],
        domestic: []
      };
      
      // Fetch initially
      this.fetchVisionPulseData();
      
      // Set up interval to fetch every 3 seconds
      this.visionPulseState.interval = setInterval(() => {
        this.fetchVisionPulseData();
      }, 3000);
    }
  
    fetchVisionPulseData() {
      let url = 'http://192.168.100.110:8090/get_vision_pulse';
      
      fetch(url, {
        method: 'GET',
        headers: {
          'Cookie': 'session=IV1h8QRgQxZ-meNa8B--tXu7hbMjrObB8eVntk2usBY'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && data.data) {
          let res: any = data.data;
          
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
            return;
          }
          
          let keys = Object.keys(res);
          let values = Object.values(res);
          
          keys.forEach((key, i) => {
            let items: any = values[i];
            items.forEach(element => {
              let keywords_ = element?._source?.data?.keywords_hits;
              let desc_ = element?._source?.data?.description;
              let title_ = element?._source?.data?.title;
              let visionFormat = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
                description: this.api.highlightWords(desc_, keywords_),
                news_link: element._source.data.news_link,
                country: element._source.data.country,
                published_date: this.api.formatDate(element._source.published_date),
                keywords: keywords_,
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || '',
              };
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              
              if (!this.visionPulseList[resolved_key]) {
                this.visionPulseList[resolved_key] = [];
              }
              
              // Avoid duplicates
              if (!this.visionPulseList[resolved_key].find((t: any) => t.id === visionFormat.id)) {
                this.visionPulseList[resolved_key].push(visionFormat);
              }
            });
          });
        }
      })
      .catch(err => {
        console.error('Error fetching vision pulse data', err);
      });
    }
  
    // checkScrolled(event, context, type) {
    //   if (type == 'news') {
    //     if (this.endpage[context] || this.lazy_loader[context] || !this.api.NewsList_explore[context].length) return;
    //   } else if(type=='tweet') {
    //     if (this.endpage_[context] || this.lazy_loader_[context] || !this.api.tweetList_explore[context].length) return;
    //   }
    //   else{
    //     if (this.endpage_p[context] || this.lazy_loader_p[context] || !this.api.podcastList_explore[context].length) return;
    //   }
    //   let { target } = event;
    //   let scroll_offset = 20;
    //   var isFullyScrolled = target.scrollTop + target.clientHeight >= target.scrollHeight - scroll_offset;
    //   if (isFullyScrolled) {
    //     this.loadMore(context, type)
    //   }
    // }
  
    loadMore(context, type) {
      if (type == 'news') {
        this.lazy_loader[context] = true;
        this.page_number[context] += 1;
        this.getNews(context)
      } else if (type == 'tweet')  {
        this.lazy_loader_[context] = true;
        if (this.customTweetsState[context]) {
            if (this.customTweetsState[context].bottomCursor) {
                this.fetchCustomTweets(context, this.customTweetsState[context].bottomCursor, 'bottom');
            } else {
                this.fetchCustomTweets(context, '', 'bottom');
            }
        } else {
            this.page_number_[context] += 1;
            this.getTweets(context)
        }
      }
      else  {
        this.lazy_loader_p[context] = true;
        this.page_number_p[context] += 1;
        this.getProdCasts(context)
      }
    }
  
    prodList = []
    getProdCasts(context = "all") {
      let cats_ = this.sub_cats[context]?.join(",");
      if (context == "all") {
        this.api.podcastList_explore["mil"] = [];
        this.api.podcastList_explore["intl"] = [];
        this.api.podcastList_explore["iiojk"] = [];
        this.api.podcastList_explore["domestic"] = [];
        this.lazy_loader_p = {
          mil: false,
          intl: false,
          iiojk: false,
          domestic: false,
        }
        // this.endpage_p = {
        //   mil: false,
        //   intl: false,
        //   iiojk: false,
        //   domestic: false,
        // }
        this.page_number_p = {
          mil: 1,
          intl: 1,
          iiojk: 1,
          domestic: 1,
        }
        this.loader_flag.tweet = false
      } else {
      }
      this.api.getProdCasts(
        this.Dates['podcast'],
        this.origin,
        this.keyword['podcast'],
        (context != 'all' ? this.page_number_p[context] : 1),
        cats_
      ).subscribe(
        (data: any) => {
          var res: any = data?.data
          this.loader_flag.podcast = true
          context != "all" && (this.lazy_loader_p[context] = false);
          if (!res || !Object.entries(res).length || !Object.values(res)?.find((x: any) => x.length)) {
            // context != "all" && (this.endpage_p[context] = true);
            return;
          }
  
            let keys = Object.keys(res);
            let values = Object.values(res);
    
            keys.forEach((key, i) => {
              var yt_: any = values[i];
  
              yt_.forEach(element => {
              let newsFormate = {
                id: element._id,
                link: element._source.link,
                title: element._source.title,
                published_date: this.api.formatDate(element._source.published_date),
                channel_handle: element._source.channel_handle,
                video_id: element._source.video_id,
                cat_hits: element._source?.data?.cat_hits
              }
              let resolved_key = key == 'army' ? 'mil' : key == 'international' ? 'intl' : key == 'kashmir' ? 'iiojk' : 'domestic';
              this.api.podcastList_explore[resolved_key]?.push(newsFormate)
              // this.prodList.push(newsFormate)
            });
            Object.keys(this.api.podcastList_explore).forEach(resolved_key => {
              this.api.podcastList_explore[resolved_key] = this.api.podcastList_explore[resolved_key].filter((item, index, self) =>
                index === self.findIndex((t) => t.video_id === item.video_id)
              );
            });

        });
      console.log('this.api.podcastList_explore ',this.api.podcastList_explore)
      },
        (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        })
    }
    trendingHashtagList = []
    trendingwordsList = []
    getTrendingHashtag() {
      this.api.getTrendingHashtag(this.origin).subscribe(
        (data: any) => {
  
          if (!data?.hashtag?.length && !data?.keywords?.length) {
            return;
          }
          this.trendingHashtagList = data.hashtag
          this.trendingwordsList = data.keywords
  
        },
        error => {
          console.log("getTimes() error:", error)
        }
      )
  
    }
    flashNewsList = []
  
  
    editorialList = []
    getEditorials() {
      this.editorialList = [];
  
      this.loader_flag.editorial = false
      this.api.getEditorials(this.origin, this.Dates['editorial'], this.keyword['editorial'], this.trending_flag['editorial']).subscribe(
        (data: any) => {
          var res: any = data?.data
          this.loader_flag.editorial = true
          if (res && res.length) {
            res.forEach((element, i) => {
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title:  this.api.highlightWords(element?._source?.data?.title, element?._source?.data?.keywords_hits), //element?._source?.data?.title,
                description: element?._source?.data?.description,
                link: element._source.data.link,
                country: element._source.data.country,
                published_date: this.api.formatDate(element._source.published_date),
                cat_hits: element?._source?.data?.cat_hits,
                image: element?._source?.data?.thumbnail || ''
              }
              this.editorialList.push(newsFormate)
            })
            setTimeout(() => {
              this.scrollEdges(($("#editorial_scroller") as any)[0]);
            },1000);
            
            console.log("editorial", this.editorialList)
          }
        },
        (error) => {
        }
      );
    }
  
    readMore(linkurl, id, context="") {
      if(!id && !context){
        return
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
        this.router.serializeUrl(
          this.router.createUrlTree(["/east_corner", cat])
        )
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
      el?.scrollBy({ left: by, behavior: 'smooth' })
    }
  
    scrollEdges(el) {
      el.parentElement.classList.remove("hide_right")
      el.parentElement.classList.remove("hide_left")
      if (el.scrollLeft <= 0) {
        el.parentElement.classList.add("hide_left")
      }
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 0.5) {
        el.parentElement.classList.add("hide_right")
      }
    }
  
    filter_report_date(context) {
      if (!this.multiselect_date[context]) {
        return;
      }
      var now = this.multiselect_date[context]
  
      this.Dates[context] = now.getFullYear() + ',' + (now.getMonth() + 1) + ',' + now.getDate();
  
      if (context == "news") {
        this.getNews()
      }
      if (context == "tweet") {
        this.getTweets()
      }
      if (context == "editorial") {
        this.getEditorials()
      }
      if (context == "podcast") {
        this.getProdCasts()
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
    newsDetails(id: string, cat_hits: string) {
 
  window.open(`${window.location.origin}/#/news-details/${this.origin}/${id}?cat_hits=${cat_hits}`, '_blank');

}
  // In the original component
// newsDetails(id: string, cat_hits: string) {
//   console.log('newsdetailsclicked');
//   const urlTree = this.router.createUrlTree(['/#/news-details', this.origin, id], {
//     queryParams: { cat_hits }
//   });
//   const url = this.router.serializeUrl(urlTree);
//   window.open(url, '_blank');
// }

    changeFilter(event) {
      let context = event.context
      let value = event.value;
  
      this.Dates[context] = value;
      this.multiselect_date = []
      if (context == "report") {
        this.getReportNews()
        this.getReportTweets()
      }
      if (context == "news") {
        this.getNews()
      }
      if (context == "tweet") {
        this.getTweets()
      }
      if (context == "editorial") {
        this.getEditorials()
      }
      if (context == "podcast") {
        this.getProdCasts()
      }
    }
  
    gotoLink(link,direct:any="") {
      if(!direct) {
        link = link.includes('http') ? link : ('https://' + link);
      } else {
        (typeof direct == 'object') && direct.stopPropagation()
      }
      window.open(link);
    }
  
    gotoHome() {
      this.router.navigate([''])
    }
  
    includesText(list, text) {
      return JSON.stringify(list).includes(`"cat_hits":"${text}"`)
    }
  
    all_channels = []
    selected_priorities = []
    priority_flag = false
  
    fetchPriorities(origin) {
      this.api.getProrities(origin).subscribe(
        (data: any) => {
          if (!data || !Object.entries(data).length) return;
          if (data.priority) {
            this.selected_priorities = data.priority;
          }
        },
        error => {
          console.log(error, "priorities-error")
        }
      )
    }
  
    
  
    getChannels(origin) {
      this.api.getChannels(origin).subscribe(
        (data: any) => {
          if (!data || !Object.entries(data).length) return;
          if (data.priority) {
            this.all_channels = data.priority;
          }
        },
        error => {
          console.log(error, "channels-error")
        }
      )
    }
  
    addPriority(value) {
      if (this.selected_priorities.includes(value)) {
        this.toastr.warning("already exists in priority list!")
        return;
      }
      if (this.selected_priorities.length > 4) {
        this.toastr.warning("Priority Stack is full!")
        return;
      }
      this.selected_priorities.push(value)
      this.priority_flag = true;
    }
  
    removePriority(value) {
      this.selected_priorities = this.selected_priorities.filter(x => x != value)
      this.priority_flag = true;
    }
  
    drop(event) {
      moveItemInArray(this.selected_priorities, event.previousIndex, event.currentIndex);
      this.priority_flag = true;
    }
  
    applyFilter(event) {
      let form_body = new URLSearchParams();
      form_body.append("priority_list", this.selected_priorities?.map(x => x.channel)?.join(','))
      form_body.append("priority_name", this.selected_priorities?.map(x => x.name)?.join(','))
      form_body.append("user_id", this.api.uid + '')
      form_body.append("category", this.origin)
  
      fetch(this.api.ip + "update_priority", {
        method: 'POST',
        body: form_body
      })
        .then(y => y.json())
        .then((data: any) => {
          console.log("data: ", data)
          if (data?.message?.includes('success')) {
            this.toastr.success("Priority list updated successfully!")
            this.fetchPriorities(this.origin)
          } else {
            this.toastr.error("something went wrong! try again!")
          }
        })
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
      if(!keyword){
        return
      }
      const url = this.location.prepareExternalUrl(
        this.router.serializeUrl(
          this.router.createUrlTree([linkurl, this.origin, keyword])
        )
      );
      window.open(url);
  
    }
    _link = "";
    rep_flag = ""
    anychange=false
    printReport() {
      if(!this.anychange && this.rep_flag){
        window.open(this._link)
        return
      }
      var NewsReportData: any = {}
      var TweetReportData: any = {}
      var originx = this.origin.toUpperCase().replace("_", " ")
      for (const key of Object.keys(this.NewsList_report)) {
        var data = this.NewsList_report[key].filter(x => {
          return x.flag
        })
        NewsReportData[key] = data
      }
      for (const key of Object.keys(this.tweetList_report)) {
        var data = this.tweetList_report[key].filter(x => {
          return x.flag
        })
        TweetReportData[key] = data
      }
      this.rep_flag="pending"
      console.log({ "corner": originx, "news": NewsReportData, "tweets": TweetReportData });
      let ws_ = new WebSocket(global_pointer.news_addr_ws);
      var key_json = {}
  
  
      key_json = {
        "corner": originx,
        "news": NewsReportData,
        "tweets": TweetReportData
      }
      ws_.onopen = function () {
        ws_.send(JSON.stringify(key_json));
      };
      ws_.onmessage = (evt => {
        let b_ = JSON.parse(evt?.data);
        if (b_?.path) {
          this._link = (this.api.ip + b_.path).replace("/api", "");
          this.rep_flag="done"
          this.anychange=false
          window.open(this._link)
        }
      })
  
    }
    customReport(){
      this.anychange=true;
      this.rep_flag=""
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

  

  }