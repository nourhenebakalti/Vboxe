import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CalendarEventService } from "src/app/services/calendar-event.service";
import { CalendarEvent } from "../calendar.types";
import { Time } from "@angular/common";
import { User } from "../add-event/add-event.component";
import { VboxApiService } from "src/app/services/vbox-api.service";

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
})
export class EditEventComponent implements OnInit {
  event: CalendarEvent;
  existingEventData: CalendarEvent;
  startHour: string;
  endHour: string;
  friends = [];
  editForm: FormGroup;
  attendents = new FormControl("");
  users: User[];
  endTime: any;
  allDay: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditEventComponent>,
    private _formBuilder: FormBuilder,
    private router: Router,
    private apiCalendar: CalendarEventService,
    private api: VboxApiService,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent
  ) {}

  ngOnInit(): void {
    this.api.getAllFriends().subscribe((data: any) => {
      if (data.results) {
        this.users = data.results;
      }
    });
    this.existingEventData = this.data;
    // Conversion de la date de début au format "HH:mm"
    const startTime = new Date(this.existingEventData.start);
    const startHour = ("0" + startTime.getHours()).slice(-2); // Ajoute un zéro en tête si nécessaire
    const startMinute = ("0" + startTime.getMinutes()).slice(-2); // Ajoute un zéro en tête si nécessaire
    this.startHour = `${startHour}:${startMinute}`;

    // Conversion de la date de fin au format "HH:mm"
    const endTime = new Date(this.existingEventData.end);
    const endHour = ("0" + endTime.getHours()).slice(-2); // Ajoute un zéro en tête si nécessaire
    const endMinute = ("0" + endTime.getMinutes()).slice(-2); // Ajoute un zéro en tête si nécessaire
    this.endHour = `${endHour}:${endMinute}`;

    this.allDay = this.existingEventData.allDay;
    this.editForm = this._formBuilder.group({
      id: [this.existingEventData.id], // Remplacez existingEventData.id par la valeur appropriée
      calendarId: [this.existingEventData.calendarId],
      recurringEventId: [this.existingEventData.recurringEventId],
      attendents: [this.existingEventData.attendents],
      title: [this.existingEventData.title],
      description: [this.existingEventData.description],
      start: [this.existingEventData.start],
      startHour: [this.startHour],
      end: [this.existingEventData.end],
      endHour: [this.endHour],
      allDay: [this.allDay],
      recurrence: [this.existingEventData.recurrence],
    });
  }

  toggleEndDate() {
    this.allDay = !this.allDay;
  }

  editEvent() {
    this.event = this.editForm.value;
    this.event.allDay = this.allDay;
    this.event.end = this.event.start;
    this.event.start = this.concatination(
      this.event.start,
      this.event.startHour
    );
    this.event.end = this.concatination(this.event.end, this.event.endHour);
    this.apiCalendar.updateEvent(this.event).subscribe({
      next: (res) => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
        this.closeEditEventDialog();
        this.editForm.reset();
      },
      error: (error) => {
        // Handle the error here
        console.error("An error occurred:", error);
        // You might want to display an error message or handle the error in some way
      },
    });
  }

  closeEditEventDialog() {
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
