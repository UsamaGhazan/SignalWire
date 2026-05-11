import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/service/data.service';
import { global_pointer } from 'src/assets/js/global_config';
import { NewsService } from 'src/service/news.service';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor(public data:DataService, public api:NewsService) { }
  system=""
  ngOnInit(): void {
    this.system=global_pointer.system
    this.sidebarMat()
  }
  sidebarMat(){
    const mobileScreen = window.matchMedia("(max-width: 990px )");
$(document).ready(function () {
    $(".dashboard-nav-dropdown-toggle").click(function () {
        $(this).closest(".dashboard-nav-dropdown")
            .toggleClass("show")
            .find(".dashboard-nav-dropdown")
            .removeClass("show");
        $(this).parent()
            .siblings()
            .removeClass("show");
    });
    $(".menu-toggle").click(function () {
        if (mobileScreen.matches) {
            $(".dashboard-nav").toggleClass("mobile-show");
        } else {
            $(".dashboard").toggleClass("dashboard-compact");
        }
    });
});
  }
  collapseMenu(target) {
    if(target.classList.contains('mobile-show')) {
      target.classList.remove('mobile-show')
    }
  }
}
