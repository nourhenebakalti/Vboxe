import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VboxApiService } from "src/app/services/vbox-api.service";

@Component({
  selector: "app-link",
  templateUrl: "./link.component.html",
  styleUrls: ["./link.component.scss"],
})
export class LinkComponent implements OnInit {
  loginForm: FormGroup;
  signUpSubmitted: boolean;
  private strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  private mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  token: string;

  constructor(
    private fb: FormBuilder,
    private api: VboxApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (localStorage.getItem("accessToken")) {
      this.router.navigate(["/", "page", "my_vbox", "files"]);
    }
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token");
    console.log("Le token du lien est :", this.token);
    this.formsInit();
  }

  formsInit() {
    this.loginForm = this.fb.group({
      code: ["", Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const code = this.loginForm.get("code").value;
      console.log(code);

      
      this.api.authenticateLink(code,this.token).subscribe(
        (data) => {
          console.log("lllllllll")
          if (data === true) {
            this.router.navigate(["/", "page", "my_vbox", "files"]);
          }
        },
        (err) => console.error(err)
      );
    }
  }
  // login() {
  //   if (this.loginForm.valid) {
  //     this.api
  //       .authenticate(
  //         this.loginForm.get("email").value,
  //         this.loginForm.get("password").value
  //       )
  //       .subscribe(
  //         (data) => {
  //           if (data === true) {
  //             this.router.navigate(["/", "page", "my_vbox", "files"]);
  //           }
  //         },
  //         (err) => console.log(err)
  //       );
  //   }
  // }
}
