import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { DataService } from 'src/service/data.service';

@Component({
  selector: 'app-editorial-details',
  templateUrl: './editorial-details.component.html',
  styleUrls: ['./editorial-details.component.css']
})
export class EditorialDetailsComponent implements OnInit {

  editorialList:any={}
  keywords_list = []
  relatedNewsList=[]
  similarNewsList=[]
  showHistory=false;
  is_loading = {
    news: true,
    related: true,
  }
  id:any=""
  origin=""
  now_t:any = "--:-- --"
  now_d:any = "---, -- ----"

  constructor(private sanitizer: DomSanitizer,
    public api:NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data:DataService
    
    ) { }


  auth_search_keyword = ""

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.newsById()

  }

  newsById(){
    this.editorialList=[];
    this.relatedNewsList=[]
    // this.ngxService.start();
    this.is_loading.news = true;
    this.api.editorialById(this.origin,this.id).subscribe(
      (data: any) => {
        var res:any=data?.data;
        if(data?.related){
          this.relatedNews(data.related)
        }
        if(res && Object.entries(res).length){
             let newsFormate = {
              id: res._id,
              source: res.source_news,
              title:this.api.highlightWords(res.data?.title, res.data?.keywords_hits),
              description:this.api.highlightWords(res.data?.description, res.data?.keywords_hits),
              link: res.data.link,
              country: res.data.country,
              published_date: this.api.formatDate(res?.data?.published_date),
              cat_hits: res.data?.cat_hits,
              image: res.data?.thumbnail || '',
              published_by: res.data?.published_by || '',
              keywords: res.data?.keywords_hits,
            }
            this.editorialList=newsFormate
       
        } else {
          this.is_loading.news = false
        }
        // this.ngxService.stop();
        this.is_loading.news = false;
        this.is_loading.related = false
      },
      (error) => {
        this.is_loading.related = false
        this.is_loading.news = false;
        // this.ngxService.stop();
      }
    );
  }
  relatedNews(data){
    if(data && data.length){
      data.forEach(element => {
        let hitkeywords = element._source.data.keywords_hits

        let newsFormate={
          id: element._id,
          source: element._source.source_news,
          title:this.api.highlightWords(element._source?.data?.title, element._source?.data?.keywords_hits),
          description: element._source.data.description,
          news_link: element._source.data.link,
          published_date: this.api.formatDate(element._source.data.published_date),
          country: element._source.data.country,
          keywords: hitkeywords,
          image:element._source.data.thumbnail || ""
        }
        this.relatedNewsList.push(newsFormate)
      });
    }
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
 
  hitDateFormate(date,country){
    if(this.origin=="internal_security"){
      country=""
    }
   return this.api.dateFormate(date,country)
    
  }
  gotoLink(link,event:any="") {
    event && event.stopPropagation();
    window.open(link,'_blank')
  }
  newsDetails(id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/editorial-details", this.origin,id])
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

  inter:any=""
  pwith=5
  summaryFlag=false
   getSummary(id, progress) {
     progress.classList.add("active");
     let container = document.querySelector('.progress-container');
     container.classList.remove("d-none");
     this.inter=setInterval(() => {
       if(this.pwith<90){
         this.pwith+=10;
       }
       this.getSummarydata(progress)
     }, 6000);
    
   }
   summary=""
   getSummarydata(progress){
     this.api.getSummary(this.id,this.origin+"_editorial_editorial").subscribe(
       (data: any) => {
        if(data?.summary?.includes("in_process")){
         
        }
        else{
         let container = document.querySelector('.progress-container');
         progress.classList.remove("active");
         container.classList.add("d-none");
         clearInterval(this.inter);
         this.summary=data?.summary
        }
 
       })
   }

}
