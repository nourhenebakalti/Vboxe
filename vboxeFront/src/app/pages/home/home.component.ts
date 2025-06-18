import { Router } from "@angular/router";
import { VboxApiService } from "./../../services/vbox-api.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  signUpForm: FormGroup;
  signUpSubmitted: boolean;
  private strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  private mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  constructor(
    private fb: FormBuilder,
    private api: VboxApiService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("accessToken") && this.router.url === "/home") {
      this.router.navigate(["/", "page", "my_vbox", "files"]);
    }
    this.formsInit();
  }

  formsInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.signUpForm = this.fb.group(
      {
        email: [
          "",
          [Validators.required, Validators.minLength(3), Validators.email],
        ],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        name: ["", Validators.required],
        mobileNumber: [
          "",
          [Validators.required, Validators.pattern(/^\d{7,15}$/)],
        ],
      },
      { validators: this.verif("password", "confirmPassword") }
    );
  }

  verif(pass: string, repass: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[pass];
      const repassword = formGroup.controls[repass];

      if (repassword.value && repassword.value) {
        if (password.value !== repassword.value) {
          repassword.setErrors({ eq: false });
        } else {
          repassword.setErrors(null);
        }
      }
    };
  }

  login() {
    if (this.loginForm.valid) {
      this.api
        .authenticate(
          this.loginForm.get("email").value,
          this.loginForm.get("password").value
        )
        .subscribe(
          (data) => {
            if (data === true) {
              this.router.navigate(["/", "page", "my_vbox", "files"]);
            }
          },
          (err) => console.log(err)
        );
    }
  }

  registerUser() {
    this.signUpSubmitted = true;
    if (this.signUpForm.valid) {
      console.log("kkkkkkkkkk");
      this.api
        .registerUser(
          this.signUpForm.get("email").value,
          this.signUpForm.get("password").value,
          this.signUpForm.get("name").value,
          this.signUpForm.get("mobileNumber").value
        )
        .subscribe((data: any) => {
          this.signUpForm.reset();
          if (data) {
            alert(
              "user created. Verify email by the link sent on your email address"
            ); // Afficher le texte de la réponse
          } else {
            alert("Error: Email is already in use!");
          }
        });
    }
  }
}
