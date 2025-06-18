import { Component, Inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { folder } from "./Folder";

@Component({
  selector: "app-deplacer-elmnt",
  templateUrl: "./deplacer-elmnt.component.html",
  styleUrls: ["./deplacer-elmnt.component.scss"],
})
export class DeplacerElmntComponent implements OnInit {
  formGroup: FormGroup;
  toppings = new FormControl("");
  toppingList: folder[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeplacerElmntComponent>,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public api: VboxApiService
  ) {
    this.formGroup = new FormGroup({
      nameFolder: new FormControl(this.data.nameFolder)
    });
 
    this.iconRegistery.addSvgIcon(
      "file-move",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-move.svg"
      )
    );
  

 
  }


  ngOnInit() {
  
    this.api.getAllFolders().subscribe((data: any) => {
      this.toppingList = data;
    });

  }

  close(arg) {
    const idFolder =this.toppings.value;
    idFolder ? this.dialogRef.close(idFolder) : this.dialogRef.close(null);
  }
}
