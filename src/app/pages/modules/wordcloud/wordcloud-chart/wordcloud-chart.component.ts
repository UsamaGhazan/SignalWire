import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5wc from "@amcharts/amcharts5/wc";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { DataService } from 'src/service/data.service';

@Component({
  selector: 'app-wordcloud-chart',
  templateUrl: './wordcloud-chart.component.html',
  styleUrls: ['./wordcloud-chart.component.css']
})
export class WordcloudChartComponent implements OnInit {
  @Input() data;
  @Input() ID;
  @HostListener('click', ['$event']) onClick(event) {
    if(event.currentTarget?.firstChild?.className.includes("wordcloud")){
     this.service.copyToClipboard(event.currentTarget.innerText?.split(" ")[1]);
    }
    
    
 }
  constructor(private api: DataService, public service: DataService) { }
  series = null

  ngOnInit(): void {
    var interval_ = setInterval(() => {
      let el = document.querySelector('#'+this.ID+'chart')
      if(!this.series && (el?.clientWidth>0) && (el?.clientHeight>0)) {
        this.drawAmCloud(this.data)
        clearInterval(interval_)
      }
    }, 10);
  }


  drawAmCloud(data) {
  
    var root = am5.Root.new(this.ID+'chart');
    root._logo.dispose();

    if(!(root.dom.offsetHeight>0) && !(root.dom.offsetWidth>0)) {
    };

    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Add series
    // https://www.amcharts.com/docs/v5/charts/word-cloud/
    // var series = root.container.children.push(am5wc.WordCloud.new(root, {
    //   maxCount: 100,
    //   minWordLength: 2,
    //   maxFontSize: am5.percent(35),

    // }));


    this.series = root.container.children.push(am5wc.WordCloud.new(root, {
      categoryField: "name",
      valueField: "weight",
      randomness: 0.3,
      calculateAggregates: true, // this is needed for heat rules to work
      maxFontSize: 60,
      minFontSize: 20,
      // rotation: 45,
      angles: [0],
      crisp: true,
    }));



    this.series.data.setAll(data);

    this.series.set("heatRules", [{
      target: this.series.labels.template,
      dataField: "value",
      min: am5.color(0x000000),
      max: am5.color(0x0077A7),
      key: "fill"
    }]);

    // series.adapters.add("rotation", function(rotation, target) {
    //   // Apply the custom angle to the series
    //   return 45;
    // });

    // remove credits
    // $("#chartdiv > div").remove();


    var tooltip = am5.Tooltip.new(root,{
      getFillFromSprite: false,
      getStrokeFromSprite: true,
      opacity: 1,
      autoTextColor: true,
    })
    tooltip.get("background").setAll({"fill":am5.color(0xf0f0f0),"opacity":1});

    // click event
    this.series.labels.events.enableType("click");
    this.series.labels.template.states.create("hover",{opacity: 0.75});
    console.log(this.series.labels)
    // this.series.labels.template.get("renderer").labels.template.setup = target => {
    //   target.setAll({
    //     cursorOverStyle: "pointer",
    //     background: am5.Rectangle.new(root, {
    //       fill: am5.color(0x000000),
    //       fillOpacity: 0
    //     })
    //   });
    // };
      
    // this.series.labels.template.get("renderer").labels.template.events.on("click", e => {
    //   console.log(e.target.dataItem.dataContext.category,"chaolo koi gal ni");
    // });
    this.series.labels.template.events.on("click",function(e){
      console.log("children",e)
    })
    // this.series.events.on("click",function(e){
    //   e.originalEvent.preventDefault();
    //   e.originalEvent.stopImmediatePropagation();

    //   console.log("series",e)
    // })

    // Configure labels
    this.series.labels.template.setAll({
      // fontFamily: "ProximaNova"
      fontFamily: "sans-serif",
      fontWeight: 1000,
      tooltip: tooltip,
      fill: am5.color(0xD1A3F4),
      tooltipHTML: `<table><tr><td style="font-weight: 400;text-align: center;font-size: 26px;color:black">{value}</td></tr><tr><td style="text-align: center;font-size: 16px;font-weight:500">Results</td></tr><tr><td style="text-align: center;"><b><span style="color:{color}">● </span></b><b style="height:50px">{category}</b></td></tr></table>`,
      cursorOverStyle: 'copy',
    });
  }
}