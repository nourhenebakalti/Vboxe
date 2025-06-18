import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { VboxApiService } from "src/app/services/vbox-api.service";

@Component({
  selector: "app-add-profile",
  templateUrl: "./add-profile.component.html",
  styleUrls: ["./add-profile.component.scss"],
})
export class AddProfileComponent implements OnInit {
  signUpForm: FormGroup;
  signUpSubmitted = false;
  hidePassword = true;
  hideConfirmPassword = true;
  constructor(
    private fb: FormBuilder,
    private api: VboxApiService,
    private dialogRef: MatDialogRef<AddProfileComponent>
  ) {
    this.signUpForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        name: ["", Validators.required],
        mobileNumber: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        deletionHours: ["", [Validators.required, Validators.minLength(2)]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Validateur personnalisé pour comparer password et confirmPassword
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    if (password !== confirmPassword) {
      control.get("confirmPassword")?.setErrors({ mismatch: true });
    } else {
      control.get("confirmPassword")?.setErrors(null);
    }
  }

  onSubmit() {
    this.signUpSubmitted = true;
    
    if (this.signUpForm.valid) {
      console.log("Formulaire soumis", this.signUpForm.value);
    } else {
      console.log("Formulaire invalide");
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  ngOnInit(): void {}

  registerUserProfile() {
    this.signUpSubmitted = true;
    if (this.signUpForm.valid) {
      this.api
        .registerUserProfile(
          this.signUpForm.get("email").value,
          this.signUpForm.get("password").value,
          this.signUpForm.get("name").value,
          this.signUpForm.get("mobileNumber").value,
          this.signUpForm.get("deletionHours").value
        )
        .subscribe((data: any) => {
          this.signUpForm.reset();
          if (data) {
            this.dialogRef.close();
          }
        });
    }
  }
  onCancel() {
    this.dialogRef.close(); // Ferme la boîte de dialogue
  }
}
