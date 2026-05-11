import { ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";
import { ToastrService } from "ngx-toastr";
import { global_pointer } from "src/assets/js/global_config";
import { MatDialog } from "@angular/material/dialog";
import { PasswordModalComponent } from "../password-modal/password-modal.component";
@Component({
  selector: "app-news-header",
  templateUrl: "./news-header.component.html",
  styleUrls: ["./news-header.component.css"],
})
export class NewsHeaderComponent implements OnInit {
  cat: any = "";
  corner: any = "";
  corner_country: any = "";
  page: any = "";
  system = "";
  now_t: any = "--:-- --";
  now_d: any = "---, -- ----";
  localtime: any = {
    Islamabad: "---, -- --- ---- --:--:-- --",
    "New Delhi": "---, -- --- ---- --:--:-- --",
    Srinager: "---, -- --- ---- --:--:-- --",
    Washington: "---, -- --- ---- --:--:-- --",
  };

  activeWestTab = 0;
  newState = true;
  drodownMainShow = false;
  dropdownMainList: string[] = [];
  // leftPosition: 0;
  // This is for the west afghanistan and iran switch tabs

  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.system = global_pointer.system;
    this.checkUserType();
    // this.cat = this._Activatedroute.snapshot.paramMap.get("cat");
    // this.corner = this._Activatedroute.snapshot.paramMap.get("origin");
    this.page = window.location.hash.split("/")?.[1]; // first pathname (explore, news-details etc)
    let hash = window.location.hash.split("/")?.[2]; // second pathname (west_corner, internal_security etc)
    let country = window.location.hash.split("/")?.[3]; // third pathname (afghanistan, iran, id, etc)
    if (hash?.includes("corner") || hash?.includes("internal_security")) {
      if (country) {
        this.corner_country = country;
      }
      this.corner = hash;
    } else {
      this.cat = hash;
      this.corner = this.page;
      if (this.page === "west_corner" && country) {
        this.corner_country = hash;
        this.cat = country;
      }
    }

    // Get the current state of west corner
    // Current active tab of the west corner => iran / Afghanistan
    this.activeWestTab = this.data.getCurrentWestTab();
    setInterval(() => {
      this.getTimes();
    }, 1000);

    this.dropdownMainListInit();
  }
  openPasswordModal() {
    const dialogRef = this.dialog.open(PasswordModalComponent, {
  width: '400px',
  position: {
    top: '150px',      // distance from top
  }
});


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("New Password:", result.newPassword);
        console.log("Confirm Password:", result.confirmPassword);
      }
    });
  }
  dropdownMainListInit() {
    const fixedList = ["west_corner", "internal_security", "east_corner"];
    const currentCorner = this.corner;
    const newCornersList = fixedList.filter(
      (corner) => corner != currentCorner
    );
    this.dropdownMainList = newCornersList;
  }
  admin = false;
  checkUserType() {
    this.api.checkUserType().subscribe(
      (data: any) => {
        this.api.userId=data?.uid
        if (data?.user_type == "sadmin") {
          this.admin = true;
          
        }
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }
  getTimes() {
    let minute_in_milliseconds = 60000;
    let hour_in_milliseconds = 3.6e6;

    let d = new Date();
    this.now_t = this.api.formatDate(d.toString(), true).time;
    this.now_d = this.api.formatDate(d.toString(), true).date;

    // Islamabad Time (GMT+5:00)
    let d_ = new Date(d.getTime());
    let formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["Islamabad"] = formatted;

    // New Delhi Time (GMT+5:30)
    d_ = new Date(d.getTime() + minute_in_milliseconds * 30);
    formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["New Delhi"] = formatted;

    // Srinager Time (GMT+5:30)
    d_ = new Date(d.getTime() + minute_in_milliseconds * 30);
    formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["Srinager"] = formatted;

    // Washington Time (GMT-4:00)
    d_ = new Date(d.getTime() - hour_in_milliseconds * 9);
    formatted = d_.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.localtime["Washington"] = formatted;
  }

  readMore(linkurl, id, context = "") {
    if (!id && !context) {
      return;
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.corner, id])
      )
    );
    window.open(url);
  }

  explore(cat) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(["/east_corner", cat]))
    );
    window.open(url);
  }
  explore_(cat) {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/internal_security", cat])
      )
    );
    window.open(url);
  }
  explore_west(cat) {
    if (!this.activeWestTab) {
      this.corner_country = "afghanistan";
    } else {
      this.corner_country = "iran";
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["west_corner", this.corner_country, cat])
      )
    );
    window.open(url);
  }
  logout() {
    window.location.href = global_pointer.newsIp + "logout";
  }

  decideHome() {
    let path = window.location.hash;
    let newCorner = this.corner;
    if (
      (path?.includes("corner") || path?.includes("internal_security")) &&
      !path.includes("explore")
    ) {
      if (this.corner == "west_corner_iran") {
        newCorner = "west_corner";
      }
      if (path?.includes("gen-search")) {
        window.location.replace(
          window.location.href.split("#")[0] + "#/explore/" + newCorner
        );
        window.location.reload();
      } else {
        console.log("navigatingnow");
        this.router.navigate([`/explore/${newCorner}`], {
          queryParams: { isNavigation: true },
        });
      }
    } else {
      this.api.gotoHome();
    }
  }

  decideCorner(corner: string) {
    window.location.replace(
      window.location.href.split("#")[0] + "#/explore/" + corner + ""
    );
    window.location.reload();
  }

  toggleMenu(event, dropMenu) {
    event.stopPropagation();
    dropMenu.classList.toggle("active");
  }

  westTabClickHandler(index: number) {
    const westCategory = window.location.hash.split("/")?.[3];
    this.activeWestTab = index;
    this.data.currentWestTab = index;

    if (westCategory) {
      this.router.navigate(["/explore/" + this.corner]);
      return;
    }
  }

  getImageSource(cat: string | number) {
    if (cat == "Afghanistan" || cat == 0) {
      return "../../../../../assets/news-img/afghan-flag.png";
    } else {
      return "../../../../../assets/news-img/iran-flag.png";
    }
  }

  westTabClickHandlerToggle() {
    this.newState = false;
    const westCategory = window.location.hash.split("/")?.[3];
    if (!this.activeWestTab) {
      this.activeWestTab = 1;
      this.data.currentWestTab = 1;

      this.data.setCurrentWestTab(1);
    } else {
      this.activeWestTab = 0;
      this.data.currentWestTab = 0;
      this.data.setCurrentWestTab(0);
    }

    // Routing is necessary otherwise page wouldnt send the request to the api
    // For the iran there has be sperate api calls and same for the aghanistan
    if (westCategory) {
      this.router.navigate(["/explore/" + this.corner]);
      return;
    }
  }

  headerTitle(corner: string = ""): string {
    switch (corner || this.corner) {
      case "east_corner":
        return "East Spotlight";
      case "west_corner":
        return "West View";
      case "west_corner_iran":
        return "West View";
      case "internal_security":
        return "Internal Insight";
    }
  }
}
