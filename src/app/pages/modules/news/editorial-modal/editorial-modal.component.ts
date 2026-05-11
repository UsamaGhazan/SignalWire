import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ToastrService } from "ngx-toastr";
import { global_pointer } from "src/assets/js/global_config";
import { offset } from "highcharts";

@Component({
  selector: "app-editorial-modal",
  templateUrl: "./editorial-modal.component.html",
  styleUrls: ["./editorial-modal.component.css"],
})
export class EditorialModalComponent implements OnInit {
  @Input() origin;
  @Input() keyword = "";
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
  ) {}

  ngOnInit(): void {
    if (this.origin == "west_corner" && this.data.getCurrentWestTab() == 1) {
      this.origin = "west_corner_iran";
    }
    console.log("The origin is: ", this.origin);
    console.log("modal baby");
    this.getEditorialSourceOrAuth(this.origin, "sources");
    this.getEditorialSourceOrAuth(this.origin, "authors");
  }

  ngOnChanges() {
    this.filter();
  }
  authors = [];
  sources = [];
  premium = [];

  authors_ro = [];
  sources_ro = [];
  premium_ro = [];

  loader = {
    authors: true,
    sources: true,
    premium: true,
  };

  selected_tab = "authors";
  getEditorialSourceOrAuth(origin, type) {
    this.loader[type] = true;
    type == "sources" && (this.loader["premium"] = true);
    this.api.getEditorialSourceOrAuth(origin, type).subscribe(
      (data: any) => {
        console.log("author data ", data);
        this.loader[type] = false;
        type == "sources" && (this.loader["premium"] = false);
        if (!data && !data?.data?.length) return;
        if (data.data.length) {
          this[type] = data.data;
          this[type + "_ro"] = data.data;
          this.sortLists("up", type);
          if (type == "sources") {
            let keys = Object.keys(data.premium_editorials?.[this.origin]);
            let values = Object.values(data.premium_editorials?.[this.origin]);
            let arr: any = [];
            keys.forEach((key, i) => {
              arr.push({
                key: key,
                url: values[i],
              });
            });
            this["premium"] = arr;
            this["premium_ro"] = arr;
            this.sortLists("up", "premium");
          }
        }
      },
      (error) => {
        this.loader[type] = false;
        type == "sources" && (this.loader["premium"] = false);
        console.log(error, "priorities-error");
      }
    );
  }
  redirecttoDeatails(path, type, text) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([path, this.origin, type, text])
      )
    );
    window.open(url);
  }

  filter() {
    this[this.selected_tab] = this[this.selected_tab + "_ro"].filter((x) => {
      return JSON.stringify(x)
        ?.toLowerCase()
        ?.includes(this.keyword?.toLowerCase());
    });
  }

  sort_filter = {
    authors: "key",
    sources: "key",
    premium: "key",
  };
  sortEditorial(event, type) {
    // add active class
    let parent = document.querySelector("#" + this.selected_tab);
    parent.querySelectorAll("i.sorting-icon").forEach((x) => {
      x.classList.remove("active");
    });
    event.target.classList.add("active");

    this.sortLists(type, this.selected_tab);
  }

  sortLists(type, selected_tab) {
    // sort
    type = type == "up" ? 1 : -1;
    let kind = this.sort_filter[selected_tab];
    this[selected_tab] = this[selected_tab].sort((a, b) => {
      return typeof a[kind] === "string"
        ? a[kind].localeCompare(b[kind]) * type
        : type > 0
        ? a[kind] - b[kind]
        : b[kind] - a[kind];
    });
  }
}
