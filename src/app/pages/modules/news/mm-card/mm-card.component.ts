import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NewsService } from "src/service/news.service";

@Component({
  selector: "app-mm-card",
  templateUrl: "./mm-card.component.html",
  styleUrls: ["./mm-card.component.css"],
})
export class MmCardComponent implements OnInit {
  @Input() disableContext = false;
  @Input() news;
  @Input() corner;
  @Input() buttonStyle = "long";
  @Input() type = "horizontal";
  @Input() cat;
  @Input() textGradientVariable = false;
  sub_cats: any = [];
  context_menu = false;
  constructor(
    private router: Router,
    public api: NewsService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('cat baby ',this.cat)
    // console.log('inside mm-card')
    // console.log('news are ',this.news)
  }

  navigate(path, corner, extra = "") {
    let paths = [path, corner];
    extra && paths.push(extra);
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(paths))
    );
    window.open(url);
  }

  gotoLink(event, url) {
    event.stopPropagation();
    url = url.includes("http") ? url : "https://" + url;
    window.open(url);
  }

  getCatClass(): string {
    if (this.cat === 'IS') {
      return 'cat-is';
    } else if (this.cat === 'domestic') {
      return 'cat-domestic';
    }
    return ''; // Default class if no match
  }
}
