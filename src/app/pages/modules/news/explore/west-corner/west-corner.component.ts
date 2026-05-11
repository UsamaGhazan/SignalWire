import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/service/data.service";

@Component({
  selector: "app-west-corner",
  templateUrl: "./west-corner.component.html",
  styleUrls: ["./west-corner.component.css"],
})
export class WestCornerComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    public data: DataService
  ) {}
  origin: any = "west_corner";
  origin_country: any = "afghanistan";
  current_west_corner: number = 0;
  ngOnInit(): void {
    this.origin = this._Activatedroute.snapshot.paramMap.get("origin");
    this.origin_country =
      this._Activatedroute.snapshot.paramMap.get("origin_country");
  }

  onCategoryChange(newCategory: string) {
    this.origin_country = newCategory;
  }
}
