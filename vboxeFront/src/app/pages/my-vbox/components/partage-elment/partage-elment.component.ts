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
import { VboxApiService } from "src/app/services/vbox-api.service";
import { Collaborator } from "./component/Collaborator";
import { ShareRequest } from "./component/ShareRequest";

export interface User {
  selected: boolean;
  _id: string;
  name: string;
  username: string;
  role: string;
  status: string;
}
@Component({
  selector: "app-partage-elment",
  templateUrl: "./partage-elment.component.html",
  styleUrls: ["./partage-elment.component.scss"],
})
export class PartageElmentComponent implements OnInit {
  formGroup: FormGroup;
  filteredOptions = [];
  users: User[];
  attendents = new FormControl("");
  idSelectedUser = null;
  collaborators: Collaborator[] = [];
  friends: User[];
  iddoc: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PartageElmentComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private api: VboxApiService,
    private dialog: MatDialog
  ) {
    this.iconRegistery.addSvgIcon(
      "user-delete",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/delete.svg")
    );

    this.formGroup = this.formBuilder.group({
      users: ["", [Validators.required, Validators.minLength(2)]],
      attendents: [null],
    });
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
    if (this.data.file) {
      this.iddoc = this.data.file._id;
    }
    if (this.data.folder) {
      this.iddoc = this.data.folder._id;
    }
    this.api.getFriendsForShare(this.iddoc).subscribe((data: any) => {
      if (data.results) {
        console.log(data);
        this.users = data.results;
      }
    });
  }

  close(arg) {
    this.dialogRef.close(arg);
  }

  submit() {
    console.log("yes in submit");
    const selectedUsers = this.getSelectedUsers();

    let shareRequest: ShareRequest = {
      collaboratorList: selectedUsers,
    };

    if (this.data.type === "share") {
      if (this.data.file) {
        this.api
          .shareDocument(shareRequest, this.data.file._id, "file")
          .subscribe(() => {
            this.close(true);
          });
      }
      if (this.data.folder) {
        this.api
          .shareDocument(shareRequest, this.data.folder._id, "folder")
          .subscribe(() => {
            this.close(true);
          });
      }
    }
  }

  // Vérifie si tous les utilisateurs sont sélectionnés
  areAllSelected(): boolean {
    return this.users.every((friend) => friend.selected);
  }

  // Sélectionne/Désélectionne tous les utilisateurs
  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.users.forEach((friend) => (friend.selected = checked));
  }

  getSelectedUsers(): Collaborator[] {
    return this.users
      .filter((user) => user.selected)
      .map(
        (user) => new Collaborator(user._id, user._id, user.name, user.username)
      );
  }
  cancel() {
    this.close(false); // Ferme le dialogue sans action
  }
  hasSelectedUsers(): boolean {
    return this.users.some((user) => user.selected);
  }
  isSharedClicked = false;

  toggleShared() {
    this.isSharedClicked = !this.isSharedClicked;
  }
}
