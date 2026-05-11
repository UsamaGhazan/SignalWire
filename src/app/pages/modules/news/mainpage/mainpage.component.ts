import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { global_pointer } from "src/assets/js/global_config";
import { Editorial, EditorialObj } from "src/service/interfaces";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { DataService } from "src/service/data.service";

interface EditorialItem {
  id: string;
  source: string;
  title: any;
  description: string;
  link: string;
  country: string;
  published_date: any;
  cat_hits: string;
  image: string;
}
@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent implements OnInit, AfterViewInit {
  logout() {
    window.location.href = global_pointer.newsIp + "logout";
  }
  system = "";
  now_t: string;
  now_d: string;
  text: string;
  origin: string;
  newsLoading: boolean = false;
  NewsList: any = [];
  showSearchDropdown: boolean = false;
  constructor(
    public api: NewsService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private eRef: ElementRef,
    public data: DataService
  ) {}
  @ViewChild("videoLogo", { static: false })
  videoLogo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    if (this.videoLogo) {
      console.log("Video element ready:", this.videoLogo.nativeElement);
      this.videoLogo.nativeElement.muted = true;
      this.videoLogo.nativeElement.play();
      console.log("Video element ready:", this.videoLogo.nativeElement);
    } else {
      console.error("Video element not found");
    }
  }

  @ViewChild("dropdownContainer", { static: false })
  dropdownContainer!: ElementRef;

  ngOnInit(): void {
    this.system = global_pointer.system;
    let body_ = document.body;
    body_.classList.add("nofooter");

    // To get the origin
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");

    // For gettng the date & time
    this.getTimes();
    setInterval(() => {
      this.getTimes();
    }, 1000);

    // For the flashNews
    this.getFlashNews();

    // For the editorials;
    this.getPremiumAuthors();
  }

  // For getting the date & time; #################
  getTimes() {
    let d = new Date();
    this.now_t = d.toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    });
    this.now_d = d.toLocaleDateString("pk", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  // For the flash news ################ ###########
  flashNewsList = [];
  getFlashNews() {
    this.api.getFlashNews("all").subscribe({
      next: (data: any) => {
        var res: any = data?.data;
        if (res && res.length) {
          res.forEach((element, i) => {
            let keywords_ = element?._source?.data?.keywords_hits;
            let desc_ = element?._source?.data?.description;
            let title_ = element?._source?.data?.title;
            let newsFormate = {
              index: element._index,
              id: element._id,
              source: element._source.source_news,
              title: this.api.highlightWords(title_, keywords_),
              description: this.api.highlightWords(desc_, keywords_),
              news_link: element._source.data.news_link,
              country: element._source.data.country,
              published_date: this.api.formatDate(
                element._source.published_date
              ),
              keywords: keywords_,
              cat_hits: element?._source?.data?.cat_hits,
              image: element?._source?.data?.thumbnail || "",
            };
            // if (element?._source?.data?.thumbnail) {
            this.flashNewsList.push(newsFormate);
            // }
          });
        }
      },

      error: (error) => {
        console.log("There is an error while fetching the flash news");
      },

      complete: () => {
        console.log(this.flashNewsList);
      },
    });
  }

  // get the premium sources #################
  editorialList: EditorialItem[] = [];
  getPremiumAuthors() {
    this.api.getPremiumAuthors().subscribe({
      next: (data: any) => {
        var res: any = data?.data;
        const editorial: Editorial[] = data?.data;
        console.log(editorial);

        if (res && res.length) {
          res.forEach((element, i) => {
            let newsFormate = {
              id: element._id,
              source: element._source.source_news,
              title: this.api.highlightWords(
                element?._source?.data?.title,
                element?._source?.data?.keywords_hits
              ), //element?._source?.data?.title,
              description: element?._source?.data?.description,
              link: element._source.data.link,
              country: element._source.data.country,
              published_date: this.api.formatDate(
                element._source.published_date
              ),
              cat_hits: element?._source?.data?.cat_hits,
              image: element?._source?.data?.thumbnail || "",
            };
            this.editorialList.push(newsFormate);
          });
        }
      },

      complete: () => {
        console.log(this.editorialList);
      },
    });
  }

  // For the search functionality
  newsGeneralSearch(event: Event) {
    event.preventDefault();
    console.log("clicked");
    this.showSearchDropdown = true;
    console.log(this.text);
    // this.loader_flag = true;
    // this.initial_state = false;
    this.newsLoading = true;
    window.document.body.classList.remove("gen-search-zero-state");
    this.NewsList = [];
    this.api.newsGeneralSearch(this.text, this.origin).subscribe({
      next: (data: any) => {
        if (!data) return;
        this.NewsList = data.general_news;
      },
      error: (error) => {
        this.newsLoading = false;

        console.log("error newsGeneralSearch()", error);
      },

      complete: () => {
        this.newsLoading = false;
        console.log(this.NewsList);
      },
    });
  }

  // Navigation to news details link
  gotoLink(link) {
    link = link.includes("http") ? link : "https://" + link;
    window.open(link);
  }

  explore(origin, country = "") {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        !country
          ? this.router.createUrlTree(["/explore", origin])
          : this.router.createUrlTree(["/explore", origin, country])
      )
    );
    window.open(url);
  }

  explorePremiumSources() {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(["/premiumsources"]))
    );
    window.open(url);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    if (
      this.showSearchDropdown &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.showSearchDropdown = false;
    }
  }

  newsLink(link, direct: any = "") {
    if (!direct) {
      link = link.includes("http") ? link : "https://" + link;
    } else {
      typeof direct == "object" && direct.stopPropagatiPon();
    }
    window.open(link);
  }

  navigate(path, corner, extra = "") {
    let paths = [path, corner];
    extra && paths.push(extra);
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(paths))
    );
    window.open(url);
  }
}
