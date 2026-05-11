import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/service/data.service';
import { Pipe, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2';
import { NewsService } from 'src/service/news.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-all-handlers',
  templateUrl: './all-handlers.component.html',
  styleUrls: ['./all-handlers.component.css']
})
export class AllHandlersComponent implements OnInit {
  dtOptionsM: DataTables.Settings = {};
  dtTriggerM: Subject<any> = new Subject<any>();
  constructor(public api:NewsService,
    private router: Router,
   private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }
  handle:any={
    text:"",
    cat:"",
    cat_specific:"all"
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
    this.getAllHandler()
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggerM.unsubscribe();
  }
  filterKeywordByCat(cat){
    this.selected_cat=cat;
    this.getAllHandler()
  }
  allhandleList=[]
  getAllHandler(){
    this.ngxService.start()
    this.allhandleList=[]
    this.api.getAllHandler(this.selected_cat).subscribe(
      (data: any) => {
        console.log('getallhandler data',data)
      if(data?.data){
        data.data.forEach(x => {
          var info=JSON.parse(x.handle_info)
          var jsonx={
            id:x.id,
            category:x.category,
            cat_specific:x.cat_specific,
            name: info.name,
            screen_name: info.screen_name,
            followers_count: info.followers_count,
            friends_count: info.friends_count,
            profile_image_url_https: info.profile_image_url_https,
            handle_screen_name:x.handle_screen_name
          }
          this.allhandleList.push(jsonx)
        });
        this.dtTriggerM.next(this.allhandleList);
        this.ngxService.stop()
      }
      },(error) => {
        this.ngxService.stop()
        console.log(error.error.message)
        this.toastr.error(error.error.message)
      })
  }

  addHandler(update=""){
    if(!this.handle.text || !this.handle.cat){
      this.toastr.info("Field Required")
      return
    }
    console.log('add handler this.handle.id ',this.handle.id)
    console.log('add handler this.handle.cat ',this.handle.cat)
    console.log('add handler this.handle.text ',this.handle.text)
    console.log('add handler this.handle.cat_specific ',this.handle.cat_specific)
    if(update){
      this.api.updateHandler(this.handle.id,this.handle.cat,this.handle.text,this.handle.cat_specific).subscribe(
        (data: any) => {
        if(data){
          this.updateflag=false;
          this.toastr.success("Handle Updated Successfully")
          this.getAllHandler()
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }
    else{
      this.api.addHandler(this.handle.text,this.handle.cat, this.handle.cat_specific).subscribe(
        (data: any) => {
        if(data){
          this.toastr.success("Handle Added Successfully")
        }
        },(error) => {
          this.ngxService.stop()
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }

  }

  deleteHandler(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.api.deleteHandler(id).subscribe(
          (data: any) => {
          if(data?.message.includes("successfully")){
            this.toastr.success("Deleted Successfully")
            this.getAllHandler()
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
  updateHandle(rec){
    console.log('UpdateHandle rec ',rec)
    this.updateflag=true;
    ($("#handlerModal") as any).modal("show")
     this.handle.text=rec.name,
     this.handle.cat=rec.category
     this.handle.cat_specific=rec.cat_specific || "all"
     this.changeSelect();
     this.handle.id=rec.id 
  }

  changeSelect() {
    this.cat_specific = this.api.getCats(this.handle.cat);
  }
}
