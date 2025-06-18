import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "../profile-element/profile-element.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  signUpForm: FormGroup;
  roles: string[] = [
    "ROLE_ADMIN",
    "ROLE_USER",
    "SUPER_USER",
    "SUPER_USER_ELARGI",
  ]; // Ajoute les rôles souhaités

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private dialogRef: MatDialogRef<EditProfileComponent>
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
    });
  }

  onCancel() {
    this.dialogRef.close(); // Ferme la boîte de dialogue
  }

  onSubmit() {
    //console.log(this.signUpForm.value.role);
    this.dialogRef.close(this.signUpForm.value.role);
  }
}
