import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NewsService } from 'src/service/news.service';
import { Location } from '@angular/common';
import { DataService } from 'src/service/data.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { global_pointer } from 'src/assets/js/global_config';

@Component({
  selector: 'app-gen-search',
  templateUrl: './gen-search.component.html',
  styleUrls: ['./gen-search.component.css']
})
export class GenSearchComponent implements OnInit {
  origin=""
  text="";
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
  ) { 
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    // this.text = this._Activatedroute.snapshot.paramMap.get("text");
  }
  NewsList:any= []
  //[]
  initial_state:any = true;
  loader_flag=false
  now_t: any = "--:-- --"
  now_d: any = "---, -- ----"
  localtime: any = {
    "Islamabad": "---, -- --- ---- --:--:-- --",
    "New Delhi": "---, -- --- ---- --:--:-- --",
    "Srinager": "---, -- --- ---- --:--:-- --",
    "Washington": "---, -- --- ---- --:--:-- --"
  }
  ngOnInit(): void {
    window.document.body.classList.add('gen-search-zero-state')
    setInterval(() => {
      this.getTimes();
    }, 1000)
    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop();
    }, 2000);
  }

  newsGeneralSearch(){
    this.loader_flag=true
    this.initial_state = false;
    window.document.body.classList.remove('gen-search-zero-state')
    this.NewsList = []
    this.api.newsGeneralSearch(this.text,this.origin).subscribe(
      (data: any) => {
        this.ngxService.stop();
        this.loader_flag=false
        if(!data) return;
        this.NewsList = data.general_news;
      },
      error=>{
        this.ngxService.stop();
        console.log("error newsGeneralSearch()",error)
      })
  }

  explore(cat) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/east_corner", cat])
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
  getTimes() {
    let minute_in_milliseconds = 60000
    let hour_in_milliseconds = 3.6e+6

    let d = new Date();
    this.now_t = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    this.now_d = d.toLocaleDateString('pk', { year: 'numeric', month: 'short', day: '2-digit' })

    // Islamabad Time (GMT+5:00)
    let d_ = new Date(d.getTime())
    let formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    this.localtime["Islamabad"] = formatted;

    // New Delhi Time (GMT+5:30)
    d_ = new Date(d.getTime() + (minute_in_milliseconds * 30))
    formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    this.localtime["New Delhi"] = formatted;

    // Srinager Time (GMT+5:30)
    d_ = new Date(d.getTime() + minute_in_milliseconds * 30)
    formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    this.localtime["Srinager"] = formatted;

    // Washington Time (GMT-4:00)
    d_ = new Date(d.getTime() - (hour_in_milliseconds * 9))
    formatted = d_.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' })
    this.localtime["Washington"] = formatted;
  }

  gotoLink(link) {
    link = link.includes('http')?link:'https://'+link;
    window.open(link)
  }
}
