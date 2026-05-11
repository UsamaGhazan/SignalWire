import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/service/data.service';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { CdkDragDrop, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { global_pointer } from 'src/assets/js/global_config';

@Component({
  selector: 'app-news-history',
  templateUrl: './news-history.component.html',
  styleUrls: ['./news-history.component.css']
})
export class NewsHistoryComponent implements OnInit {
  Array = Array
  origin=""
  news_id=""
  constructor(
    public api: NewsService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private http: HttpClient,
    public globalService: DataService,
    private location: Location,
    private _Activatedroute: ActivatedRoute,
  ) { }

  NewsList:any = []
  TweetList:any = []
  loader_flag:any = {
    news: false,
    tweet: false
  }
  now_t:any = "--:-- --"
  now_d:any = "---, -- ----"

  ngOnInit(): void {
    this.news_id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.getNews()
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000)
  }
  getNews() {
    this.NewsList = [];
    this.loader_flag.news=false
    // this.ngxService.start();
    this.api.fetch_historical_data(this.origin, this.news_id).subscribe(
      (data: any) => {
        var res: any = data?.historical_news
        this.loader_flag.news=true
        if (res && res.length) {
          res.forEach((element, i) => {
            // let keywords_ = element?._source?.data?.keywords_hits
            // let desc_ = element?._source?.data?.description
            // let title_ = element?._source?.data?.title
            let newsFormate = {
              source: element.articlesection,
              title: element.headline,
              description: element.description,
              news_link: element.url,
              country: element.articlesection,
              published_date: this.api.formatDate(element.datepublished),
              keywords: element.keywords?.split(','),
            }
            this.NewsList.push(newsFormate)
          })
        }
        // this.ngxService.stop();
      },
      (error) => {
        // this.ngxService.stop();
      }
    );
  }

  getTimes() {
    let d = new Date();
    this.now_t = d.toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
    this.now_d = d.toLocaleDateString('pk',{ year: 'numeric', month: 'short', day: '2-digit' })
  }

  newsDetails(id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/news-details", this.origin,id])
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

