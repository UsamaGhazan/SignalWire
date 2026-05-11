import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from 'src/service/news.service';
import { ScrapperStatus } from 'src/service/interfaces';

@Component({
  selector: 'app-status-dashboard',
  templateUrl: './status-dashboard.component.html',
  styleUrls: ['./status-dashboard.component.css']
})
export class StatusDashboardComponent implements OnInit,OnDestroy {
  intervalId: any;

  constructor(public api:NewsService) { }
  
scrapperStatusList:ScrapperStatus[]=[]
originalList:ScrapperStatus[]=[]
regionFilter:string=''
typeFilter:string=''
  ngOnInit(): void {
    this.getScrapperStatus()
    // interval for 10 minutes
    this.intervalId=setInterval(() => {
      this.getScrapperStatus()
      
    },600000);
  }


  getScrapperStatus(){
    this.api.getScrapperStatus().subscribe((response:any)=>{
      
      this.originalList=response.data
      this.showErrors()
      console.log('scrapper data ',this.scrapperStatusList)
    })
  }

  filterRegion(event:any){
  console.log(event)
  console.log(event.target.value)
  this.regionFilter=event.target.value
if(this.regionFilter==='all' ){
  this.scrapperStatusList=this.originalList
  console.log('filterdList ',this.scrapperStatusList)
  return
}

if(this.typeFilter==='all'){
  this.scrapperStatusList=this.originalList.filter(item=>item.category===this.regionFilter  )
  return
}
  // console.log('this.regionFilter ',this.regionFilter)
  // console.log('this.typeFilter ',this.typeFilter)
  if(this.typeFilter){
    this.scrapperStatusList=this.originalList.filter(item=>item.category===this.regionFilter && item.type===this.typeFilter )
  }else{
    this.scrapperStatusList=this.originalList.filter(item=>item.category===this.regionFilter )

  }
  console.log('filterdList ',this.scrapperStatusList)
  }

  filterType(event:any){
    this.typeFilter=event.target.value
    // console.log('this.regionFilter ',this.regionFilter)
    // console.log('this.typeFilter ',this.typeFilter)
    if(this.typeFilter==='all'){
      this.scrapperStatusList=this.originalList
      console.log('filterdList ',this.scrapperStatusList)

      return
    }

    if(this.regionFilter==='all'){
      this.scrapperStatusList=this.originalList.filter(item=>item.type===this.typeFilter  )
      return
    }
    if(this.regionFilter){
      this.scrapperStatusList=this.originalList.filter(item=>item.type===this.typeFilter && item.category===this.regionFilter)

    }else{
      this.scrapperStatusList=this.originalList.filter(item=>item.type===this.typeFilter )
    }
    console.log('filterdList ',this.scrapperStatusList)

  }
  onToggle(event:any){
    if(event.target.checked){
      this.showErrors()
    }else{
      this.scrapperStatusList=this.originalList
    }

  }

  showErrors(){
    this.scrapperStatusList=this.originalList.filter(itm=>itm.status==='error')
  }


  convertDateFormat(dateString: string): string {
    // Parse the date string
    const date = new Date(dateString);
  
    // Extract components
    const day = ('0' + date.getUTCDate()).slice(-2); // Get day (with leading 0)
    const hours = ('0' + date.getUTCHours()).slice(-2); // Get hours (with leading 0)
    const minutes = ('0' + date.getUTCMinutes()).slice(-2); // Get minutes (with leading 0)
    const monthShort = date.toLocaleString('en', { month: 'short' }); // Get month in short form (Sep)
    const yearShort = date.getUTCFullYear().toString().slice(-2); // Get last two digits of year
  
    // Concatenate in the desired format: DDHHMM Mon YY
    return `${day}${hours}${minutes} ${monthShort} ${yearShort}`;
  }
  
  capitalizeFirstLetter(input: string): string {
    return input.split(' ').map(word => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word; // Return empty string if the word is empty
    }).join(' ');
}

  ngOnDestroy(): void {
    if(this.intervalId){
      clearInterval(this.intervalId)
    }
  }
}
