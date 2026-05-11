import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from 'src/service/data.service';
import * as Chart from "chart.js";
import * as Highcharts from "highcharts";
import { Router } from '@angular/router';
const Wordcloud = require("highcharts/modules/wordcloud");
import { Location } from '@angular/common';
import { NewsService } from 'src/service/news.service';
import { count } from 'rxjs';

Wordcloud(Highcharts);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  constructor(public api: NewsService, private ngxService: NgxUiLoaderService,
    private toastr: ToastrService, private router: Router,
    private location: Location) { }
    selected_cat="east_corner"
  ngOnInit(): void {
  this.getChartData()
  }
  getChartData(){
    this.ngxService.start()
    this.api.getChartData().subscribe(
      (data: any) => {
      if(data?.data){
         data= data?.data
        if(data.twitter_handles){
          this.dougnut_chart(data.twitter_handles,'handlerChart',"Twitter Handles")
        } 
        if(data.youtube_handles){
          this.dougnut_chart(data.youtube_handles,'youtubeChart',"Youtube Handles")
        }  
        if(data.keywords){
          this.dougnut_chart(data.keywords,'keywordChart',"Keywords")
        }   
        this.ngxService.stop()
      }
      },(error) => {
        this.ngxService.stop()
      })
  }
  
  dougnut_chart = (data, id, title) => {
    $("."+id).show()
    var pieData=[]
    for (let i = 0; i < data.cat.length; i++) {
      let json = {
        "name": data.cat[i],
        "y": data.series[i],
      }
      pieData.push(json);
    }
    var colorArray = ['#22b573', '#0071bc', '#ed1c24', '#a9a9a9', '#2f4f4f',
      '#556B2F', '#A0522D', '#800000', '#808000', '#483D8B', '#3CB371',
      '#5050E2', '#D38200', '#D3D350',
      '#E54217', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ];
    new Highcharts.Chart({
      chart: {
        renderTo: id,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        // options3d: {
        //   enabled: true,
        //   alpha: 45,
        // }
      },
      title: {
        text: title
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        series: {
          // @ts-ignore
          trackByArea: true,
          events: {
            click: (e) => {
              // this.applyFilter(e.point.name, id)
            }
          }
        },
        pie: {
          innerSize: 0,
          depth: 5
        }
      },
      // @ts-ignore
      series: [{
        name: 'Count',
        data: pieData,
        colors: Highcharts.map(colorArray, function (color) {
          return {
            radialGradient: {
              cx: 0.5,
              cy: 0.3,
              r: 0.7
            },
            stops: [
              [0, color],
              [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
            ]
          };
        }),
        dataLabels: {
          enabled: true,
          useHTML: true,
          format: '<span style="text-transform:capitalize" class="pe-2">{point.name}</span>{point.y} ',
          style: {
            width: 200,
            textOverflow: 'ellipsis'
          }
        }
      }]
    });

    $('.highcharts-credits').hide();
  }

}


