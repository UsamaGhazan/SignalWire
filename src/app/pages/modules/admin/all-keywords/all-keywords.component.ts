import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/service/data.service';
import { NewsService } from 'src/service/news.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-all-keywords',
  templateUrl: './all-keywords.component.html',
  styleUrls: ['./all-keywords.component.css']
})
export class AllKeywordsComponent implements OnInit {
  dtOptionsM: DataTables.Settings = {
    pageLength: 100
  };
  dtTriggerM: Subject<any> = new Subject<any>();

  constructor(private api:NewsService,
    private router: Router,
   private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }
  keyword:any={
    text:"",
    cat:"",
    cattype:'primary'
  }
  searchtext=""
  tabStatus='primary'
  category=["east_corner","west_corner","internal_security"]
  selected_cat="east_corner"
  ngOnInit(): void {

    this.dtOptionsM = {
      pagingType: 'full_numbers',
      pageLength: 10,
      "search": {
        "regex": true,
        "smart": false
      }
    };
    this.getAllkeywords(this.selected_cat,'primary')
    this.getAllkeywords(this.selected_cat,'secondry')
    this.getAllkeywords(this.selected_cat,'abbrv')
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggerM.unsubscribe();
  }
  primarykeywordList=[]
  SecondarykeywordList=[]
  abbrvkeywordList=[]
  
  filterKeywordByCat(cat){
    this.getAllkeywords(cat,'primary')
    this.getAllkeywords(cat,'secondry')
    this.getAllkeywords(cat,'abbrv')
  }
  getAllkeywords(corner,type){
    this.ngxService.start()
    type=="primary"?this.primarykeywordList=[]:type=="secondry"?this.SecondarykeywordList=[]:this.abbrvkeywordList=[]
    this.api.getAllkeywords(type,corner).subscribe(
      (data: any) => {
      if(data?.data){
        if(type=="primary"){
          this.primarykeywordList=data.data
          this.dtTriggerM.next(this.primarykeywordList);
        }
        else if(type=="secondry"){
          this.SecondarykeywordList=data.data
          this.dtTriggerM.next(this.SecondarykeywordList);
        }
        else{
          this.abbrvkeywordList=data.data
          this.dtTriggerM.next(this.abbrvkeywordList);
        }
        
        this.ngxService.stop()
      }
      },(error) => {
        this.ngxService.stop()
        console.log(error.error.message)
        this.toastr.error(error.error.message)
      })
  }

  addkeywords(update=""){
    if(!this.keyword.text || !this.keyword.cat){
      this.toastr.info("Field Required")
      return
    }
    if(update){
      this.api.updatekeywords(this.keyword.id,this.keyword.text,this.keyword.cattype,this.keyword.cat).subscribe(
        (data: any) => {
        if(data){
          this.updateflag=false;
          this.toastr.success("keyword Updated Successfully")
          this.getAllkeywords(this.selected_cat,this.tabStatus)
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }
    else{
      this.api.addkeywords(this.keyword.text,this.keyword.cattype,this.keyword.cat).subscribe(
        (data: any) => {
        if(data){
            if(data?.message?.includes("already")){
              this.toastr.error("Record already added")
              return;
            }
          this.toastr.success("keyword Added Successfully")
          this.getAllkeywords(this.selected_cat,this.tabStatus)
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }

  }

  deletekeywords(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.api.deletekeywords(id,this.tabStatus).subscribe(
          (data: any) => {
          if(data?.message.includes("successfully")){
            this.toastr.success("Deleted Successfully")
            this.getAllkeywords(this.selected_cat,this.tabStatus)
          }
          },(error) => {
            this.ngxService.stop()
            console.log(error.error.message)
            this.toastr.error(error.error.message)
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })


  
  }
  updateflag=false
  updatekeyword(rec){
    this.updateflag=true;
    ($("#keywordsModal") as any).modal("show")
     this.keyword.text=rec.keyword,
     this.keyword.cat=rec.category
     this.keyword.id=rec.id 
  }
}
