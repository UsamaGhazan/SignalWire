import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { DataService } from 'src/service/data.service';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css']
})
export class TweetDetailsComponent implements OnInit {

  EastTweetsList :any= {}
  keywords_list = []
  relatedTweetsList = []
  id = ""
  origin = ""
  keyword = ""
  is_loading = {
    news: true,
    related: true,
  }
  now_t:any = "--:-- --"
  now_d:any = "---, -- ----"

  constructor(private sanitizer: DomSanitizer,
    public api: NewsService,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private location: Location,
    public data:DataService
  ) { }

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.tweetById()
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000)
  }

  tweetById() {
    // this.EastTweetsList = [];
    this.ngxService.start();
    this.is_loading.news = true
    this.is_loading.related = true
    this.api.tweetById(this.origin, this.id).subscribe(
      (data: any) => {
        var res: any = data
        if (res && Object.entries(res).length) {
          let desc_ = res?.text
          let keywords_ = res.exist_keywords

          let newsFormate = {
            id: res.id_str,
            name: res.user.name,
            screen_name: res.user.screen_name,
            profile_image_url: res.user.profile_image_url,
            description: this.api.highlightWords(desc_, keywords_),
            created_at: this.api.formatDate(res.created_at),
            keywords: keywords_,
            tweet_image:res.tweet_image
          }
          this.EastTweetsList=newsFormate
          if (res.exist_keywords.length) {
            this.relatedTweets(res.exist_keywords)
          } else {
            this.is_loading.related = false
          }

        } else {
          this.is_loading.related = false
        }

        this.is_loading.news = false

        this.ngxService.stop();
      },
      (error) => {
        this.is_loading.news = false
        this.is_loading.related = false
        this.ngxService.stop();
      }
    );
  }

  relatedTweets(keywords) {
    var str = ""
    keywords.forEach(element => {
      str += element + ","
    });
    str = str.replace(/(\s*,?\s*)*$/, "");
    // this.ngxService.start();
    this.relatedTweetsList = []
    this.api.seacrhKeyword(this.origin, str, 'tweet').subscribe(
      (data: any) => {
        var res: any = data?.data
        if (res) {
          res.forEach(element => {
            let desc_ = element?.text
            let keywords_ = element.exist_keywords

            let newsFormate = {
              id: element.id_str,
              name: element.user.name,
              screen_name: element.user.screen_name,
              profile_image_url: element.user.profile_image_url,
              description: this.api.highlightWords(desc_, keywords_),
              created_at: this.api.formatDate(element.created_at),
              keywords: keywords_
            }
            this.relatedTweetsList.push(newsFormate)
          });

        }
        this.is_loading.related = false
        // this.ngxService.stop();
      },
      (error) => {
        this.is_loading.related = false
        // this.ngxService.stop();
      }
    );
  }

  getTimes() {
    let d = new Date();
    this.now_t = d.toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
    this.now_d = d.toLocaleDateString('pk',{ year: 'numeric', month: 'short', day: '2-digit' })
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
      this.router.serializeUrl(
        this.router.createUrlTree(["/east_corner", cat])
      )
    );
    window.open(url);
  }
}
