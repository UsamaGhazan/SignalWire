import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NewsService } from "src/service/news.service";

@Component({
  selector: "app-news-layout",
  templateUrl: "./news-layout.component.html",
  styleUrls: ["./news-layout.component.css"],
})
export class NewsLayoutComponent implements OnInit {
  layout: any = true;
  constructor(public api: NewsService) {
    let url = window.location.hash.replace("#/", "");
    let [page, cat, value] = url.split("/");
    if (page) {
      let msg = {
        type: "page",
        page: page,
        category: cat,
        path: window.location.href,
      };
      value && page.includes("detail") && (msg["id"] = value);
      console.log("user logging", msg);
      let encoded = encodeURIComponent(JSON.stringify(msg));
      this.api.registerLog(encoded).subscribe();
    }
  }

  ngOnInit() {
    localStorage.setItem("layoutStatus", "osint");
  }
  parentWillTakeAction(message: any) {
    this.layout = message;
    console.log(message);
  }
}
