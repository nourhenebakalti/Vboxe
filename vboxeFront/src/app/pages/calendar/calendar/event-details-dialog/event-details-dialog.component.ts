import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { CalendarEvent } from "../calendar.types";
import { CalendarEventService } from "src/app/services/calendar-event.service";
import { EditEventComponent } from "../edit-event/edit-event.component";
import { DeleteEventComponent } from "../delete-event/delete-event.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
@Component({
  selector: "app-event-details-dialog",
  templateUrl: "./event-details-dialog.component.html",
  styleUrls: ["./event-details-dialog.component.scss"],
})
export class EventDetailsDialogComponent implements OnInit {
  @Output() editClicked: EventEmitter<void> = new EventEmitter<void>();
  idUser: string;

  showButtom: boolean = false;
  getAvatar(userName: string): string {
    // const emailHash = Md5.hashStr(userName.trim().toLowerCase());
    // return `https://www.gravatar.com/avatar/${emailHash}?s=200`;
    return null;
  }
  panelOpenState = new BehaviorSubject<boolean>(false); // Using a BehaviorSubject to manage the panel state
  // Optionally, you can handle logic in these methods if needed
  onPanelOpened() {
    this.panelOpenState.next(true); // Use next() to update the value
  }

  onPanelClosed() {
    this.panelOpenState.next(false); // Use next() to update the value
  }

  deleteEvent(event: CalendarEvent) {
    // open dialogue de confirmation
    this._matDialog.open(DeleteEventComponent, {
      data: {
        event,
        message: "Are you sure you want to delete?",
        buttonText: {
          ok: "Yes",
          cancel: "No",
        },
      },
    });
    this.dialogRef.close();
  }
  editEvent(event: CalendarEvent) {
    this._matDialog.open(EditEventComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false,
      data: event,
    });
    this.dialogRef.close();
  }
  public listNames: string[] = [];
  email: string;
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent,
    public eventService: CalendarEventService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem("accessToken");
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    this.email = decoded.sub;
    this.getUserByUsername(this.email);
    this.getNamesOfInvites(this.data.attendents);
  }

  getNamesOfInvites(listIds: string[]): any {
    this.eventService.getNamesInvites(listIds).subscribe((result: any) => {
      this.listNames = result;
    });
  }

  getUserByUsername(username: string) {
    this.eventService.getUserByUsername(username).subscribe((result: any) => {
      if (result.id == this.data.user) {
        this.showButtom = true;
      }
    });
  }
}
