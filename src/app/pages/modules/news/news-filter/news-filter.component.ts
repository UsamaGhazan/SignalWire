import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-news-filter',
  templateUrl: './news-filter.component.html',
  styleUrls: ['./news-filter.component.css']
})
export class NewsFilterComponent implements OnInit {
  @Input() date;
  @Input() context;
  @Output() onChange:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    
  }

  changeFilter(value) {
    if(this.context=='map'){
      if(value=="latest"){
        value="48hours"
      }
      this.onChange.emit({
        context: this.context,
        value: value
      })
    }
    else{
      this.onChange.emit({
        context: this.context,
        value: value
      })
    }
  }

}
