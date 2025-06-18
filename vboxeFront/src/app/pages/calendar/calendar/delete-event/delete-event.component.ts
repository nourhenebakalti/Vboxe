import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CalendarEventService } from "src/app/services/calendar-event.service";

@Component({
  selector: "app-delete-event",
  templateUrl: "./delete-event.component.html",
  styleUrls: ["./delete-event.component.scss"],
})
export class DeleteEventComponent implements OnInit {
  message: string = "Are you sure?";
  confirmButtonText = "Yes";
  cancelButtonText = "Cancel";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteEventComponent>,
    private apiCalendar: CalendarEventService,
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
  onDeleteClick(): void {
    // delete Service
    this.apiCalendar.deleteEvent(this.data.event.id).subscribe({
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
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate([currentUrl]);
    // });
    this.closeDialog();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
