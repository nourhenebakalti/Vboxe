import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Collaborator } from "src/app/pages/my-vbox/components/partage-elment/component/Collaborator";
import { ShareRequest } from "src/app/pages/my-vbox/components/partage-elment/component/ShareRequest";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { UserService } from "src/app/services/user.service";
import { ChangePssWordComponent } from "../change-pss-word/change-pss-word.component";
import { AddProfileComponent } from "../add-profile/add-profile.component";

export interface User {
  selected: boolean;
  _id: string;
  name: string;
  username: string;
  role: string;
  status: string;
}

@Component({
  selector: "app-profile-element",
  templateUrl: "./profile-element.component.html",
  styleUrls: ["./profile-element.component.scss"],
})
export class ProfileElementComponent implements OnInit {
  filteredOptions = [];
  users: User[];
  friends: User[];
  editProfileDialog: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileElementComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private api: VboxApiService,
    private _matDialog: MatDialog,
    private userService: UserService
  ) {
    this.iconRegistery.addSvgIcon(
      "user-delete",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/delete.svg")
    );

    this.iconRegistery.addSvgIcon(
      "file-share",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-share.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "user-plus",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/user-plus.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "user-plus",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/user-plus.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "user-delete",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/delete.svg")
    );
  }

  abrefName(friend) {
    return friend ? (friend.name as string).substring(0, 2).toUpperCase() : "";
  }

  profilePicture(friend) {
    return friend && friend.profilePicture && friend.profilePicture.data;
  }

  getCreateDate(friend) {
    return new Date(parseInt(friend._id.slice(0, 8), 16) * 1000);
  }

  ngOnInit() {
    this.getFriends();
  }

  getFriends() {
    this.api.getAllUsers().subscribe((data: any) => {
      if (data.results) {
        this.users = data.results;
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteUser(friend: User) {
    this.api.deleteProfile(friend._id).subscribe((data: any) => {
      if (data) {
        this.dialogRef.close();
      }
    });
  }

  editEvent(user: User) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.editProfileDialog = this._matDialog.open(EditProfileComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false,
      data: user,
    });
    this.editProfileDialog.afterClosed().subscribe((role) => {
      if (role) {
        this.userService
          .updateUserRole(user._id, role)
          .subscribe((output) => {});
      }
    });
  }

  modifierPassWord(user: User) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.editProfileDialog = this._matDialog.open(ChangePssWordComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false,
      data: user,
    });
    this.editProfileDialog.afterClosed().subscribe((password) => {
      if (password) {
        this.userService
          .updatePassWord(user._id, password)
          .subscribe((output) => {});
      }
    });
  }
  onAdd() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.editProfileDialog = this._matDialog.open(AddProfileComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false,
      data: null,
    });
    this.editProfileDialog.afterClosed().subscribe((password) => {
      if (password) {
      }
    });
  }
}
