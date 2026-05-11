import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/service/news.service';
import { ReportData } from 'src/service/interfaces';
@Component({
  selector: 'app-customyoutubesummarymodal',
  templateUrl: './customyoutubesummarymodal.component.html',
  styleUrls: ['./customyoutubesummarymodal.component.css']
})
export class CustomyoutubesummarymodalComponent implements OnInit {
  isLoading: boolean=false;

  constructor(      public api: NewsService
  ) { }
  customSummary:ReportData;
  youtubeLink:any=''

  ngOnInit(): void {
  }
  getCustomSummary(){

    if(!this.youtubeLink){
      alert('Please enter video link')
      return
    }
    this.customSummary={
      bulletPoints: [],
      keyPeople: [],
      keyAreas: [],
    }
    console.log('youtubelink ',this.youtubeLink)
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/.*[?&]v=|https?:\/\/youtu\.be\/)([^&#?]*)/;
    const match = this.youtubeLink.match(regex);  
  let videoId= match ? match[1] : null;  
  console.log('videoid ',videoId)
  this.isLoading=true
  this.api.getCustomYoutubeSummary(videoId).subscribe(res=>{
    console.log('responseeee ',res)
    this.customSummary=this.parseReport(res)
   
    this.youtubeLink=''
    this.isLoading=false

  })
  }

  parseReport(text: any) {
    const bulletPoints: string[] = [];
    const keyPeople: string[] = [];
    const keyAreas: string[] = [];

    // Split text into lines
    const lines = text.split("\n").map((line) => line.trim());

    // Flags to indicate which section is being processed
    let currentSection: "bulletPoints" | "keyPeople" | "keyAreas" | null = null;

    // Iterate through each line to categorize them
    lines.forEach((line) => {
      if (line.startsWith("•")) {
        currentSection = "bulletPoints";
        bulletPoints.push(line.slice(1).trim());
      } else if (line.startsWith("*")) {
        if (currentSection === "keyPeople") {
          keyPeople.push(line.slice(1).trim());
        } else if (currentSection === "keyAreas") {
          keyAreas.push(line.slice(1).trim());
        }
      } else if (line.toLowerCase().includes("key people")) {
        currentSection = "keyPeople";
      } else if (line.toLowerCase().includes("key areas")) {
        currentSection = "keyAreas";
      }
    });

    return { bulletPoints, keyPeople, keyAreas };
  }
}
