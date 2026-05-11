import { Component, Input, OnInit } from "@angular/core";
import * as Highcharts from "highcharts/highmaps";
import * as $ from "jquery";
import { NewsService } from "src/service/news.service";

@Component({
  selector: "app-news-map",
  templateUrl: "./news-map.component.html",
  styleUrls: ["./news-map.component.css"],
})
export class NewsMapComponent implements OnInit {
  tooltip: any = {
    location: "",
    count: 0,
  };
  baseMapPath = "https://code.highcharts.com/mapdata/";
  showDataLabels = true; // Switch for data labels enabled/disabled
  mapCount = 0;
  mapOptions = "";
  mapDesc = "World Map";
  mapType = "custom/world.js";
  mapKey = this.mapType.slice(0, -3);
  svgPath = this.baseMapPath + this.mapKey + ".svg";
  geojsonPath = this.baseMapPath + this.mapKey + ".geo.json";
  javascriptPath = this.baseMapPath + this.mapType;
  location_data: any = [];
  pin_news: any = [];
  map_points: any = [];
  density: any = {};

  map_chart: any = null;

  @Input() loading: any = true;
  @Input() locations: any = [];
  @Input() cat: any = "mil";
  @Input() corner: any = "east_corner";

  constructor(public api: NewsService) {}

  ngOnInit(): void {
    let domestic =
      this.corner == "east_corner"
        ? "countries/in/in-all.js"
        : this.corner == "internal_security"
        ? "countries/pk/pk-all.js"
        : "countries/af/af-all.js";
    // initializing members
    this.mapType =
      this.cat == "iiojk"
        ? "countries/in/in-all.js"
        : this.cat == "domestic"
        ? domestic
        : "custom/world.js";
    this.mapKey = this.mapType.slice(0, -3);
    this.svgPath = this.baseMapPath + this.mapKey + ".svg";
    this.geojsonPath = this.baseMapPath + this.mapKey + ".geo.json";
    this.javascriptPath = this.baseMapPath + this.mapType;

    this.genMap();
    let old_data = this.locations;
    setInterval((x) => {
      if (old_data != this.locations) {
        old_data = this.locations;
        this.genMap();
      }
    }, 1);
  }

  genMap() {
    // if (!this.locations?.length) return;
    this.density = {};
    // collecting map-pin-points
    this.map_points = [];
    this.locations.forEach((el) => {
      let x = el._source.data;
      let parsed_loc = JSON.parse(x.area_hits);
      parsed_loc.forEach((y, i) => {
        let formatted: any = this.formatNews(el);
        // dummy-template-data
        // start
        // start
        // if(formatted.country=='india') {
        //   y['country_code'] = 'IN'.toLowerCase()
        // }
        // if(y.city=='pakistan') {
        //   y['country_code'] = 'PK'.toLowerCase()
        // }
        // if(y.city=='egypt') {
        //   y['country_code'] = 'EG'.toLowerCase()
        // }
        // end
        // end

        if (y.country_code) {
          !this.density[y.country_code] && (this.density[y.country_code] = 0);
          this.density[y.country_code] += 1;
        }
        this.map_points.push({
          news: formatted,
          name: y.city,
          cc: y.country_code,
          lat: y.lat,
          lon: y.lng,
        });
      });
    });

    let values: any = Object.values(this.density);
    let max = Math.max.apply(null, values);
    this.mapReady(max);
  }

  // When the map is loaded or ready from cache...
  mapReady = (max) => {
    // @ts-ignore
    var mapGeoJSON = Highcharts_maps[this.mapType],
      data = [];
    // Show loading
    if (Highcharts.charts[0]) {
      Highcharts.charts[0].showLoading(
        '<i class="fa fa-spinner fa-spin fa-2x"></i>'
      );
    }
    // Generate non-random data for the map
    mapGeoJSON.features.forEach((feature, index) => {
      let density_ = 0;
      try {
        density_ = parseInt(
          this.density[feature.properties["hc-key"]?.toLowerCase()] || "0"
        );
      } catch (error) {
        //do nothing
      }
      let min_opacity = 0.3;
      let per = (density_ / max) * (100 - min_opacity * 100);
      let color =
        "rgba(242,58,58," + (per / 100 + min_opacity).toFixed(2) + ")";
      data.push({
        key: feature.properties["hc-key"],
        value: index,
        color: density_ ? color : "#fff",
      });
    });

    if (this.cat == "iiojk") {
      let ijk = mapGeoJSON.features.filter((x) => x.id == "IN.JK");
      data = ijk.map((x) => {
        return {
          key: x.properties["hc-key"],
          value: 1,
          color: "rgb(242,58,58)",
        };
      });
    }

    // Instantiate chart
    let id: any = "news_map_container";
    if (this.map_chart) {
      this.map_chart.destroy();
    }
    this.map_chart = Highcharts.mapChart(id, {
      // @ts-ignore
      chart: {
        type: "map",
        margin: 0,
        events: {
          load: (e: any) => {
            this.onChartLoaded(e);
          },
        },
      },
      title: {
        text: null,
      },
      xAxis: {
        type: "linear",
      },
      yAxis: {
        type: "linear",
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: "spacingBox",
          verticalAlign: "top",
        },
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        mappoint: {
          marker: {
            lineWidth: 3,
            lineColor: "#d2d2d2",
            symbol: "round",
            radius: 8,
          },
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        enabled: false,
        layout: "vertical",
        align: "left",
        verticalAlign: "bottom",
      },
      tooltip: {
        enabled: false,
      },
      series: [
        {
          data: data,
          mapData: mapGeoJSON,
          joinBy: ["hc-key", "key"],
          name: "Region",
          states: {
            hover: {
              // color: "#fe6a35",
              color: "#f4f4f4",
            },
            tooltip: false,
          },
          tooltip: {
            enabled: false,
            pointFormat: "",
            nodeFormat: "",
            footerFormat: "",
          },
          dataLabels: {
            enabled: this.showDataLabels,
            formatter: labelsFormatter,
          },
          point: {
            events: {
              click: (e: any) => {
                var key = e.point.name;
                //do something
              },
            },
          },
        },
        {
          type: "mapline",
          name: "Separators",
          data: Highcharts.geojson(mapGeoJSON, "mapline"),
          nullColor: "gray",
          showInLegend: false,
          enableMouseTracking: false,
        },
        {
          // Specify points using lat/lon
          type: "mappoint",
          name: "Cities",
          // color: Highcharts.color("#fe6a35").brighten(-0.3).get(),
          color: "rgb(242,58,58)",
          data: this.map_points,
          tooltip: {
            enabled: true,
            pointFormatter: (point) => {
              return (
                "city: <b>" +
                this.tooltip.location +
                "</b><br>news count: <b>" +
                this.tooltip.count +
                "</b>"
              );
            },
          },
          point: {
            events: {
              click: this.showPinPopup,
              mouseOver: (e: any) => {
                let news_ = this.map_points.filter(
                  (x) => x.lat == e.target.lat && x.lon == e.target.lon
                );
                this.tooltip.location = e.target.name;
                this.tooltip.count = news_.length;
              },
            },
          },
        },
      ],
    });
  };

  onChartLoaded = (e: any) => {
    // let map_chart = e.target;
    // if(this.cat == 'mil' || this.cat == 'intl') {
    //   let firstPoint = this.map_points?.[0]
    //   let cx = (map_chart.chartWidth*firstPoint.lat*2)/10 - 700
    //   let cy = (map_chart.chartHeight*firstPoint.lon*2)/10 + 500
    //   map_chart.mapView.center = [6100, 7100]
    //   let zoom_level = 0.3;
    //   map_chart.mapZoom(zoom_level)
    // }
  };

  onPanning() {
    console.log(this.map_chart, "map chart");
  }

  pin_context: any = "";
  showPinPopup = (e: any) => {
    console.log(e);
    this.api.pin_popup = true;
    var { name, lat, lon } = e.point;
    this.pin_context = name;
    this.pin_news = [];
    this.map_points.forEach((x) => {
      if (
        x.lat == lat &&
        x.lon == lon &&
        !JSON.stringify(this.pin_news).includes(x.news.id)
      ) {
        this.pin_news.push(x.news);
      }
    });
  };

  formatNews(element) {
    let hitkeywords = element._source.data.keywords_hits;
    let desx = element._source.data.description;
    let title_ = element._source.data.title;

    return {
      id: element._id,
      source: element._source.source_news,
      title: this.api.highlightWords(title_, hitkeywords),
      description: this.api.highlightWords(desx, hitkeywords),
      news_link: element._source.data.news_link,
      published_date: this.api.formatDate(element._source.data.published_date),
      country: element._source.data.country,
      keywords: hitkeywords,
      image: element._source.data.thumbnail || "",
    };
  }
}

function labelsFormatter() {
  // @ts-ignore
  // return `<small style="color: #a1a1a1;">${
  //   this.point.properties && this.point.properties["name"]
  // }</small>`;
}
