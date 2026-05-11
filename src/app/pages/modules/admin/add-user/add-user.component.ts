import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/service/data.service';
import { NewsService } from 'src/service/news.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @Input() receivedata;
  constructor(private api:NewsService,private toastr: ToastrService,) { }

  ngOnInit(): void {

  }
  ngOnChanges(receivedata) {
    if(this.receivedata){
      console.log('received data ',this.receivedata)
      this.update_flag = true;
      this.user.name=this.receivedata[0].uname;
      this.user.pass=this.receivedata[0].pass;
      this.user.cat=this.receivedata[0].utype;
      this.user.remarks=this.receivedata[0].remarks;
    }
  }
  user:any={
    name:"",
    pass:"",
    cat:"",
    remarks:"--"
  }
  update_flag=false
  category=["admin","sadmin"]
  addUser(){
    if(this.update_flag){
      this.api.updateUser(this.receivedata[0].id,this.user.name,this.user.pass,this.user.cat,this.user.remarks).subscribe(
        (data: any) => {
        if(data){
          this.toastr.success("User Updated Successfully")
        }
        },(error) => {
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        }
        )
        setTimeout(() => {
          document.body.classList.add("news-modal-true");
          ($('#editModal') as any).modal('hide')
        }, 1000);
    }
    else{
      this.api.addUser(this.user.name,this.user.pass,this.user.cat,this.user.remarks).subscribe(
        (data: any) => {
        if(data){
          this.toastr.success("User Added Successfully")
        }
        },(error) => {
          console.log(error.error.message)
          this.toastr.error(error.error.message)
        })
    }
   
  }
}
