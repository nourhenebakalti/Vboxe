import { FindSearchDialogComponent } from "./components/find-search-dialog/find-search-dialog.component";
import { VboxApiService } from "./../../services/vbox-api.service";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  friends = [];

  constructor(
    private api: VboxApiService,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.getFriends();
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

  getFriends() {
    this.api.getAllFriends().subscribe((data: any) => {
      if (data.results) {
        this.friends = data.results;
      }
    });
  }

  ngOnInit() {}

  abrefName(friend) {
    return friend ? (friend.name as string).substring(0, 2).toUpperCase() : "";
  }

  profilePicture(friend) {
    return friend && friend.profilePicture && friend.profilePicture.data;
  }

  getCreateDate(friend) {
    return new Date(parseInt(friend._id.slice(0, 8), 16) * 1000);
  }

  userDelete(friend) {
    this.api.deleteFriend(friend._id).subscribe((data) => {
      setTimeout(() => {
        this.getFriends();
      }, 30);
    });
  }

  addFriend() {
    const dialog = this.dialog.open(FindSearchDialogComponent, {
      width: "453.44px",
      panelClass: "custom-dialog",
      data: {
        type: "friends",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) this.getFriends();
    });
  }
}
