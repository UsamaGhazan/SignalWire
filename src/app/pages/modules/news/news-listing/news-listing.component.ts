import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/service/data.service';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { CdkDragDrop, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { global_pointer } from 'src/assets/js/global_config';

@Component({
  selector: 'app-news-listing',
  templateUrl: './news-listing.component.html',
  styleUrls: ['./news-listing.component.css']
})
export class NewsListingComponent implements OnInit {
  constructor(
    public api: NewsService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private http: HttpClient,
    public globalService: DataService,
    private location: Location
  ) { }
  system=""
  now_t:any = "--:-- --"
  now_d:any = "---, -- ----"
  ngOnInit(): void {
    this.system=global_pointer.system
    let body_ = document.body;
    body_.classList.add("nofooter");
    
    this.getTimes();
    this.getFlashNews()
    setInterval(() => {
      this.getTimes();
    }, 1000)
    // this.saveUser()
  }
  flashNewsList=[]
  getFlashNews() {
    this.api.getFlashNews('all').subscribe(
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
            if(element?._source?.data?.thumbnail){
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

  explore(origin,country="") {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        !country?
        this.router.createUrlTree(["/explore", origin])
        :
        this.router.createUrlTree(["/explore", origin, country])
      )
    );
    window.open(url);
  }

  getTimes() {
    let d = new Date();
    this.now_t = this.api.formatDate(d.toString(),true)?.time;
    this.now_d = this.api.formatDate(d.toString(),true)?.date;
  }

  saveUser() {
    var json={
      createdAt: "2023-11-14T05:25:19.047Z",
      id: "676",
      job: "fd",
      name: "dd"
    }
    this.api.saveUser(json).subscribe((response: any) => {
      console.log(response);

      console.log({ name: response.name, job: response.job });
    });
  }
  logout(){
    window.location.href = global_pointer.newsIp+"logout";
  }

  removeItem(flash) {
    this.flashNewsList = this.flashNewsList.filter(x=>flash!==x)
  }
}
