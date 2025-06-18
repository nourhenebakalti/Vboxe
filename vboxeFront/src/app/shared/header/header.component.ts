import { Router } from "@angular/router";
import { ProfilComponent } from "./../profil/profil.component";
import { takeUntil } from "rxjs/operators";
import { VboxApiService } from "./../../services/vbox-api.service";
import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { NotifInfo } from "src/app/utils/NotifInfo";
import { NotificationDialogComponent } from "../notification-dialog/notification-dialog.component";
import { PartageElmentComponent } from "src/app/pages/my-vbox/components/partage-elment/partage-elment.component";
import { ProfileElementComponent } from "../profile-element/profile-element.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input("pageTitle") pageTitle;
  @Input("withSearch") withSearch: boolean = false;
  destroy$ = new Subject<boolean>();
  notifList: any[] = [];
  interval: NodeJS.Timer;
  expirationDate: any;
  remainingTime: string = "";
  temporary: boolean;
  constructor(
    private router: Router,
    private api: VboxApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem("temporary") == "true") {
      this.temporary = true;
    } else {
      this.temporary = false;
    }
    this.api.getProfile().subscribe((data) => {
      this.api.profile = data;
    });
    console.log(this.pageTitle);
    if (this.pageTitle == "MY_DOCUMENTS") {
      this.api.fetchAuthenticatedUser().subscribe((data) => {
        this.expirationDate = data;
      });
    }
    this.interval = setInterval(() => {
      if (this.expirationDate != null) {
        this.remainingTime = this.getRemainingTime(this.expirationDate);
        console.log(this.remainingTime);
      }
    }, 1000);

    this.api.getNotifByUser().subscribe((notifications) => {
      if (notifications) {
        // Loop through notifications and fetch user data for each userId
        this.notifList = notifications.map((notif: any) => {
          this.api
            .getUserById(notif.idUserEventCreater)
            .subscribe((user: any) => {
              notif.userImage = user.profilePicture;
            });
          return notif;
        });
      }
    });
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getRemainingTime(expirationDate: string): string {
    const now = new Date().getTime();
    const exp = new Date(expirationDate).getTime();
    const diff = exp - now;

    if (diff <= 0) return "Lien expiré";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
  logout() {
    this.api
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.api.profile = null;
        this.router.navigate(["/"]);
      });
  }

  openProfile() {
    const dialog = this.dialog.open(ProfilComponent, {
      width: "650px",
      minHeight: "500px",
      panelClass: "custom-dialog",
    });

    dialog.afterClosed().subscribe((updated) => {
      if (updated)
        this.api.getProfile().subscribe((data) => (this.api.profile = data));
    });
  }

  get abrefName() {
    return this.api.profile
      ? (this.api.profile.name as string).substring(0, 2).toUpperCase()
      : "";
  }

  get profilePicture() {
    return this.api.profile && this.api.profile.profilePicture;
  }

  openNotificationDialog() {
    this.dialog.open(NotificationDialogComponent, {
      width: "550px",
      position: { right: "10px", top: "100px" },
      data: this.notifList,
    });
  }
  openNotifications() {
    const dialog = this.dialog.open(NotificationDialogComponent, {
      width: "650px",
      minHeight: "500px",
      panelClass: "custom-dialog",
    });
  }

  manageProfile() {
    this.dialog.closeAll();
    const dialogH = this.dialog.open(ProfileElementComponent, {
      width: "80%",
      panelClass: "custom-dialog",
      data: {
        type: "share",
      },
      hasBackdrop: false,
    });
    dialogH.afterClosed().subscribe((data) => {});
  }
}
