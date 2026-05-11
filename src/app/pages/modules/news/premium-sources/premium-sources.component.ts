import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { global_pointer } from "src/assets/js/global_config";
import { NewsService } from "src/service/news.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import {
  Article,
  Editorial,
  PremiumSourceFilterI,
  PremiumSourcesFilter,
} from "src/service/interfaces";

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
  published_by: any;
}

interface SourceI {
  name: string;
  image: string;
}
@Component({
  selector: "app-premium-sources",
  templateUrl: "./premium-sources.component.html",
  styleUrls: ["./premium-sources.component.css"],
})
export class PremiumSourcesComponent implements OnInit, AfterViewInit {
  changeDateFormat() {
    this.date = this.datePicker.replace("-", ",").replace("-", ",");
  }
  system: string = "";

  // Default Page Number is 1
  pageNumber: number = 1;
  // By default no source is selected
  currentSource: number = -1;
  // For the search functionality
  keywords: string = "";

  //
  currentAuthor: number = -1;

  date: string = "latest";

  // For the custom datepicker
  datePicker: string;
  loading = false;

  sourcesList: SourceI[] = [];
  authorsList = [];
  constructor(
    private eRef: ElementRef,
    public api: NewsService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.system = global_pointer.system;

    // To remove the default header and the footer;
    let body_ = document.body;
    body_.classList.add("nofooter");

    // Top get the premium articles;
    // this.getPremiumEditorials();
    // For getting all the sources
    this.getPremiumSources();
    this.getPremiumSourcesBy();
  }

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
  editorialList: EditorialItem[] = [];

  getPremiumEditorials(pageNumber = 1) {
    this.loading = true;
    this.api.getPremiumEditorials(pageNumber).subscribe({
      next: (data: any) => {
        var res: any = data?.data;

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
              published_by: element?._source?.data?.published_by,
            };
            this.editorialList.push(newsFormate);
          });
        }
      },

      complete: () => {
        console.log(this.editorialList);
        this.loading = false;
      },
    });
  }

  checkScrolled(event) {
    if (this.loading) {
      return;
    }
    let { target } = event;
    let scroll_offset = 20;
    var isFullyScrolled =
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - scroll_offset;
    if (isFullyScrolled) {
      console.log("End of scroll");
      this.pageNumber = this.pageNumber + 1;

      this.getPremiumSourcesBy(true);
    }
  }

  navigate(path, corner, extra = "") {
    let paths = [path, corner];
    extra && paths.push(extra);
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree(paths))
    );
    window.open(url);
  }

  getPremiumSources() {
    interface Response {
      [key: string]: any;
    }
    this.api.getPremiumSources().subscribe({
      next: (data: Response) => {
        console.log(data);
        for (const [key, value] of Object.entries(data)) {
          this.sourcesList.push({
            name: key,
            image: value,
          });
        }
      },

      complete: () => {
        console.log(this.sourcesList);
      },
    });
  }

  getPremiumSourcesBy(scroll = false, byAuthor = false) {
    this.loading = true;
    if (!scroll) {
      this.authorsList = [];
      this.editorialList = [];
    }

    if (byAuthor) {
      this.editorialList = [];
    }
    this.api
      .getPremiumSourcesBy({
        date: this.date,
        keywords: this.keywords,
        author:
          this.currentAuthor >= 0 &&
          this.currentAuthor < this.authorsList.length
            ? this.authorsList[this.currentAuthor]
            : "",
        source:
          this.currentSource >= 0 &&
          this.currentSource < this.sourcesList.length
            ? this.sourcesList[this.currentSource].name
            : "",
        pageNumber: this.pageNumber,
      })
      .subscribe({
        next: (data_: any) => {
          // ressetting the data

          const response: Editorial[] = data_.data;
          var res: Editorial[] = response;
          console.log(res);
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
                published_by: element?._source?.data?.published_by,
              };
              this.editorialList.push(newsFormate);
            });
          }
        },

        complete: () => {
          console.log(this.authorsList);
          console.log(this.editorialList);
          this.loading = false;

          this.editorialList.forEach((editorial) => {
            if (!this.authorsList.includes(editorial.published_by?.trim())) {
              this.authorsList.push(editorial.published_by?.trim());
            }
          });

          console.log(this.authorsList);
        },
      });
  }

  sourcesSelected(source: number) {
    // resetting the values;
    this.resetFilters();
    this.currentSource = source;
    this.getPremiumSourcesBy();
  }

  authorSelected(author: number) {
    this.resetFilters(true);
    this.currentAuthor = author;

    this.getPremiumSourcesBy(true, true);
  }

  resetFilters(keepSource = false) {
    this.pageNumber = 1;
    this.currentAuthor = -1;
    this.date = "latest";
    if (!keepSource) {
      this.currentSource = -1;
    }
  }

  findSourceImg(name: string) {
    const imgPath = this.sourcesList.find((itm) => {
      console.log(itm.name);
      if (itm.name == "Foreign Policy") {
        console.log(itm.image);
      }
      return itm.name == name;
    }).image;

    return imgPath;
  }

  backToHome() {
    window.location.href = global_pointer.newsIp;
  }
}
