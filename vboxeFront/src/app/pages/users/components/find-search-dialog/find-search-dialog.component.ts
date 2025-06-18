import { VboxApiService } from "./../../../../services/vbox-api.service";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-find-search-dialog",
  templateUrl: "./find-search-dialog.component.html",
  styleUrls: ["./find-search-dialog.component.scss"],
})
export class FindSearchDialogComponent implements OnInit {
  formGroup: FormGroup;
  filteredOptions = [];
  idSelectedUser = null;
  public friends = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FindSearchDialogComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private api: VboxApiService
  ) {
    this.iconRegistery.addSvgIcon(
      "user-delete",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/delete.svg")
    );

    this.formGroup = this.formBuilder.group({
      users: ["", [Validators.required, Validators.minLength(2)]],
    });

    this.iconRegistery.addSvgIcon(
      "user-plus",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/user-plus.svg"
      )
    );
  }
  ngOnInit() {
    console.log(this.data);
  }

  close(arg) {
    this.dialogRef.close(arg);
  }

  saveId(id) {
    this.idSelectedUser = id.option.value._id;
  }

  submit() {
    if (this.formGroup.valid && this.idSelectedUser) {
      let api = this.api.addFriend(this.idSelectedUser);
      api.subscribe((data) => {
        this.close(true);
      });
    }
  }

  userDelete() {
    this.idSelectedUser = null;
    this.formGroup.reset();
  }

  getOptionText(option) {
    return option.name;
  }

  getFriends(q) {
    this.api.getAllFriends().subscribe((data: any) => {
      if (data.results) {
        this.filteredOptions = data.results.filter((user) => {
          return user.name.indexOf(q) !== -1 || user.username.indexOf(q) !== -1;
        });
      }
    });
  }

  searchFriends() {
    const q = this.formGroup.get("users").value;
    if (q.length > 2) {
      if (this.data.type === "friends") {
        this.api.searchFriends(q).subscribe((data: any) => {
          if (data && data.results) {
            this.filteredOptions = data.results;
          } else this.filteredOptions = [];
        });
      } else {
        this.getFriends(q);
      }
    } else this.filteredOptions = [];
  }
}
