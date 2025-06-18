import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-supprimer-elmnt",
  templateUrl: "./supprimer-elmnt.component.html",
  styleUrls: ["./supprimer-elmnt.component.scss"],
})
export class SupprimerElmntComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SupprimerElmntComponent>,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistery.addSvgIcon(
      "file-move",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/deleteFile.svg"
      )
    );
  }

  ngOnInit(): void {}
  close(arg) {
    console.log(arg);
    this.dialogRef.close(arg);
  }
}
