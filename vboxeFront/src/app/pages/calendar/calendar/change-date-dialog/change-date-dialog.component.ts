import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { Time } from "@angular/common";
import { Notification } from "src/app/utils/Notification";
import { Details } from "src/app/utils/Details";
import { NotificationService } from "src/app/services/notification.service";
export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "MM/DD/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Component({
  selector: "app-change-date-dialog",
  templateUrl: "./change-date-dialog.component.html",
  styleUrls: ["./change-date-dialog.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class ChangeDateDialogComponent implements OnInit {
  confirmButtonText = "Save";
  cancelButtonText = "Cancel";
  startHour: Time;
  details: Details;
  proposeDateForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Notification,
    private dialogRef: MatDialogRef<ChangeDateDialogComponent>,
    private formBuilder: FormBuilder,
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.proposeDateForm = this.formBuilder.group({
      proposedDate: [null],
      startHour: [null],
    });
  }

  onConfirmClick(): void {
    this.details = this.proposeDateForm.value;
    this.data.details.proposedDate = this.concatination(
      new Date(this.details.proposedDate),
      this.startHour
    );
    this.data.details.confirmed = true;
    this.notifService.updateNotif(this.data).subscribe({
      next: (res) => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
        this.closeDialog();
        this.proposeDateForm.reset();
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
  concatination(date: Date, hour: Time): any {
    const currentDate = new Date();
    const recentDate = new Date(date);

    if (hour != null) {
      const [hours, minutes]: any = (hour + "").split(":");
      currentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    if (hour == null) {
      const [hours, minutes] = [
        currentDate.getHours().toString(),
        currentDate.getHours().toString(),
      ];
      currentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    recentDate.setHours(currentDate.getHours());
    recentDate.setMinutes(currentDate.getMinutes());
    return recentDate.toISOString();
  }
}
