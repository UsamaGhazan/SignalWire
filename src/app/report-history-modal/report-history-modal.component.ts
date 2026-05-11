import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from 'src/service/news.service';

@Component({
  selector: 'app-report-history-modal',
  templateUrl: './report-history-modal.component.html',
  styleUrls: ['./report-history-modal.component.css']
})
export class ReportHistoryModalComponent implements OnInit {
  constructor(private api:NewsService,
    private router: Router,

  ) { }
  showModal:boolean=false
  filePaths:any[]=[]
  ngOnInit(): void {

  }
  toggleModal(){
    this.showModal=!this.showModal
    console.log('this.showmodal ',this.showModal)
    if(this.showModal){

      this.api.getReportHistory().subscribe((data:any)=>{
        this.filePaths=data.paths
        console.log('filepaths ',this.filePaths)
        })
    }

  }

  downloadFile(filePath: string){
  
    const url = `https://zulon.ai/${filePath}`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', filePath);  // Optional, if you want to force download
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  
    console.log('File download triggered');
  }
  parseDate(input) {
    // Create a new Date object from the input string
    const date = new Date(input);
  
    // Array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
    const month = monthNames[date.getMonth()]; // Get the month name
    const year = date.getFullYear(); // Get the year
    // Return the formatted date as "DD Mon YYYY"
    return `${day} ${month} ${year}`;
  }
}
