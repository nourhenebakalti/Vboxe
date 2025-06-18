import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { VboxApiService } from '../services/vbox-api.service';
import { HistoryService } from '../services/history.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.scss']
})
export class TopWidgetsComponent implements OnInit {
  NbrUsers : number;
  NbrUsersDepuisMoisDernier : number;
  NbrFiles : number;
  NbrFilesDepuisMoisDernier : number;
  NbrFolders : number;
  NbrFoldersDepuisMoisDernier : number;
  CurrentIdUser : string;
  displayExtension : boolean =false;
  displayFichier : boolean =true;
  displayFichierStatistics:boolean=false
nombrePDF:number | 0
nombrePPT:number | 0
nombreImage:number | 0
nombreWord:number | 0
@ViewChild('statisticsModal') statisticsModal!: TemplateRef<any>;
  constructor(private userService:UserService, private api:VboxApiService, private historyservice :HistoryService, private _matDialog: MatDialog,) { 
    
  }
  faFile = faFile;
  ngOnInit(): void {

   this.getNombreUsersDepuisMoisDernier();
   this.CurrentIdUser=this.api.profile.id;
   this.getNombreUsers()
   this.getNombreFiles(this.CurrentIdUser);
   this.getNombreFilesDepuisMoisDernier(this.CurrentIdUser);
   this.getNombreFolders(this.CurrentIdUser);
   this.getNombreFoldersDepuisMoisDernier(this.CurrentIdUser);
   this.getNombrePdf(this.CurrentIdUser)
   this.getNombreImages(this.CurrentIdUser)
   this.getNombreWord(this.CurrentIdUser)
   this.getNombreppt(this.CurrentIdUser)
   console.log("voila l'id de l'utilisateur courant: " + this.CurrentIdUser)
  
  }

  getNombreUsers() {
    this.userService.getNombreUsers().subscribe( {
      next : (data)=>{
      console.log("this is data number users",data)
      this.NbrUsers=data;},
      error : (err) =>{
        console.log(err)
      }
 });
}
showTheFileStatistics()
{
  this.displayFichierStatistics=true
  this._matDialog.open(this.statisticsModal);
 
}
getNombrePdf(id :string) {
  this.historyservice.getPourcentPdf(id ).subscribe( {
    next : (data)=>{
    console.log("this is data of number pdf ",data)
   this.nombrePDF= data},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreImages(id :string) {
  this.historyservice.getPourcentimages(id ).subscribe( {
    next : (data)=>{
    console.log("this is data of number images ",data)
    this.nombreImage= data},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreWord(id :string) {
  this.historyservice.getPourcentword(id ).subscribe( {
    next : (data)=>{
    console.log("this is data of number word files ",data)
    this.nombreWord= data;},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreppt(id :string) {
  this.historyservice.getPourcentppt(id ).subscribe( {
    next : (data)=>{
    console.log("this is data of number ppt files ",data)
    this.nombrePPT= data},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreUsersDepuisMoisDernier() {
  this.userService.getNombreUsersDepuisMoisDernier().subscribe( {
    next : (data)=>{
    console.log("this is data of number mois",data)
    this.NbrUsersDepuisMoisDernier=data;},
    error : (err) =>{
      console.log(err)
    }
});
}

getNombreFiles(id :string) {
  this.historyservice.getNombreFiles(id).subscribe( {
    next : (data)=>{
    console.log("this is data number files",data)
    this.NbrFiles=data;},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreFilesDepuisMoisDernier(id :string) {
  this.historyservice.getNombreFilesDepuisMoisDernier(id).subscribe( {
    next : (data)=>{
    console.log("this is data of number files mois",data)
    this.NbrFilesDepuisMoisDernier=data;},
    error : (err) =>{
      console.log(err)
    }
});
}

getNombreFolders(id :string) {
  this.historyservice.getNombreFolders(id).subscribe( {
    next : (data)=>{
       this.NbrFolders=data;},
    error : (err) =>{
      console.log(err)
    }
});
}
getNombreFoldersDepuisMoisDernier(id :string) {
  this.historyservice.getNombreFoldersDepuisMoisDernier(id).subscribe( {
    next : (data)=>{
    console.log("this is data of number folders mois",data)
    this.NbrFoldersDepuisMoisDernier=data;},
    error : (err) =>{
      console.log(err)
    }
});
}
onMouseUp(event: MouseEvent): void {
  console.log('Mouse down event', event);
  if(this.displayFichier == true){
    this.displayExtension = true;
    this.displayFichier = false;
  }
  else {
    this.displayFichier = true;
    this.displayExtension = false;
  }
  
  
 
}


}
