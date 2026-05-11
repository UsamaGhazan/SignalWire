import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NewsService } from "src/service/news.service";
import { DataService } from "src/service/data.service";
@Component({
  selector: "app-twitter-card",
  templateUrl: "./twitter-card.component.html",
  styleUrls: ["./twitter-card.component.css"],
})
export class TwitterCardComponent implements OnInit {
  @Input() tweet;
  @Input() corner;
  @Input() cat;
  @Input() subCat;
  sub_cats: any = [];
  context_menu = false;
  constructor(
    private router: Router,
    public api: NewsService,
    private location: Location,
    private toastr: ToastrService,
    private data: DataService
  ) {}

  ngOnInit(): void {}

  navigate(path, corner, extra = "") {
    if (
      corner == "mil" ||
      corner == "intl" ||
      corner == "iiojk" ||
      corner == "domestic"
    ) {
      corner = "east_corner";
    } else if (
      corner == "govt" ||
      corner == "polparties" ||
      corner == "is" ||
      corner == "military" ||
      corner == "anti_state"
    ) {
      corner = "internal_security";
    } else {
      corner = !this.data.getCurrentWestTab()
        ? "west_corner"
        : "west_corner_iran";
    }
    let paths = [path, corner];
    extra && paths.push(extra);
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(paths))
    );

    window.open(url);
  }

  gotoLink(url, event: any = "") {
    event && event.stopPropagation();
    url = url.includes("http") ? url : "https://" + url;
    window.open(url);
  }
}
