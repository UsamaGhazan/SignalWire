import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { DataService } from 'src/service/data.service';
import { NewsService } from 'src/service/news.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-yt-handlers',
  templateUrl: './all-yt-handlers.component.html',
  styleUrls: ['./all-yt-handlers.component.css']
})
export class AllYtHandlersComponent implements OnInit {
  dtOptionsM: DataTables.Settings = {};
  dtTriggerM: Subject<any> = new Subject<any>();
  constructor(public api:NewsService,
    private router: Router,
   private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }
  handle:any={
    text:"",
    cat:""
  }
  searchtext=""
  category=["east_corner","west_corner","west_corner_iran","internal_security"]
  cat_specific = this.api.getCats("all");
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
    this.getAllYTHandler()
  }
  filterKeywordByCat(cat){
    this.selected_cat=cat
    this.getAllYTHandler()
  }
  allhandleList=[]
  getAllYTHandler(){
    this.ngxService.start()
    this.allhandleList=[]
    this.api.getAllYTHandler(this.selected_cat).subscribe(
      (data: any) => {
        console.log('utube data ',data)
      if(data?.data){
        this.allhandleList=data.data
        this.dtTriggerM.next(this.allhandleList);
        this.ngxService.stop()
      }
      },(error) => {
        this.ngxService.stop()
        console.log(error.error.message)
        this.toastr.error(error.error.message)
      })
  }

  addYTHandler(update=""){
    if(!this.handle.text || !this.handle.cat){
      this.toastr.info("Field Required")
      return
    }
    if(update){
      this.api.updateYTHandler(this.handle.id,this.handle.cat,this.handle.text).subscribe(
        (data: any) => {
        if(data){
          this.updateflag=false;
          this.toastr.success("Handle Updated Successfully")
          this.getAllYTHandler()
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }
    else{
      this.api.addYTHandler(this.handle.text,this.handle.cat).subscribe(
        (data: any) => {
        if(data){
          if(data?.message?.includes("already")){
            this.toastr.error("Record already added")
            return;
          }
          this.toastr.success("Handle Added Successfully")
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }

  }

  deleteYTHandler(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.api.deleteYTHandler(id).subscribe(
          (data: any) => {
          if(data?.message.includes("successfully")){
            this.toastr.success("Deleted Successfully")
            this.getAllYTHandler()
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
  updateYTHandle(rec){
    this.updateflag=true;
    ($("#YThandlerModal") as any).modal("show")
     this.handle.text=rec.handle_screen_name,
     this.handle.cat=rec.category
     this.handle.id=rec.id 
  }
  changeSelect(){
    console.log('changeSelect this.handle.cat ',this.handle.cat)
    this.cat_specific=this.api.getCats(this.handle.cat)
  }
}
