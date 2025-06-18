import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { Notification } from "src/app/utils/Notification";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
})
export class ConfirmationDialogComponent implements OnInit {
  message: string = "Are you sure?";
  confirmButtonText = "Yes";
  cancelButtonText = "Cancel";
  notification: Notification;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private notifService: NotificationService,
    private router: Router
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  ngOnInit(): void {}
  onConfirmClick(): void {
    this.notification = this.data.notif;
    this.notification.details.confirmed = true;
    this.notifService.updateNotif(this.notification).subscribe({
      next: (res) => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
        this.closeDialog();
      },
      error: (error) => {
        // Handle the error here
        console.error("An error occurred:", error);
        // You might want to display an error message or handle the error in some way
      },
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
