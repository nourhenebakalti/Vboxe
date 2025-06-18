import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { User } from "../profile-element/profile-element.component";

@Component({
  selector: "app-change-pss-word",
  templateUrl: "./change-pss-word.component.html",
  styleUrls: ["./change-pss-word.component.scss"],
})
export class ChangePssWordComponent implements OnInit {
  signUpForm: FormGroup;
  hidePassword = true;
  roles: string[] = [
    "ROLE_ADMIN",
    "ROLE_USER",
    "SUPER_USER",
    "SUPER_USER_ELARGI",
  ]; // Ajoute les rôles souhaités

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private dialogRef: MatDialogRef<ChangePssWordComponent>
  ) {}

  ngOnInit(): void {
    this.formsInit();
  }

  formsInit() {
    this.signUpForm = this.fb.group({
      email: [
        this.user.username,
        [Validators.required, Validators.minLength(3), Validators.email],
      ],
      name: [this.user.name, Validators.required],
      role: [this.user.role],
      password: ["", Validators.required],
    });
  }

  onCancel() {
    this.dialogRef.close(); // Ferme la boîte de dialogue
  }

  onSubmit() {
    console.log(this.signUpForm.value.password);
    this.dialogRef.close(this.signUpForm.value.password);
  }
}
