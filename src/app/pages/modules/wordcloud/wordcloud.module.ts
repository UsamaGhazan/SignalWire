import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordcloudChartComponent } from './wordcloud-chart/wordcloud-chart.component';



@NgModule({
  declarations: [
    WordcloudChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WordcloudChartComponent,
  ]
})
export class WordcloudModule { }
