import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { folder } from "../deplacer-elmnt/Folder";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccessRequest } from "src/app/pages/coffre-fort/accessRequest";
import { MoveEntityRequest } from "./MoveEntityRequest";

@Component({
  selector: "app-deplacer-elmnt-boxe",
  templateUrl: "./deplacer-elmnt-boxe.component.html",
  styleUrls: ["./deplacer-elmnt-boxe.component.scss"],
})
export class DeplacerElmntBoxeComponent implements OnInit {
  toppingList: folder[];
  formGroup: FormGroup;
  hidePassword = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeplacerElmntBoxeComponent>,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public api: VboxApiService
  ) {
    this.iconRegistery.addSvgIcon(
      "file-move",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-move.svg"
      )
    );
    this.formGroup = this.formBuilder.group({
      code: [
        "",
        [
          Validators.pattern("[0-9]*"),
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });
  }

  ngOnInit() {
    this.api.getAllFolders().subscribe((data: any) => {
      this.toppingList = data;
    });
  }
  validateInput(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    // Valider le code
    if (this.formGroup.valid) {
      // Envoyer le code et accéder au coffre-fort
      this.dialogRef.close(this.formGroup.value.code);
    }
  }

  close(arg) {
    this.dialogRef.close(arg);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
