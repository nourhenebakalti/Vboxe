
import { VboxApiService } from 'src/app/services/vbox-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Share } from '../models/share.model';
import { MatDialog } from "@angular/material/dialog";
import { PdfViewerComponent } from "../pages/my-vbox/components/pdf-viewer/pdf-viewer.component";
import { FileResponse } from "src/app/utils/FileResponse";
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss']
})

export class RecentActivitiesComponent implements OnInit {


  startDate: Date | null = null;
  endDate: Date | null = null;
  shares : Share[] = [];
  dataSource = new MatTableDataSource<Share>(this.shares);
  displayedColumns = ['Utilisateur', 'Email','Date' ,'Document', 'Action'];
   
   
   constructor(private _VboxApiService : VboxApiService, public api: VboxApiService,
  
    private dialog: MatDialog) {
     
     
     }

  ngOnInit(): void {
    this.getAllShared();
    console.log("test init" , this.dataSource.data)
   
  
  }
 // readonly date = new FormControl(new Date());
 // readonly serializedDate = new FormControl(new Date().toISOString());

  getAllShared() {
    this._VboxApiService.getallSharedByUser().subscribe( {
      next : (data)=>{
     
      this.dataSource.data=data;
      console.log("test all shared 2",data)
      
      },
      error : (err) =>{
        console.log(err)
      }
      

 })


}
ondeleteshare(id : string) {
  this._VboxApiService.deleteShared(id).subscribe();
  this.getAllShared();
  }


redirectToPdfViewer(id: string) {
  if (id !== undefined || id !== null) {
    this.api.getFileById(id).subscribe((res: FileResponse) => {
      if (res) {
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          width: "100%",
          height: "95%",
          data: res, // Passer la source du fichier PDF au composant de la boîte de dialogue modale
        });
      }
    });
  }
}


onStartDateChange(event: MatDatepickerInputEvent<Date>): void {
  this.startDate = event.value;
  this.getAllShared();
 

  console.log("vailaaaaaaaaaaa111" + this.dataSource.data)
}

onEndDateChange(event: MatDatepickerInputEvent<Date>): void {
  this.endDate = event.value;
  console.log("date" , this.startDate)
  this.filterData();

  console.log("vailaaaaaaaaaaa" , this.dataSource.data)
}

filterData(): void {
  if (this.startDate && this.endDate) {
  
    console.log("test filter data" , this.dataSource.data)
    const filteredData = this.dataSource.data.filter((item) => {
  
     // assuming each item has a 'date' field
   return  new Date(item.createdAt)>= new Date(this.startDate) && new Date(item.createdAt) <= new Date(this.endDate)

    });
    console.log("vailaaaaaaaaaaa4" , filteredData)
    this.dataSource.data = filteredData;
  }
}
}





