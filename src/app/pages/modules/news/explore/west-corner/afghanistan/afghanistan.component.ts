import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
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
import {
  AfghanCategoriesPage,
  AfghanCategoriesPage_p,
  AfghanCategory,
  AfghanCatergoriesLoader,
  AfghanCatergoriesLoader_p,
  AfghanSubCategory,
  allCatI,
  EditorialNewsFormat,
  NewsFormat,
} from "./interfaces";

@Component({
  selector: "app-afghanistan",
  templateUrl: "./afghanistan.component.html",
  styleUrls: ["./afghanistan.component.css"],
})
export class AfghanistanComponent implements OnInit {
  constructor(
    private sanitizer: DomSanitizer,
    public api: NewsService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private toastr: ToastrService,
    // private ngxService: NgxUiLoaderService,
    private location: Location,
    public data: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  @Output() categoryChange = new EventEmitter<string>();

  xHairInterval: any;
  xHairTopCursor: string | null = null;
  xHairBottomCursor: string | null = null;

  pakCornerInterval: any;
  pakCornerTopCursor: string | null = null;
  pakCornerBottomCursor: string | null = null;

  diploInterval: any;
  diploTopCursor: string | null = null;
  diploBottomCursor: string | null = null;

  isInterval: any;
  isTopCursor: string | null = null;
  isBottomCursor: string | null = null;

  now_time: any = new Date();
  id: any = "";
  origin: string | null = "";
  weathers: any = [];
  zSearch = "";
  indenticalObj_p: AfghanCategory = {
    "Internal Envmt": [],
    "Diplo Overtures": [],
    "Pakistan Corner": [],
    "India Corner": [],
    "X-Hairs": [],
  };

  indenticalObj: AfghanCategory = {
    dom_env: [],
    diplo_econ: [],
    mil: [],
    is_tsm: [],
  };

  // NewsList_report = {
  //   "Internal Envmt": [],
  //   "Diplo Overtures": [],
  //   "Pakistan Corner": [],
  //   "India Corner": [],
  //   "X-Hairs": [],
  // };
  NewsList_report = {
    dom_env: [],
    diplo_econ: [],
    mil: [],
    is_tsm: [],
  };
  tweetList_report = {
    "Internal Envmt": [],
    "Diplo Overtures": [],
    "Pakistan Corner": [],
    "India Corner": [],
    "X-Hairs": [],
  };

  sub_cats: AfghanSubCategory = {
    ...this.indenticalObj,
    all: [
      // "Internal Envmt",
      // "Diplo Overtures",
      // "Pakistan Corner",
      // "India Corner",
      // "X-Hairs",

      ...(Object.keys(this.indenticalObj) as allCatI[]),
    ],
  };
sub_cats_p: AfghanSubCategory = {
    ...this.indenticalObj_p,
    all: [
      // "Internal Envmt",
      // "Diplo Overtures",
      // "Pakistan Corner",
      // "India Corner",
      // "X-Hairs",

      ...(Object.keys(this.indenticalObj_p) as allCatI[]),
    ],
  };
  indenticalObj_temp = {
    x_hair: [],
    pak_corner: [],
    international_env: [],
    india_corner: [],
    diplo: [],
  };
  // Temporary changes until we get twitter data from zulon AI
  sub_cats_temp = {
    ...this.indenticalObj_temp,

    all: ["international_env", "diplo", "pak_corner", "india_corner", "x_hair"],
  };

  sub_cat_loading = {
    x_hair: false,
    pak_corner: false,
    international_env: false,
    india_corner: false,
    diplo: false,
  };

  sub_cat_page_number = {
    x_hair: 1,
    pak_corner: 1,
    international_env: 1,
    india_corner: 1,
    diplo: 1,
  };
  // now_t: any = "--:-- --"
  // now_d: any = "---, -- ----"
  // localtime: any = {
  //   "Islamabad": "---, -- --- ---- --:--:-- --",
  //   "New Delhi": "---, -- --- ---- --:--:-- --",
  //   "Srinager": "---, -- --- ---- --:--:-- --",
  //   "Washington": "---, -- --- ---- --:--:-- --"
  // }
  editorials: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  multiselect_date: any = {
    news: "",
    tweet: "",
    podcast: "",
    editorial: "",
  };

  auth_search_keyword = "";

  ngOnInit(): void {
    // this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
      this.api.NewsList_explore = {};
    console.log( 'hyhy',this.api.NewsList_explore);
    // this.getWeather(this.origin);
    // this.getTopKeywords()
    // this.getTrendingHashtag()
    // this.getFlashNews()
    this.getNews();
    // this.getTimes();
    this.getTweets();
    this.getProdCasts();
    this.getEditorials();

    // this.fetchPriorities(this.origin);
    // this.getChannels(this.origin);
    // setInterval(() => {
    //   this.getTimes();
    // }, 1000)

    // this.ngxService.start();
    // setTimeout(() => {
    //   this.ngxService.stop();
    // }, 5000);
    this.getReportNews();
    // this.getEditorialSourceOrAuth(this.origin,"sources")
    // this.getEditorialSourceOrAuth(this.origin,"authors")

    // this.fetchInitialAfgXHair();
    // this.xHairInterval = setInterval(() => {
    //   this.fetchNewerAfgXHair();
    // }, 10000);

    // this.fetchInitialAfgPakCorner();
    // this.pakCornerInterval = setInterval(() => {
    //   this.fetchNewerAfgPakCorner();
    // }, 10000);

    // this.fetchInitialAfgDiplo();
    // this.diploInterval = setInterval(() => {
    //   this.fetchNewerAfgDiplo();
    // }, 10000);

    // this.fetchInitialAfgIS();
    // this.isInterval = setInterval(() => {
    //   this.fetchNewerAfgIS();
    // }, 10000);
  }

  ngOnDestroy(): void {
    if (this.xHairInterval) {
      clearInterval(this.xHairInterval);
    }
    if (this.pakCornerInterval) {
      clearInterval(this.pakCornerInterval);
    }
    if (this.diploInterval) {
      clearInterval(this.diploInterval);
    }
    if (this.isInterval) {
      clearInterval(this.isInterval);
    }
  }

  fetchInitialAfgXHair(): void {
    this.sub_cat_loading["x_hair"] = true;
    fetch('http://192.168.100.110:8090/afg_x_hair_corner?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.xHairTopCursor = data.top_cursor;
          this.xHairBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["x_hair"] = [];
          this.sub_cats_temp["x_hair"] = [];

          this.processCursorData(data.data, 'initial', 'x_hair');
        }
        this.sub_cat_loading["x_hair"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Afg X-Hair data:', err);
        this.sub_cat_loading["x_hair"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerAfgXHair(): void {
    if (!this.xHairTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/afg_x_hair_corner?top_cursor=${encodeURIComponent(this.xHairTopCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.xHairTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'x_hair');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Afg X-Hair data:', err);
      });
  }

  fetchOlderAfgXHair(): void {
    if (!this.xHairBottomCursor || this.sub_cat_loading["x_hair"]) return;
    
    this.sub_cat_loading["x_hair"] = true;
    fetch(`http://192.168.100.110:8090/afg_x_hair_corner?bottom_cursor=${encodeURIComponent(this.xHairBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.xHairBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'x_hair');
        }
        this.sub_cat_loading["x_hair"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Afg X-Hair data:', err);
        this.sub_cat_loading["x_hair"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialAfgPakCorner(): void {
    this.sub_cat_loading["pak_corner"] = true;
    fetch('http://192.168.100.110:8090/afg_pak_corner?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.pakCornerTopCursor = data.top_cursor;
          this.pakCornerBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["pak_corner"] = [];
          this.sub_cats_temp["pak_corner"] = [];

          this.processCursorData(data.data, 'initial', 'pak_corner');
        }
        this.sub_cat_loading["pak_corner"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Afg Pak Corner data:', err);
        this.sub_cat_loading["pak_corner"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerAfgPakCorner(): void {
    if (!this.pakCornerTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/afg_pak_corner?top_cursor=${encodeURIComponent(this.pakCornerTopCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.pakCornerTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'pak_corner');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Afg Pak Corner data:', err);
      });
  }

  fetchOlderAfgPakCorner(): void {
    if (!this.pakCornerBottomCursor || this.sub_cat_loading["pak_corner"]) return;
    
    this.sub_cat_loading["pak_corner"] = true;
    fetch(`http://192.168.100.110:8090/afg_pak_corner?bottom_cursor=${encodeURIComponent(this.pakCornerBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.pakCornerBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'pak_corner');
        }
        this.sub_cat_loading["pak_corner"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Afg Pak Corner data:', err);
        this.sub_cat_loading["pak_corner"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialAfgDiplo(): void {
    this.sub_cat_loading["diplo"] = true;
    fetch('http://192.168.100.110:8090/afg_diplo_corner?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.diploTopCursor = data.top_cursor;
          this.diploBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["diplo"] = [];
          this.sub_cats_temp["diplo"] = [];

          this.processCursorData(data.data, 'initial', 'diplo');
        }
        this.sub_cat_loading["diplo"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Afg Diplo Corner data:', err);
        this.sub_cat_loading["diplo"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerAfgDiplo(): void {
    if (!this.diploTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/afg_diplo_corner?top_cursor=${encodeURIComponent(this.diploTopCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.diploTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'diplo');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Afg Diplo Corner data:', err);
      });
  }

  fetchOlderAfgDiplo(): void {
    if (!this.diploBottomCursor || this.sub_cat_loading["diplo"]) return;
    
    this.sub_cat_loading["diplo"] = true;
    fetch(`http://192.168.100.110:8090/afg_diplo_corner?bottom_cursor=${encodeURIComponent(this.diploBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.diploBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'diplo');
        }
        this.sub_cat_loading["diplo"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Afg Diplo Corner data:', err);
        this.sub_cat_loading["diplo"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchInitialAfgIS(): void {
    this.sub_cat_loading["international_env"] = true;
    fetch('http://192.168.100.110:8090/afg_IS_corner?size=20', {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          this.isTopCursor = data.top_cursor;
          this.isBottomCursor = data.bottom_cursor;
          
          this.api.tweetList_explore["international_env"] = [];
          this.sub_cats_temp["international_env"] = [];

          this.processCursorData(data.data, 'initial', 'international_env');
        }
        this.sub_cat_loading["international_env"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching initial Afg IS Corner (international env) data:', err);
        this.sub_cat_loading["international_env"] = false;
        this.cdr.detectChanges();
      });
  }

  fetchNewerAfgIS(): void {
    if (!this.isTopCursor) return;
    
    fetch(`http://192.168.100.110:8090/afg_IS_corner?top_cursor=${encodeURIComponent(this.isTopCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data && data.data.length > 0) {
          if (data.top_cursor) {
            this.isTopCursor = data.top_cursor;
          }
          this.processCursorData(data.data, 'top', 'international_env');
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error('Error fetching newer Afg IS Corner data:', err);
      });
  }

  fetchOlderAfgIS(): void {
    if (!this.isBottomCursor || this.sub_cat_loading["international_env"]) return;
    
    this.sub_cat_loading["international_env"] = true;
    fetch(`http://192.168.100.110:8090/afg_IS_corner?bottom_cursor=${encodeURIComponent(this.isBottomCursor)}&size=20`, {
      headers: {
        'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
      }
    })
      .then(r => r.json())
      .then((data: any) => {
        if (data && data.status === 'success' && data.data) {
          if (data.bottom_cursor) {
            this.isBottomCursor = data.bottom_cursor;
          }
          this.processCursorData(data.data, 'bottom', 'international_env');
        }
        this.sub_cat_loading["international_env"] = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error fetching older Afg IS Corner data:', err);
        this.sub_cat_loading["international_env"] = false;
        this.cdr.detectChanges();
      });
  }

  processCursorData(items: any[], type: 'initial' | 'top' | 'bottom', cat: string): void {
    const processedItems = items.map((element: any) => {
      const desc_ = element.text;
      const keywords_ = element.exist_keywords || [];
      
      return {
        id: element._id,
        name: element.user?.name || '',
        screen_name: element.user?.screen_name || '',
        profile_image_url: element.user?.profile_image_url || '',
        description: this.api.highlightWords(desc_, keywords_),
        report_desc: desc_,
        created_at: this.api.formatDate(element.created_at),
        keywords: keywords_,
        id_str: element.id_str,
        cat_hits: element.cat_hits,
        tweet_image: element.tweet_image || '',
      };
    });

    if (!this.api.tweetList_explore[cat]) {
      this.api.tweetList_explore[cat] = [];
    }
    if (!this.sub_cats_temp[cat]) {
      this.sub_cats_temp[cat] = [];
    }

    if (type === 'top') {
      // For top (newer data), we unshift into the arrays.
      // We process them backwards so the newest item stays at the very top.
      for (let i = processedItems.length - 1; i >= 0; i--) {
        const item = processedItems[i];
        if (!this.api.tweetList_explore[cat].some((t: any) => t.id_str === item.id_str)) {
          this.api.tweetList_explore[cat].unshift(item);
        }
        if (!this.sub_cats_temp[cat].some((t: any) => t.id_str === item.id_str)) {
          this.sub_cats_temp[cat].unshift(item);
        }
      }
    } else {
      // For initial or bottom (older data), we append.
      processedItems.forEach(item => {
        if (!this.api.tweetList_explore[cat].some((t: any) => t.id_str === item.id_str)) {
          this.api.tweetList_explore[cat].push(item);
        }
        if (!this.sub_cats_temp[cat].some((t: any) => t.id_str === item.id_str)) {
          this.sub_cats_temp[cat].push(item);
        }
      });
    }
  }

  // --- Pop-out Feature using Document Picture-in-Picture API ---
  poppedOutSections: string[] = [];

  async popOutSection(cat: string) {
    if (!('documentPictureInPicture' in window)) {
      this.toastr.warning('Document Picture-in-Picture is not supported in this browser. Please use Chrome or Edge Desktop.', 'Unsupported Feature');
      return;
    }

    try {
      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 400,
        height: 600,
      });

      // Track the popped out section
      this.poppedOutSections.push(cat);
      this.cdr.detectChanges(); // Trigger change detection to update the placeholder if needed

      // Copy stylesheets to the PiP window to retain identical styling
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          const cssRules = Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          // Cross-origin stylesheets will throw SecurityError; we can inject them via link tag instead
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media.mediaText;
          link.href = styleSheet.href!;
          pipWindow.document.head.appendChild(link);
        }
      });

      // Special global styles for the PiP window body
      pipWindow.document.body.style.margin = '0';
      pipWindow.document.body.style.padding = '0';
      pipWindow.document.body.style.height = '100vh';
      pipWindow.document.body.style.overflowY = 'auto'; // allow vertical scrolling
      pipWindow.document.body.style.overflowX = 'hidden';
      pipWindow.document.body.style.background = '#0d1117'; // Match app body color if necessary

      // Move the XUP container into the PiP window
      const xupContainer = document.getElementById(`xup-container-${cat}`);
      if (xupContainer) {
        // Enforce the container to take full width and height of the new window
        xupContainer.style.width = '100%';
        xupContainer.style.height = '100%';
        // Remove any fixed width that might come from the grid layout classes
        xupContainer.style.maxWidth = '100%';
        xupContainer.style.minWidth = '100%';
        // Adjust the inner scrollable area to take up remaining height less header
        const midSection = xupContainer.querySelector('.shashka-mid') as HTMLElement;
        if (midSection) {
             midSection.style.height = 'calc(100vh - 100px)'; // approximate header height
             midSection.style.overflowY = 'auto';
        }
        pipWindow.document.body.append(xupContainer);
      }

      // Handle restoring when PiP window is closed
      pipWindow.addEventListener('pagehide', () => {
        this.restoreSection(cat, xupContainer);
      });

    } catch (error) {
      console.error('Failed to open Picture-in-Picture window:', error);
      this.toastr.error('Failed to open floating window.', 'Error');
    }
  }

  restoreSection(cat: string, containerNode: HTMLElement | null) {
    if (containerNode) {
      // Move it back to the original placeholder in the main DOM
      const placeholder = document.getElementById(`xup-placeholder-${cat}`);
      if (placeholder) {
        placeholder.appendChild(containerNode);
      }
    }
    
    // Remove from tracked array
    this.poppedOutSections = this.poppedOutSections.filter((c) => c !== cat);
    this.cdr.detectChanges();
  }


  tranformCatName(cat: string): string {
    if (cat == "mil") {
      return "Mil / LEA";
    } else if (cat == "dom_env") {
      return "Domestic Envmt";
    } else if (cat == "diplo_econ") {
      return "Diplo & Eco";
    } else if (cat == "India Corner") {
      return "Ind Corner";
    } else if (cat == "X-Hairs") {
      return "X-Hair";
    } else if (cat == "is_tsm") {
      return "IS / Tsm";
    } else {
      return "Cat is not found";
    }
  }

  tranformXUpCatName(cat: string): string {
    if (cat == "international_env") {
      return "IS";
    } else if (cat == "diplo") {
      return "Diplo";
    } else if (cat == "pak_corner") {
      return "Pak & Ind Corner";
    } else if (cat == "india_corner") {
      return "Ind Corner";
    } else if (cat == "x_hair") {
      return "X-Hair";
    } else {
      return "Cat is not found";
    }
  }

  getWeather(region) {
    this.api.getWeather(region).subscribe(
      (data: any) => {
        let w = data?.data;

        if (!w || !Object.entries(w).length) {
          return;
        }

        let weekly_report = w?.days?.map((x) => {
          let date = new Date(x.datetime);
          let day = date?.toDateString()?.split(" ")?.[0];
          return {
            day: day,
            icon: "/assets/weather-icons/colorfull/" + x.icon + ".png",
            text: x.description,
            maxtemp_c: ((x.tempmax - 32) * (5 / 9)).toFixed(1),
            maxtemp_f: x.tempmax.toFixed(1),
            mintemp_c: ((x.tempmin - 32) * (5 / 9)).toFixed(1),
            mintemp_f: x.tempmin.toFixed(1),
            temp_c: ((x.temp - 32) * (5 / 9)).toFixed(1),
            temp_f: x.temp.toFixed(1),
            wind_kph: x.windspeed,
            humidity: x.humidity,
            last_updated: date?.toLocaleTimeString("en", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            city: w.address,
            country:
              region == "east_corner"
                ? "India"
                : region == "west_corner"
                ? "Afghanistan"
                : "Pakistan",
            key: region,
          };
        });

        this.weathers = weekly_report;
      },
      (error) => {
        console.log(error, "getWeather error");
      }
    );
  }
  moveNews(id, cat, sub_cat) {
    console.log({ news_id: id, catagory: cat });
    this.api.moveNews(cat, sub_cat, this.origin, id).subscribe((data: any) => {
      if (data.message) {
        this.toastr.success("Catagory updated Successfully");
      }
    });
  }


  getColumns(n) {
    return Math.ceil(n / 2);
  }

  keyword = {
    news: "",
    tweet: "",
    podcast: "",
    editorial: "",
    report: "",
  };
  Dates = {
    news: "latest",
    tweet: "latest",
    podcast: "latest",
    editorial: "latest",
    report: "latest",
  };
  trending_flag = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
  };
  loader_flag = {
    news: false,
    tweet: false,
    podcast: false,
    editorial: false,
    report: false,
  };
  topKeywordsList = [];
  getTopKeywords() {
    this.api.getTopKeywords(this.origin).subscribe(
      (data: any) => {
        var res: any = data?.trending_keywords;
        if (res && res.length) {
          for (let i = 0; i < res.slice(0, 8).length; i++) {
            this.topKeywordsList.push(res[i][0]);
          }
        }
      },
      (error) => {
        // this.ngxService.stop();
      }
    );
  }

  getFlashNews() {
    this.api.getFlashNews(this.origin).subscribe(
      (data: any) => {
        var res: any = data?.data;
        if (res && res.length) {
          res.forEach((element, i) => {
            let keywords_ = element?._source?.data?.keywords_hits;
            let desc_ = element?._source?.data?.description;
            let title_ = element?._source?.data?.title;
            let newsFormate = {
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
            if (element?._source?.data?.thumbnail) {
              this.flashNewsList.push(newsFormate);
            }
          });
        }
      },
      (error) => {
        // this.ngxService.stop();
      }
    );
  }

  // endpage = {
  //   mil: false,
  //   intl: false,
  //   iiojk: false,
  //   domestic: false,
  // }
  // lazy_loader = {
  //   mil: false,
  //   intl: false,
  //   iiojk: false,
  //   domestic: false,
  // };

  lazy_loader: AfghanCatergoriesLoader = {
    // "Internal Envmt": false,
    // "Diplo Overtures": false,
    // "Pakistan Corner": false,
    // "India Corner": false,
    // "X-Hairs": false,
    dom_env: false,
    diplo_econ: false,
    mil: false,
    is_tsm: false,
  };

  page_number: AfghanCategoriesPage = {
    // "Internal Envmt": 1,
    // "Diplo Overtures": 1,
    // "Pakistan Corner": 1,
    // "India Corner": 1,
    // "X-Hairs": 1,
    dom_env: 1,
    diplo_econ: 1,
    mil: 1,
    is_tsm: 1,
  };
  // endpage_ = {
  //   mil: false,
  //   intl: false,
  //   iiojk: false,
  //   domestic: false,
  // }
  lazy_loader_: AfghanCatergoriesLoader = {
    // "Internal Envmt": false,
    // "Diplo Overtures": false,
    // "Pakistan Corner": false,
    // "India Corner": false,
    // "X-Hairs": false,
    dom_env: false,
    diplo_econ: false,
    mil: false,
    is_tsm: false,
  };

  lazy_loader_temp: AfghanCatergoriesLoader = {
    // "Internal Envmt": false,
    // "Diplo Overtures": false,
    // "Pakistan Corner": false,
    // "India Corner": false,
    // "X-Hairs": false,
    dom_env: false,
    diplo_econ: false,
    mil: false,
    is_tsm: false,
  };
  page_number_: AfghanCategoriesPage = {
    // "Internal Envmt": 1,
    // "Diplo Overtures": 1,
    // "Pakistan Corner": 1,
    // "India Corner": 1,
    // "X-Hairs": 1,
    dom_env: 1,
    diplo_econ: 1,
    mil: 1,
    is_tsm: 1,
  };
  // endpage_p = {
  //   mil: false,
  //   intl: false,
  //   iiojk: false,
  //   domestic: false,
  // }
  lazy_loader_p: AfghanCatergoriesLoader_p = {
    "Internal Envmt": false,
    "Diplo Overtures": false,
    "Pakistan Corner": false,
    "India Corner": false,
    "X-Hairs": false,
    // dom_env: false,
    // diplo_econ: false,
    // mil: false,
    // is_tsm: false,
  };
  page_number_p: AfghanCategoriesPage_p = {
    "Internal Envmt": 1,
    "Diplo Overtures": 1,
    "Pakistan Corner": 1,
    "India Corner": 1,
    "X-Hairs": 1,
    // dom_env: 1,
    // diplo_econ: 1,
    // mil: 1,
    // is_tsm: 1,
  };

  getNews(context = "all") {
    let cats_;
    console.log('ggg ',context);
    if (context === "Pakistan Corner") {
      cats_ = ["Pakistan Corner", "India Corner"];
    } else {
      cats_ = this.sub_cats[context]?.join(",");
    }
    if (context == "all") {
      this.api.NewsList_explore["diplo_econ"] = [];
      this.api.NewsList_explore["mil"] = [];
      this.api.NewsList_explore["is_tsm"] = [];
      this.api.NewsList_explore["dom_env"] = [];

      this.lazy_loader = {
        diplo_econ: false,
        mil: false,
        is_tsm: false,
        dom_env: false,
        // "X-Hairs": false,
      };
      // this.endpage = {
      //   mil: false,
      //   intl: false,
      //   iiojk: false,
      //   domestic: false,
      // }
      this.page_number = {
        diplo_econ: 1,
        mil: 1,
        is_tsm: 1,
        dom_env: 1,
        // "X-Hairs": 1,
      };
      this.loader_flag.news = false;
    } else {
    }
    this.api
      .filterNewsandTweets(
        this.origin,
        "news",
        this.Dates["news"],
        this.keyword["news"],
        this.trending_flag["news"],
        context == "all" || context == "Pakistan Corner" ? cats_ : context,
        context != "all" ? this.page_number[context] : 1
      )
      .subscribe({
        next: (data: any) => {
          var res: any = data?.data;

          this.loader_flag.news = true;
          this.lazy_loader = {
            // "Internal Envmt": true,
            // "Diplo Overtures": true,
            // "Pakistan Corner": true,
            // "India Corner": true,
            // "X-Hairs": true,
            diplo_econ: false,
            mil: false,
            is_tsm: false,
            dom_env: false,
          };
          context != "all" && (this.lazy_loader[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach((element) => {
              let keywords_ = element?._source?.data?.keywords_hits;
              let desc_ = element?._source?.data?.description;
              let title_ = element?._source?.data?.title;
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
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
              // For merging India Corner into Pakistan Corner
              key = key === "India Corner" ? "Pakistan Corner" : key;
              console.log('dushdhush ', this.api.NewsList_explore)
              this.api.NewsList_explore[key]?.push(newsFormate);
            });
          });
        },
        complete: () => {
          console.log("apilist", this.api.NewsList_explore);
          this.api.NewsList_explore["Pakistan Corner"].sort((a, b) => {
            // Convert published_date to Date objects for both items
            const dateA = new Date(a.published_date).getTime();
            const dateB = new Date(b.published_date).getTime();

            // Compare timestamps, latest dates come first
            return dateB - dateA;
          });
          this.loader_flag.news = false;

          this.lazy_loader = {
            // "Internal Envmt": false,
            // "Diplo Overtures": false,
            // "Pakistan Corner": false,
            // "India Corner": false,
            // "X-Hairs": false,
            diplo_econ: false,
            mil: false,
            is_tsm: false,
            dom_env: false,
          };

          // if( context==='all'){

          //   this.api.NewsList_explore["Pakistan Corner"].push(
          //     ...this.api.NewsList_explore["India Corner"]
          //   );
          // }else if(context==="Pakistan Corner"){
          //   console.log('afg indCorner ',this.indCorner)
          //   this.api.NewsList_explore["Pakistan Corner"].push(...this.indCorner)
          // }
        },
      });
  }

  getReportNews() {
    for (const key of Object.keys(this.NewsList_report)) {
      this.NewsList_report[key] = [];
    }
    //   this.NewsList_report["mil"] = [];
    // this.NewsList_report["intl"] = [];
    // this.NewsList_report["iiojk"] = [];
    // this.NewsList_report["domestic"] = [];

    this.loader_flag.report = true;

    // this.ngxService.start();
    this.api
      .filterNewsandTweets(
        this.origin,
        "news",
        this.Dates["report"],
        this.keyword["report"],
        false,
        Object.keys(this.NewsList_report).join(","),
        1
      )
      .subscribe({
        next: (data: any) => {
          var res: any = data?.data;
          this.loader_flag.report = false;
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach((element) => {
              let keywords_ = element?._source?.data?.keywords_hits;
              let desc_ = element?._source?.data?.description;
              let title_ = element?._source?.data?.title;
              let newsFormate = {
                id: element._id,
                source: element._source.source_news,
                title: this.api.highlightWords(title_, keywords_),
                report_title: title_,
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
              let resolved_key =
                key == "army"
                  ? "mil"
                  : key == "international"
                  ? "intl"
                  : key == "kashmir"
                  ? "iiojk"
                  : "domestic";

              this.NewsList_report[key].push({
                data: newsFormate,
                flag: true,
              });
            });
          });
          // this.ngxService.stop();
        },
        error: (error) => {
          // this.ngxService.stop();
        },

        complete: () => {
          console.log(this.NewsList_report["X-Hairs"]);
        },
      });
  }

  getReportTweets() {
    for (const key of Object.keys(this.NewsList_report)) {
      this.NewsList_report[key] = [];
    }
    // this.tweetList_report["mil"] = [];
    // this.tweetList_report["intl"] = [];
    // this.tweetList_report["iiojk"] = [];
    // this.tweetList_report["domestic"] = [];
    this.loader_flag.report = true;

    this.api
      .filterNewsandTweets(
        this.origin,
        "tweet",
        this.Dates["report"],
        this.keyword["report"],
        this.trending_flag["report"],
        Object.keys(this.NewsList_report).join(","),
        1
      )
      .subscribe({
        next: (data: any) => {
          this.loader_flag.report = false;
          var res: any = data?.data;
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach((element) => {
              let desc_ = element.text;
              let keywords_ = element.exist_keywords;

              let newsFormate = {
                id: element._id,
                name: element.user.name,
                screen_name: element.user.screen_name,
                profile_image_url: element.user.profile_image_url,
                description: this.api.highlightWords(desc_, keywords_),
                report_desc: desc_,
                created_at: this.api.formatDate(element.created_at),
                keywords: element.exist_keywords,
                id_str: element.id_str,
                cat_hits: element.cat_hits,
                tweet_image: element.tweet_image,
              };

              this.tweetList_report[key].push({
                data: newsFormate,
                flag: false,
              });
            });
          });

          // this.is_lazy_loader_tweets[origin] = false
        },
        error: (error) => {
          // this.is_lazy_loader_tweets[origin] = false
        },

        complete: () => {
          console.log(this.NewsList_report["X-Hairs"]);
        },
      });
  }
  // Modifying this temporarily untill we get data from west
  // getTweets(context = "all") {
  //   let cats_ = this.sub_cats[context]?.join(",");
  //   if (context == "all") {
  //     this.api.tweetList_explore["Internal Envmt"] = [];
  //     this.api.tweetList_explore["Diplo Overtures"] = [];
  //     this.api.tweetList_explore["Pakistan Corner"] = [];
  //     this.api.tweetList_explore["India Corner"] = [];
  //     this.api.tweetList_explore["X-Hairs"] = [];
  //     this.lazy_loader_ = {
  //       "Internal Envmt": false,
  //       "Diplo Overtures": false,
  //       "Pakistan Corner": false,
  //       "India Corner": false,
  //       "X-Hairs": false,
  //     };
  //     this.page_number_ = {
  //       "Internal Envmt": 1,
  //       "Diplo Overtures": 1,
  //       "Pakistan Corner": 1,
  //       "India Corner": 1,
  //       "X-Hairs": 1,
  //     };
  //     this.loader_flag.tweet = false;
  //   } else {
  //   }
  //   this.api
  //     .filterNewsandTweets(
  //       this.origin,
  //       "tweet",
  //       this.Dates["tweet"],
  //       this.keyword["tweet"],
  //       this.trending_flag["tweet"],
  //       cats_,
  //       context != "all" ? this.page_number_[context] : 1
  //     )
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log;
  //         this.loader_flag.tweet = true;
  //         var res: any = data?.data;
  //         context != "all" && (this.lazy_loader_[context] = false);
  //         if (
  //           !res ||
  //           !Object.entries(res).length ||
  //           !Object.values(res)?.find((x: any) => x.length)
  //         ) {
  //           return;
  //         }

  //         let keys = Object.keys(res);
  //         let values = Object.values(res);
  //         console.log(keys);
  //         keys.forEach((key, i) => {
  //           let news_: any = values[i];
  //           news_.forEach((element) => {
  //             let desc_ = element.text;
  //             let keywords_ = element.exist_keywords;

  //             let newsFormate = {
  //               id: element._id,
  //               name: element.user.name,
  //               screen_name: element.user.screen_name,
  //               profile_image_url: element.user.profile_image_url,
  //               description: this.api.highlightWords(desc_, keywords_),
  //               report_desc: desc_,
  //               created_at: this.api.formatDate(element.created_at),
  //               keywords: element.exist_keywords,
  //               id_str: element.id_str,
  //               cat_hits: element.cat_hits,
  //               tweet_image: element.tweet_image,
  //             };

  //             this.api.tweetList_explore[key]?.push(newsFormate);
  //           });
  //         });

  //       },

  //       error: (error) => {
  //       },

  //       complete: () => {
  //         console.log(this.api.tweetList_explore["Pakistan Corner"]);
  //       },
  //     });
  // }

  // checkScrolled(event, context, type) {
  //   if (type == "news") {
  //     if (
  //       this.endpage[context] ||
  //       this.lazy_loader[context] ||
  //       !this.api.NewsList_explore[context].length
  //     )
  //       return;
  //   } else if (type == "tweet") {
  //     if (
  //       this.endpage_[context] ||
  //       this.lazy_loader_[context] ||
  //       !this.api.tweetList_explore[context].length
  //     )
  //       return;
  //   } else {
  //     if (
  //       this.endpage_p[context] ||
  //       this.lazy_loader_p[context] ||
  //       !this.api.podcastList_explore[context].length
  //     )
  //       return;
  //   }
  //   let { target } = event;
  //   let scroll_offset = 20;
  //   var isFullyScrolled =
  //     target.scrollTop + target.clientHeight >=
  //     target.scrollHeight - scroll_offset;
  //   if (isFullyScrolled) {
  //     this.loadMore(context, type);
  //   }
  // }
  getTweets(context = "all") {
    let cats_;
    if (context === "pak_corner") {
      cats_ = ["pak_corner", "india_corner"];
    }
    if (context == "all") {
      // this.api.tweetList_explore["Internal Envmt"] = [];
      // this.api.tweetList_explore["Diplo Overtures"] = [];
      // this.api.tweetList_explore["Pakistan Corner"] = [];
      // this.api.tweetList_explore["India Corner"] = [];
      // this.api.tweetList_explore["X-Hairs"] = [];
      cats_ = this.sub_cats_temp[context]?.join(",");
      this.sub_cats_temp["all"].forEach((cat: string) => {
        if (cat === "x_hair" || cat === "pak_corner" || cat === "diplo" || cat === "international_env") return; // Skip resetting separately polled categories
        this.sub_cats_temp[cat] = [];
        this.api.tweetList_explore[cat] = [];
        this.sub_cat_loading[cat] = true;
      });

      // this.lazy_loader_ = {
      //   "Internal Envmt": false,
      //   "Diplo Overtures": false,
      //   "Pakistan Corner": false,
      //   "India Corner": false,
      //   "X-Hairs": false,
      // };
      // this.lazy_loader_ = {
      //   "x_hair": false,
      //   "pak_corner": false,
      //   "international_env": false,
      //   "india_corner": false,
      //   "diplo": false,
      // };
      // this.page_number_ = {
      //   "Internal Envmt": 1,
      //   "Diplo Overtures": 1,
      //   "Pakistan Corner": 1,
      //   "India Corner": 1,
      //   "X-Hairs": 1,
      // };
      this.loader_flag.tweet = true;
    } else {
      this.sub_cat_loading[context] = true;
    }
    this.api
      .filterNewsandTweets(
        this.origin,
        "tweet",
        this.Dates["tweet"],
        this.keyword["tweet"],
        this.trending_flag["tweet"],
        cats_ ?? context,
        context != "all" ? this.sub_cat_page_number[context] : 1
      )
      .subscribe({
        next: (data: any) => {
          console.log("afg tweet data ", data);
          this.loader_flag.tweet = true;
          var res: any = data?.data;
          context != "all" && (this.lazy_loader_[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);
          console.log(keys);
          keys.forEach((key, i) => {
            let news_: any = values[i];
            news_.forEach((element) => {
              let desc_ = element.text;
              let keywords_ = element.exist_keywords;

              let newsFormate = {
                id: element._id,
                name: element.user.name,
                screen_name: element.user.screen_name,
                profile_image_url: element.user.profile_image_url,
                description: this.api.highlightWords(desc_, keywords_),
                report_desc: desc_,
                created_at: this.api.formatDate(element.created_at),
                keywords: element.exist_keywords,
                id_str: element.id_str,
                cat_hits: element.cat_hits,
                tweet_image: element.tweet_image,
              };
              // For merging India Corner into Pakistan Corner
              key = key === "india_corner" ? "pak_corner" : key;
              this.api.tweetList_explore[key]?.push(newsFormate);
              this.sub_cats_temp[key]?.push(newsFormate);
            });
          });
        },

        error: (error) => {},

        complete: () => {
          // console.log(this.api.tweetList_explore["Pakistan Corner"]);

          // Resetting the values;
          if (context == "all") {
            this.sub_cats_temp["all"].forEach((cat: string) => {
              if (cat !== "x_hair" && cat !== "pak_corner" && cat !== "diplo" && cat !== "international_env") {
                this.sub_cat_loading[cat] = false;
              }
            });
          } else {
            if (context !== "x_hair" && context !== "pak_corner" && context !== "diplo" && context !== "international_env") {
              this.sub_cat_loading[context] = false;
            }
          }

          // if(context==="all"){
          //   this.api.tweetList_explore["pak_corner"].push(
          //     ...this.api.tweetList_explore["india_corner"]
          //   );

          // }else if(context==='pak_corner'){
          //   this.api.tweetList_explore["pak_corner"].push(
          //     ...this.indCornerXup
          //   );
          // }
        },
      });
  }
  loadMore(context, type) {
    console.log("loadmore context ", context);
    console.log("loadmore type ", type);
    if (type == "news") {
      this.lazy_loader[context] = true;
      this.page_number[context] += 1;
      this.getNews(context);
    } else if (type == "tweet") {
      if (context === "x_hair") {
        this.fetchOlderAfgXHair();
      } else if (context === "pak_corner") {
        this.fetchOlderAfgPakCorner();
      } else if (context === "diplo") {
        this.fetchOlderAfgDiplo();
      } else if (context === "international_env") {
        this.fetchOlderAfgIS();
      } else {
        // this.lazy_loader_[context] = true;
        // this.page_number_[context] += 1;
        this.sub_cat_page_number[context] += 1;
        this.getTweets(context);
      }
    } else {
      this.lazy_loader_p[context] = true;
      this.page_number_p[context] += 1;
      this.getProdCasts(context);
    }
  }

  prodList = [];
  pageEnds = {
    podcats: false,
  };
  @ViewChild("editorial_scroller2", { static: false })
  scrollerElement: ElementRef;

  getProdCasts(context = "all") {
    let cats_ = this.sub_cats_p[context]?.join(",");
    let pageNum = 0;
    if (context == "all") {
      this.api.podcastList_explore["Internal Envmt"] = [];
      this.api.podcastList_explore["Diplo Overtures"] = [];
      this.api.podcastList_explore["Pakistan Corner"] = [];
      this.api.podcastList_explore["India Corner"] = [];
      this.api.podcastList_explore["x-hairs"] = [];
      this.prodList = [];

      this.lazy_loader_p = {
        "Internal Envmt": false,
        "Diplo Overtures": false,
        "Pakistan Corner": false,
        "India Corner": false,
        "X-Hairs": false,
        // diplo_econ: false,
        // mil: false,
        // is_tsm: false,
        // dom_env: false,
      };
      // this.endpage_p = {
      //   mil: false,
      //   intl: false,
      //   iiojk: false,
      //   domestic: false,
      // }
      this.page_number_p = {
        "Internal Envmt": 1,
        "Diplo Overtures": 1,
        "Pakistan Corner": 1,
        "India Corner": 1,
        "X-Hairs": 1,
        //  "diplo_econ": 1,
        // "mil": 1,
        // "is_tsm": 1,
        // "dom_env": 1,
      };
      this.loader_flag.podcast = false;
    } else {
      cats_ = this.sub_cats_p["all"]?.join(",");
      for (const [key, value] of Object.entries(this.page_number_p)) {
        this.page_number_p[key] = (value as number) + 1;
      }

      pageNum = this.page_number_p["Diplo Overtures"];
    }
    // cats_ = "army,international,kashmir,domestic";
    this.api
      .getProdCasts(
        this.Dates["podcast"],
        "west_corner",
        this.keyword["podcast"],
        context != "all" ? pageNum : 1,
        cats_
      )
      .subscribe({
        next: (data: any) => {
          var res: any = data?.data;
          this.loader_flag.podcast = true;
          context != "all" && (this.lazy_loader_p[context] = false);
          if (
            !res ||
            !Object.entries(res).length ||
            !Object.values(res)?.find((x: any) => x.length)
          ) {
            this.scrollerElement.nativeElement.parentElement.classList.add(
              "hide_right"
            );
            // context != "all" && (this.endpage_p[context] = true);
            return;
          }

          let keys = Object.keys(res);
          let values = Object.values(res);

          keys.forEach((key, i) => {
            var yt_: any = values[i];

            yt_.forEach((element) => {
              let newsFormate = {
                id: element._id,
                link: element._source.link,
                title: element._source.title,
                published_date: this.api.formatDate(
                  element._source.published_date
                ),
                channel_handle: element._source.channel_handle,
                video_id: element._source.video_id,
                cat_hits: element._source?.data?.cat_hits,
              };

              // this.api.podcastList_explore[key]?.push(newsFormate);
              this.prodList.push(newsFormate);
            });
          });
          // this.is_lazy_loader_tweets[origin] = false
        },

        error: (error) => {
          this.loader_flag.podcast = false;

          // this.is_lazy_loader_tweets[origin] = false
        },

        complete: () => {
          const data = this.prodList;
          if (data) {
            // let newData = [];
            // for (const value of Object.values(data)) {
            //   const arr = value as any[];
            //   if (arr.length) {
            //     newData.push(...arr);
            //   }
            // }
            // if (context != "all") {
            //   console.log("THis happens");
            //   this.prodList.push(...newData);
            // } else {
            //   console.log("This happens");
            //   this.prodList = newData;
            // }

            // Filtering process of getting unique videos;
            let videosId: number[] = [];
            this.api.podcastList_explore = this.prodList.filter((podcast) => {
              if (!videosId.includes(podcast["video_id"])) {
                videosId.push(podcast["video_id"]);
                return podcast;
              }
            });
            this.loader_flag.podcast = false;

            console.log(this.api.podcastList_explore);
          }
        },
      });
  }
  trendingHashtagList = [];
  trendingwordsList = [];
  getTrendingHashtag() {
    this.api.getTrendingHashtag(this.origin).subscribe(
      (data: any) => {
        if (!data?.hashtag?.length && !data?.keywords?.length) {
          return;
        }
        this.trendingHashtagList = data.hashtag;
        this.trendingwordsList = data.keywords;
      },
      (error) => {
        console.log("getTimes() error:", error);
      }
    );
  }
  flashNewsList = [];

  editorialList: EditorialNewsFormat[] = [];

  getEditorials() {
    this.editorialList = [];

    this.loader_flag.editorial = false;
    this.api
      .getEditorials(
        this.origin,
        this.Dates["editorial"],
        this.keyword["editorial"],
        this.trending_flag["editorial"]
      )
      .subscribe(
        (data: any) => {
          var res: any = data?.data;
          this.loader_flag.editorial = true;
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
            setTimeout(() => {
              this.scrollEdges(($("#editorial_scroller") as any)[0]);
            }, 1000);

            console.log("editorial", this.editorialList);
          }
        },
        (error) => {}
      );
  }

  readMore(linkurl, id, context = "") {
    if (!id && !context) {
      return;
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.origin, id])
      )
    );
    window.open(url);
  }
  explore(cat, country = "") {
    // const url = this.location.prepareExternalUrl(
    //   this.router.serializeUrl(
    //     !country?
    //     this.router.createUrlTree(["/west_corner", cat])
    //     :
    //     this.router.createUrlTree(["explore",cat,country])
    //   )
    // );
    // window.open(url);

    alert(country);
    this.categoryChange.emit(country);
  }
  isScrolling: any = false;
  scrollX(el, by) {
    if (!el) return;
    if (this.isScrolling) return;
    this.isScrolling = true;
    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
    el?.scrollBy({ left: by, behavior: "smooth" });
  }

  scrollEdges(el) {
    el.parentElement.classList.remove("hide_right");
    el.parentElement.classList.remove("hide_left");
    if (el.scrollLeft <= 0) {
      el.parentElement.classList.add("hide_left");
    }

    if (this.pageEnds["podcats"]) {
      el.parentElement.classList.add("hide_right");
      return;
    }

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 0.5) {
      // Check if the loading is false;
      if (!this.loader_flag.podcast) {
        this.getProdCasts("X-Hairs");
      }
    }
  }

  filter_report_date(context) {
    if (!this.multiselect_date[context]) {
      return;
    }
    var now = this.multiselect_date[context];

    this.Dates[context] =
      now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate();

    if (context == "news") {
      this.getNews();
    }
    if (context == "tweet") {
      this.getTweets();
    }
    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "podcast") {
      this.getProdCasts();
    }
  }

 
  // newsDetails(id: NewsFormat["id"], cat_hits: string) {
  //   console.log("tango cat_hits afghanistan ", cat_hits);
  //   this.router.navigate(["/news-details", this.origin, id], {
  //     state: { cat_hits },
  //   });
  // }
     newsDetails(id: string, cat_hits: string) {
 
  window.open(`${window.location.origin}/#/news-details/${this.origin}/${id}?cat_hits=${cat_hits}`, '_blank');

}
  changeFilter(event) {
    let context = event.context;
    let value = event.value;

    this.Dates[context] = value;
    this.multiselect_date = [];
    if (context == "report") {
      this.getReportNews();
      this.getReportTweets();
    }
    if (context == "news") {
      this.getNews();
    }
    if (context == "tweet") {
      this.getTweets();
    }
    if (context == "editorial") {
      this.getEditorials();
    }
    if (context == "podcast") {
      this.getProdCasts();
    }
  }

  gotoLink(link, direct: any = "") {
    if (!direct) {
      link = link.includes("http") ? link : "https://" + link;
    } else {
      typeof direct == "object" && direct.stopPropagation();
    }
    window.open(link);
  }

  gotoHome() {
    this.router.navigate([""]);
  }

  includesText(list, text) {
    return JSON.stringify(list).includes(`"cat_hits":"${text}"`);
  }

  all_channels = [];
  selected_priorities = [];
  priority_flag = false;

  fetchPriorities(origin) {
    this.api.getProrities(origin).subscribe(
      (data: any) => {
        if (!data || !Object.entries(data).length) return;
        if (data.priority) {
          this.selected_priorities = data.priority;
        }
      },
      (error) => {
        console.log(error, "priorities-error");
      }
    );
  }

  getChannels(origin) {
    this.api.getChannels(origin).subscribe(
      (data: any) => {
        if (!data || !Object.entries(data).length) return;
        if (data.priority) {
          this.all_channels = data.priority;
        }
      },
      (error) => {
        console.log(error, "channels-error");
      }
    );
  }

  addPriority(value) {
    if (this.selected_priorities.includes(value)) {
      this.toastr.warning("already exists in priority list!");
      return;
    }
    if (this.selected_priorities.length > 4) {
      this.toastr.warning("Priority Stack is full!");
      return;
    }
    this.selected_priorities.push(value);
    this.priority_flag = true;
  }

  removePriority(value) {
    this.selected_priorities = this.selected_priorities.filter(
      (x) => x != value
    );
    this.priority_flag = true;
  }

  drop(event) {
    moveItemInArray(
      this.selected_priorities,
      event.previousIndex,
      event.currentIndex
    );
    this.priority_flag = true;
  }

  applyFilter(event) {
    let form_body = new URLSearchParams();
    form_body.append(
      "priority_list",
      this.selected_priorities?.map((x) => x.channel)?.join(",")
    );
    form_body.append(
      "priority_name",
      this.selected_priorities?.map((x) => x.name)?.join(",")
    );
    form_body.append("user_id", this.api.uid + "");
    form_body.append("category", this.origin);

    fetch(this.api.ip + "update_priority", {
      method: "POST",
      body: form_body,
    })
      .then((y) => y.json())
      .then((data: any) => {
        console.log("data: ", data);
        if (data?.message?.includes("success")) {
          this.toastr.success("Priority list updated successfully!");
          this.fetchPriorities(this.origin);
        } else {
          this.toastr.error("something went wrong! try again!");
        }
      });
  }
  addToList(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  zoomRedirect(linkurl, keyword) {
    if (!keyword) {
      return;
    }
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree([linkurl, this.origin, keyword])
      )
    );
    window.open(url);
  }
  _link = "";
  rep_flag = "";
  anychange = false;
  printReport() {
    if (!this.anychange && this.rep_flag) {
      window.open(this._link);
      return;
    }
    var NewsReportData: any = {};
    var TweetReportData: any = {};
    var originx = this.origin.toUpperCase().replace("_", " ");
    for (const key of Object.keys(this.NewsList_report)) {
      var data = this.NewsList_report[key].filter((x) => {
        return x.flag;
      });
      NewsReportData[key] = data;
    }
    for (const key of Object.keys(this.tweetList_report)) {
      var data = this.tweetList_report[key].filter((x) => {
        return x.flag;
      });
      TweetReportData[key] = data;
    }
    this.rep_flag = "pending";
    console.log({
      corner: originx,
      news: NewsReportData,
      tweets: TweetReportData,
    });
    let ws_ = new WebSocket(global_pointer.news_addr_ws);
    var key_json = {};

    key_json = {
      corner: originx,
      news: NewsReportData,
      tweets: TweetReportData,
    };
    ws_.onopen = function () {
      ws_.send(JSON.stringify(key_json));
    };
    ws_.onmessage = (evt) => {
      let b_ = JSON.parse(evt?.data);
      if (b_?.path) {
        this._link = (this.api.ip + b_.path).replace("/api", "");
        this.rep_flag = "done";
        this.anychange = false;
        window.open(this._link);
      }
    };
  }
  customReport() {
    this.anychange = true;
    this.rep_flag = "";
  }

  getheadingBarClass(cat: string): string {
    switch (cat) {
      case "dom_env":
        return "headingBar headingBar-internal";
      case "diplo_econ":
        return "headingBar headingBar-diplo";
      case "Pakistan Corner":
        return "headingBar headingBar-pakistan";
      case "mil":
        return "headingBar headingBar-india";
      case "is_tsm":
        return "headingBar headingBar-xhairs";
    }
    return "";
  }
  getImageSource(cat: string): string {
    switch (cat) {
      case "dom_env":
        return "../../../../../assets/news-img/afg.png";
      case "diplo_econ":
        return "../../../../../assets/news-img/diplo-icon.png";
      case "Pakistan Corner":
        return "../../../../../assets/images/pakIndIcon.png";
      case "mil":
        return "../../../../../assets/news-img/afg.png";
      case "is_tsm":
        return "../../../../../assets/news-img/xhair.png";
    }
    return "";
  }

  getBannerImageSource(cat: string): string {
    switch (cat) {
      case "Internal Envmt":
        return "../../../../../assets/images/eastMil.png";
      case "Diplo Overtures":
        return "../../../../../assets/images/govt.png";
      case "Pakistan Corner":
        return "../../../../../assets/images/pakIndbanner.png";
      case "India Corner":
        return "../../../../../assets/images/domestic.png";
      case "X-Hairs":
        return "../../../../../assets/images/iiojk.png";
    }
    return "";
  }
  getXUpImageSource(cat: string): string {
    switch (cat) {
      case "international_env":
        return "../../../../../assets/news-img/afg.png";
      case "diplo":
        return "../../../../../assets/news-img/diplo-icon.png";
      case "pak_corner":
        return "../../../../../assets/images/pakIndIcon.png";
      case "india_corner":
        return "../../../../../assets/news-img/ind.png";
      case "x_hair":
        return "../../../../../assets/news-img/xhair.png";
    }
    return "";
  }

  getXUpBannerImageSource(cat: string): string {
    switch (cat) {
      case "international_env":
        return "../../../../../assets/images/eastMil.png";
      case "diplo":
        return "../../../../../assets/images/govt.png";
      case "pak_corner":
        return "../../../../../assets/images/pakIndbanner.png";
      case "india_corner":
        return "../../../../../assets/images/domestic.png";
      case "x_hair":
        return "../../../../../assets/images/iiojk.png";
    }
    return "";
  }

  setStripColor(cat_hits) {
    switch (cat_hits) {
      case "Internal Envmt":
        return "linear-gradient(135deg, #570549, #CD2432)";

      case "Diplo Overtures":
        return "linear-gradient(135deg, #3574DB, #426DD6)";

      case "Pakistan Corner":
        return "linear-gradient(135deg, #003F18, #005816)";

      case "X-Hairs":
        return "linear-gradient(135deg, #144045, #071627)";
    }
  }
}
