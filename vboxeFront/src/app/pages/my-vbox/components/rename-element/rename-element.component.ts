import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-rename-element",
  templateUrl: "./rename-element.component.html",
  styleUrls: ["./rename-element.component.scss"],
})
export class RenameElementComponent implements OnInit {
  newFileName: string = "";
  fileName: string = "";
  entity: string = "";
  fileBaseName: string = "";
  fileExtension: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RenameElementComponent>,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistery.addSvgIcon(
      "file-rename",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/editFileName.svg"
      )
    );
    this.fileName = data.nameFile;
    this.entity = data.entity;
    this.extractFileNameAndExtension();
  }

  ngOnInit(): void {}
  close(arg) {
    console.log(arg);
    const finalFileName = this.newFileName + this.fileExtension; // Concaténation
    console.log(finalFileName)
    const finalData = {
      isRenamed: arg,
      newFileName: finalFileName,
    };
    this.dialogRef.close(finalData);
  }

  extractFileNameAndExtension() {
    const lastDotIndex = this.fileName.lastIndexOf(".");

    if (lastDotIndex !== -1) {
      this.fileBaseName = this.fileName.substring(0, lastDotIndex); // Nom sans extension
      this.fileExtension = this.fileName.substring(lastDotIndex); // Extension (avec le point)
    } else {
      this.fileBaseName = this.fileName; // Si aucun point, garde le nom complet
      this.fileExtension = ""; // Pas d'extension
    }
  }
}
