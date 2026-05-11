import { APP_ID, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { global_pointer } from "../../src/assets/js/global_config";
import { async } from "rxjs";
import { Clipboard } from "@angular/cdk/clipboard";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class DataService {
  currentWestTab: number = 0;
  constructor(
    private http: HttpClient,
    private clipboard: Clipboard,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) {}

  getCurrentWestTab() {
    const westCornerStatus = localStorage.getItem("west_corner");

    // If the west corner status is in the local storage;
    if (westCornerStatus) {
      this.currentWestTab = parseInt(westCornerStatus);
    }
    return this.currentWestTab;
  }

  setCurrentWestTab(index: number) {
    console.log(index);
    localStorage.setItem("west_corner", `${index}`);
    this.currentWestTab = index;
  }
  //Public Ip
  ip: string = global_pointer.newsIp;

  loader(status) {
    if (status) {
      $("#g_spinner").removeClass("d-spinner");
    } else {
      $("#g_spinner").addClass("d-spinner");
    }
  }
  copytextFunc(text) {
    this.clipboard.copy(text);
    // alert("Copied the text: " + copyText.value);
  }
  async copyToClipboard(txt) {
    var body = window.document.body;
    var el = window.document.createElement("input");
    el.style.width = "0";
    el.style.height = "0";
    el.value = txt;
    el.focus();
    let flag = navigator.clipboard.writeText(el.value);
    if (flag) {
      this.toastr.success("copied to clipboard!");
    } else {
      this.toastr.error("failed to copy!");
    }
    el.remove();
  }
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  adjustCloud(data2) {
    var dataList = [];
    var max = data2[0].weight;
    if (data2.length > 60) {
      for (var i = 0; i < 60; i++) {
        var count = 0;
        var abc: any = data2[i].weight / max;
        count = parseInt(abc) * 100;

        // //console.log("Name: "+data2[i].name+" Weight: "+ count);

        var json = {};
        if (i == 0) {
          json = {
            name: data2[i].name,
            weight: 100,
          };
        } else if (count <= 40) {
          json = {
            name: data2[i].name,
            weight: count + 20,
          };
        } else if (count <= 60) {
          json = {
            name: data2[i].name,
            weight: count + 15,
          };
        } else if (count <= 80) {
          json = {
            name: data2[i].name,
            weight: count + 10,
          };
        } else if (count <= 90) {
          json = {
            name: data2[i].name,
            weight: count + 5,
          };
        } else if (count <= 95) {
          json = {
            name: data2[i].name,
            weight: count + 2,
          };
        } else {
          json = {
            name: data2[i].name,
            weight: count,
          };
        }
        // console.log(data3)
        dataList.push(json);
      }
    } else {
      for (var i = 0; i < data2.length; i++) {
        var count = 0;
        var abc: any = data2[i].weight / max;
        count = parseInt(abc) * 100;

        //console.log("Name: " + data2[i].name + " Weight: " + count);

        var json = {};
        if (i == 0) {
          json = {
            name: data2[i].name,
            weight: 100,
          };
        } else if (count <= 40) {
          json = {
            name: data2[i].name,
            weight: count + 20,
          };
        } else if (count <= 60) {
          json = {
            name: data2[i].name,
            weight: count + 15,
          };
        } else if (count <= 80) {
          json = {
            name: data2[i].name,
            weight: count + 10,
          };
        } else if (count <= 90) {
          json = {
            name: data2[i].name,
            weight: count + 5,
          };
        } else if (count <= 95) {
          json = {
            name: data2[i].name,
            weight: count + 2,
          };
        } else {
          json = {
            name: data2[i].name,
            weight: count,
          };
        }
        // console.log(data3)
        dataList.push(json);
      }
    }
    return dataList;
  }
  formatCount(value) {
    var COUNT_FORMATS = [
      {
        // 0 - 999
        letter: "",
        limit: 1e3,
      },
      {
        // 1,000 - 999,999
        letter: "K",
        limit: 1e6,
      },
      {
        // 1,000,000 - 999,999,999
        letter: "M",
        limit: 1e9,
      },
      {
        // 1,000,000,000 - 999,999,999,999
        letter: "B",
        limit: 1e12,
      },
      {
        // 1,000,000,000,000 - 999,999,999,999,999
        letter: "T",
        limit: 1e15,
      },
    ];
    if (value) {
      const format = COUNT_FORMATS.find((format) => value < format.limit);
      value = (1000 * value) / format.limit;
      value = Math.round(value * 10) / 10; // keep one decimal number, only if needed
      return value + format.letter;
    } else {
      return 0;
    }
  }
  gotoLink(url, event: any = "") {
    event && event.stopPropagation();
    window.open(url, "_blank");
  }
  parseString(str) {
    try {
      str = JSON.parse('"' + str + '"');
    } catch (error) {
      // do nothing
    }
    return str;
  }
  carouselBreakpoints = [
    {
      breakpoint: "1680px",
      numVisible: 12,
      numScroll: 12,
    },
    {
      breakpoint: "1440px",
      numVisible: 8,
      numScroll: 8,
    },
    {
      breakpoint: "1280px",
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: "1024px",
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: "992px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "768px",
      numVisible: 4,
      numScroll: 4,
    },
  ];
  navigate(id) {
    setTimeout(() => {
      let d = document.querySelector("#" + id);
      d?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }
}
