import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CoffreFortService } from "src/app/services/coffre-fort.service";

@Component({
  selector: "app-add-safety-code",
  templateUrl: "./add-safety-code.component.html",
  styleUrls: ["./add-safety-code.component.scss"],
})
export class AddSafetyCodeComponent implements OnInit {
  formGroup: FormGroup;
  confirmCodeInvalid: boolean = false;
  code: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSafetyCodeComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private apiCoffreFort: CoffreFortService
  ) {
  
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
      confirmCode: [
        "",
        [
          Validators.pattern("[0-9]*"),
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });
    this.iconRegistery.addSvgIcon(
      "unlock-dialog",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/unlock-dialog.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "lockDig",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/lock.svg"
      )
    );

    // Ajoutez un écouteur d'événements pour comparer les champs de code
    this.formGroup.get("confirmCode")?.valueChanges.subscribe((value) => {
      this.confirmCodeInvalid = value !== this.formGroup.get("code")?.value;
    });
  }

  ngOnInit(): void {
  }

  close(arg) {
    const password = this.formGroup.get("code").value;
    password ? this.dialogRef.close(password) : this.dialogRef.close(null);
  }
  validateInput(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  onSubmit(): void {
    // Valider le code
    if (this.formGroup.valid && !this.confirmCodeInvalid) {
      // Envoyer le code et accéder au coffre-fort
      
      this.apiCoffreFort
        .addPasswordCoffre(this.data.email, this.formGroup.value.code)
        .subscribe((value) => {
          console.log("Mot de passe du coffre-fort ajouté avec succès.");
        });
    }
  }
}
