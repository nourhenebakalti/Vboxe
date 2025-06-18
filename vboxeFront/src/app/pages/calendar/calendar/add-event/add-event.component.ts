import { Component, OnInit } from "@angular/core";
import { CalendarEvent } from "../calendar.types";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { CalendarEventService } from "src/app/services/calendar-event.service";
import { Router } from "@angular/router";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { Time } from "@angular/common";
import { MAT_DATE_FORMATS } from "@angular/material/core";

export interface User {
  _id: string;
  name: string;
}
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
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],

})
export class AddEventComponent implements OnInit {
  event: CalendarEvent;
  startHour: Time;
  endHour: Time;
  friends = [];
  eventForm: FormGroup;
  attendents = new FormControl("");
  users: User[];
  endTime: any;
  allDay: boolean = false;
  constructor(
    private api: VboxApiService,
    private dialogRef: MatDialogRef<AddEventComponent>,
    private _formBuilder: FormBuilder,
    private router: Router,
    private eventService: CalendarEventService
  ) {}

  ngOnInit(): void {
    this.api.getAllFriends().subscribe((data: any) => {
      if (data.results) {
        this.users = data.results;
      }
    });
    const currentDate = new Date();
    this.eventForm = this._formBuilder.group({
      id: null,
      calendarId: [""],
      recurringEventId: [null],
      attendents: [null],
      title: [""],
      description: [""],
      start: [currentDate],
      startHour: [null],
      end: [currentDate],
      endHour: [null],
      duration: [null],
      allDay: [null],
      recurrence: [null],
      range: [{}],
    });
  }
  toggleEndDate() {
    this.allDay = !this.allDay;
  }
  closeAddEventDialog() {
    this.dialogRef.close();
  }
  saveEvent() {
    this.event = this.eventForm.value;
    this.event.allDay = this.allDay;
    this.event.end = this.event.start;
    this.event.start = this.concatination(
      this.event.start,
      this.event.startHour
    );
    this.event.end = this.concatination(this.event.end, this.event.endHour);
    this.eventService.addEvent(this.event).subscribe({
      next: (res) => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
        this.closeAddEventDialog();
        this.eventForm.reset();
      },
      error: (error) => {
        // Handle the error here
        console.error("An error occurred:", error);
        // You might want to display an error message or handle the error in some way
      },
    });
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
