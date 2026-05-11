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
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {
  tag=""
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
    tweet: false,
    podcast:false,
    editorial:false
  }
  now_t:any = "--:-- --"
  now_d:any = "---, -- ----"
  page_number = {
    news: 1,
    tweet: 1,
    podcast: 1,
    editorial: 1,
  }
  scroll_flag = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
  }
  endpage = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
  }
  for_all=""
  ngOnInit(): void {
    this.tag = this._Activatedroute.snapshot.paramMap.get("tag");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    if(this.origin=="east_corner"){
      this.for_all="army,international,kashmir,domestic";
    }
    else if(this.origin=="internal_security"){
      this.for_all="govt,polparties,is,military,diplomat";
    }
    this.getNews()
    this.getTweets()
    this.getTimes();
    this.getProdCasts()
    this.getEditorials()
    this.wikipediaSearch()
    setInterval(() => {
      this.getTimes();
    }, 1000)
  }
  historyList=[]
  wikipediaSearch() {
    this.historyList=[]
    // this.ngxService.start();
    let tag_:any = this.tag.toLowerCase();
    if(this.origin=="east_corner"){
      tag_ = tag_.includes('india') || 
        tag_.includes('bharat') || 
        tag_.includes('baharat') ||
        tag_.includes('hindustan') ?this.tag:(this.tag+" india");
    }
    else if(this.origin=="internal_security"){
      tag_ = tag_.includes('pak') || 
        tag_.includes('pakistan')?this.tag:(this.tag+" pakistan");
    } else {
      tag_ = tag_.includes('afg') || 
        tag_.includes('afghanistan') || 
        tag_.includes('iran')?this.tag:(this.tag+" afghanistan");
    }
    this.api.wikipediaSearch(tag_).subscribe(
      (data: any) => {
        var res: any = data?.wiki_content
        if(res?.length){
          var datax=[];
          var keywords_ = [this.tag,...this.tag.split(' ')];
          res.forEach((item) => {
            Object.keys(item).forEach((key)=> {
              key = this.api.highlightWords(key, keywords_);
              let val_ = this.api.highlightWords(item[key], keywords_);
              datax.push({"key":key,"val":val_})
            });
          });
          this.historyList=datax
        }
        // this.ngxService.stop();
      },
      (error) => {
        // this.ngxService.stop();
      }
    );
  }
  getNews(lazy_flag=false) {
    
    !lazy_flag && (this.loader_flag.news=false)
    !lazy_flag && (this.NewsList = [])
    !lazy_flag && (this.page_number.news=1)
    !lazy_flag && (this.endpage.news=false)
    this.scroll_flag.news=false
    // this.ngxService.start();
    this.api.new_by_tag(this.origin, this.tag, false, this.page_number.news).subscribe(
      (data: any) => {
        var res: any = data?.data
        this.loader_flag.news=true
        this.scroll_flag.news=true
        if (res && res.length) {
          res.forEach((element, i) => {
            let keywords_ = [this.tag,...this.tag.split(' ')];
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
            this.NewsList.push(newsFormate)
          })
        } else {
          this.endpage.news = true;
        }
        // this.ngxService.stop();
      },
      (error) => {
        // this.ngxService.stop();
      }
    );
  }

  getTweets(lazy_flag=false){
    !lazy_flag && (this.loader_flag.tweet=false)
    !lazy_flag && (this.TweetList = [])
    !lazy_flag && (this.page_number.tweet=1)
    !lazy_flag && (this.endpage.tweet=false)
    this.scroll_flag.tweet=false

    this.api.filterNewsandTweets(this.origin, "tweet", 'latest', this.tag, false,this.for_all,this.page_number.tweet).subscribe(
      (data: any) => {
        
        this.scroll_flag.tweet=true
        this.loader_flag.tweet=true;
        var res: any = data?.data
        if(this.origin=="east_corner"){
          res=[].concat(res.army,res.domestic,res.international,res.kashmir)
        }
        else if(this.origin=="internal_security"){
          res=[].concat(res.diplomat,res.govt,res.is,res.military,res.polparties)
        }
        
        if (res && res.length) {
          res.forEach(element => {
            let desc_ = element.text
            let keywords_ = [this.tag,...this.tag.split(' ')];

            let newsFormate = {
              id: element._id,
              name: element.user.name,
              screen_name: element.user.screen_name,
              profile_image_url: element.user.profile_image_url,
              description: this.api.highlightWords(desc_, keywords_),
              created_at: this.api.formatDate(element.created_at),
              keywords: element.exist_keywords,
              id_str: element.id_str,
              cat_hits: element.cat_hits
            }
            this.TweetList.push(newsFormate)

          });

        } else {
          this.endpage.tweet = true;
        }
        // this.is_loading_tweets[origin] = false
      },
      (error) => {
        // this.is_loading_tweets[origin] = false
      }
    );
  }


  prodList = []
  getProdCasts(lazy_flag=false) {
    !lazy_flag && (this.loader_flag.podcast=false)
    !lazy_flag && (this.prodList = [])
    !lazy_flag && (this.page_number.podcast=1)
    !lazy_flag && (this.endpage.podcast=false)
    this.scroll_flag.podcast=false

    this.api.getProdCasts("latest", this.origin, this.tag, this.page_number.podcast,this.for_all).subscribe(
      (data: any) => {
        var res: any = data?.data;
        let keywords_ = [this.tag,...this.tag.split(' ')];
        res=[].concat(res.army,res.domestic,res.international,res.kashmir)
        this.scroll_flag.podcast=true
        this.loader_flag.podcast = true
        if (res && res.length) {
          res.forEach(element => {
            let newsFormate = {
              id: element._id,
              link: element._source.link,
              title: this.api.highlightWords(element._source.title,keywords_),
              published_date: this.api.formatDate(element._source.published_date),
              channel_handle: element._source.channel_handle,
              video_id: element._source.video_id,
              cat_hits: element._source?.data?.cat_hits
            }
            this.prodList.push(newsFormate)
          });
        } else {
          this.endpage.podcast = true;
        }
        // this.is_lazy_loader_tweets[origin] = false
      },
      (error) => {
        // this.is_lazy_loader_tweets[origin] = false
      }
    );
  }

  editorialList = []
  getEditorials(lazy_flag=false) {
    !lazy_flag && (this.loader_flag.editorial=false)
    !lazy_flag && (this.editorialList = [])
    !lazy_flag && (this.page_number.editorial=1)
    !lazy_flag && (this.endpage.editorial=false)
    this.scroll_flag.editorial=false

    this.api.getEditorials(this.origin, "latest", this.tag, false, this.page_number.editorial).subscribe(
      (data: any) => {
        var res: any = data?.data
        this.scroll_flag.editorial=true
        this.loader_flag.editorial = true
        if (res && res.length) {
          res.forEach((element, i) => {
            let newsFormate = {
              id: element._id,
              source: element._source.source_news,
              title: element?._source?.data?.title,
              description: element?._source?.data?.description,
              link: element._source.data.link,
              country: element._source.data.country,
              published_date: this.api.formatDate(element._source.published_date),
              cat_hits: element?._source?.data?.cat_hits,
              image: element?._source?.data?.thumbnail || ''
            }
            this.editorialList.push(newsFormate)
          })
          console.log("editorial", this.editorialList)
        } else {
          this.endpage.editorial = true;
        }
      },
      (error) => {
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

  gotoLink(url,event:any="") {
    event && event.stopPropagation();
    url = url.includes('http') ? url : ('https://' + url)
    window.open(url)
  }

  checkScrolled(event, context) {
    if (this.endpage[context] || !this.scroll_flag[context] ||
      !(context=='news'?this.NewsList?.length:context=='tweet'?
        this.TweetList?.length:context=='podcast'?this.prodList?.length:this.editorialList?.length)) return;
    let { target } = event;
    let scroll_offset = 20;
    var isFullyScrolled = target.scrollTop + target.clientHeight >= target.scrollHeight - scroll_offset;
    if (isFullyScrolled) {
      this.loadMore(context)
    }
  }

  loadMore(context) {
    this.scroll_flag[context] = false;
    this.page_number[context] += 1;

    if(context=='news') {
      this.getNews(true)
    }
    if(context=='tweet') {
      this.getTweets(true)
    }
    if(context=='podcast') {
      this.getProdCasts(true)
    }
    if(context=='editorial') {
      this.getEditorials(true)
    }
  }

}
