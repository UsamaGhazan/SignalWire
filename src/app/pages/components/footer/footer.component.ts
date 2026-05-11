import { AfterViewInit, Component, OnInit } from "@angular/core";
import { global_pointer } from "src/assets/js/global_config";
@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  year = "";
  system = "";
  constructor() {}

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString();
    this.system = global_pointer.system;
  }
  reloadPage() {
    window.scroll(0, 0);
  }
}
