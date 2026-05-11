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
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.css']
})
export class SourceDetailsComponent implements OnInit {
  origin=""
  text="";
  type="";
  offset=1;
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
    this.type = this._Activatedroute.snapshot.paramMap.get("type");
    this.text = this._Activatedroute.snapshot.paramMap.get("text");
  }
  desiredList:any= []
  auth_search_keyword = ""

  ngOnInit(): void {
  this.getAuditorialAuthdetails()
  }
  getAuditorialAuthdetails(){
    this.api.getAuditorialAuthdetails(this.origin,this.type,this.text,this.offset).subscribe(
      (data: any) => {
        if(data?.data?.length){
          this.desiredList=[].concat(this.desiredList,data.data)
        }
        this.ngxService.stop();
        
      },
      error=>{
        this.ngxService.stop();
        console.log("error newsGeneralSearch()",error)
      })
  }

  onScroll(): void {
    console.log('scrolled');
    this.offset++;
    this.getAuditorialAuthdetails()
  }

  viewDetails(id) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["editorial-details", this.origin, id])
      )
    );
    window.open(url);
  }

  gotoLink(event,link) {
    event.stopPropagation();
    window.open(link);
  }
}
