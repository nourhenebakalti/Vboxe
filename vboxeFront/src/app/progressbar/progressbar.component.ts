import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HistoryService } from '../services/history.service';
import { VboxApiService } from '../services/vbox-api.service';
@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {
  CurrentIdUser : string;
  PercentPdf : number;
  isNumberVisible: boolean = false;
  constructor(private historyService : HistoryService , private api:VboxApiService) { }

  ngOnInit(): void {
    this.CurrentIdUser=this.api.profile.id;
    this.getPourcentPdf(this.CurrentIdUser);
  }

  getPourcentPdf(id :string) {
    this.historyService.getPourcentPdf(id).subscribe( {
      next : (data)=>{
      console.log("this is data percent pdf",data)
      this.PercentPdf=data;},
      error : (err) =>{
        console.log(err)
      }
 });
}

showNumber(): void {
  this.isNumberVisible = true;
}

hideNumber(): void {
  this.isNumberVisible = false;
}

  
}
