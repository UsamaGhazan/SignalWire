import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NewsService } from 'src/service/news.service';

@Component({
  selector: 'app-move-context-menu',
  templateUrl: './move-context-menu.component.html',
  styleUrls: ['./move-context-menu.component.css']
})
export class MoveContextMenuComponent implements OnInit {
  mounted: any = false;
  sub_cats: any = []
  context_menu = false;
  genNewsDate=""
  constructor(
    public api: NewsService,
    private toastr: ToastrService,) {

  }

  ngOnInit(): void {
  }

  gen_move={
    cat:"",
    sub_cat:""
  }
  moveContent(cat, sub_cat) {
    if(sub_cat=='trash_it') {
      Swal.fire({
        title: 'Are you sure?',
        text: this.api.current_context_menu.type + ' will be deleted forever',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.api.deleteContent();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
      return;
    }
    if (this.api.current_context_menu.type == 'news') {
      this.api.move_News(cat, sub_cat)
    } 
    else if(this.api.current_context_menu.type == 'tweet') {
      this.api.move_Tweet(cat, sub_cat)
    }
    else{
      this.gen_move.cat=cat;
      this.gen_move.sub_cat=sub_cat
      if(!this.api.current_context_menu.content.date_text.includes("ago")){
        this.genNewsDate=this.api.current_context_menu.content.date_text
        this.updateGenNews()
      }
      else{
        ($("#setDate_modal") as any).modal("show");
        let d = this.api.resolve_date(this.api.current_context_menu.content.date_text);
        var now:any = d;
        this.genNewsDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()+"T00:00:00";
      }
    }
  }
  updateGenNews(){
    this.api.gen_news(this.api.current_context_menu.content,this.api.current_context_menu.corner,this.gen_move.cat, this.gen_move.sub_cat,this.genNewsDate)
    this.api.current_context_menu.menuOpen=false
  }
  onchange(){
    var now:any = this.genNewsDate
    this.genNewsDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()+"T00:00:00";
  }
  popSublist(event,sublist) {
    let {target, clientY} = event;
    let b = sublist.getBoundingClientRect();
    let posx = (b.left <= 400) ? 100 : -100;
    let style_ = "transform: translateX(" + posx + "%);";
    let parent_ = target.parentElement.parentElement;
    // console.log("mouseover",target.parentElement.parentElement.clientHeight,clientY)
    if(clientY-parent_.offsetTop<parent_.clientHeight/2) {
      style_ += "bottom: auto; top: 0;"
    } else {
      style_ += "bottom: 0; top: auto;"
    }
    sublist.setAttribute("style", style_);
    sublist.classList.add("active");
  }
}