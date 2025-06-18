import {
  Calendar,
  CalendarDrawerMode,
  CalendarEvent,
  CalendarEventEditMode,
  CalendarEventPanelMode,
  CalendarSettings,
} from "./calendar.types";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { DOCUMENT, DatePipe } from "@angular/common";
import { FormBuilder } from "@angular/forms";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from "@angular/material/sidenav";
import { CalendarOptions, EventInput, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Observable, Subject } from "rxjs";
import { Store } from "@ngxs/store";
import { AddCalendarEvent } from "src/app/store/event.state";
import { AddEventComponent } from "./add-event/add-event.component";
import { CalendarEventService } from "src/app/services/calendar-event.service";
import { EventDetailsDialogComponent } from "./event-details-dialog/event-details-dialog.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { NotificationService } from "src/app/services/notification.service";
import { Notification } from "src/app/utils/Notification";
import { ChangeDateDialogComponent } from "./change-date-dialog/change-date-dialog.component";
import { JwtHelperService } from "@auth0/angular-jwt";
@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild("drawer") private _drawer: MatDrawer;
  calendarPlugins: any[] = [
    dayGridPlugin,
    interactionPlugin,
    listPlugin,
    momentPlugin,
    rrulePlugin,
    timeGridPlugin,
  ];
  userTab: Notification[] = [];

  calendarOptions: CalendarOptions = {
    //plugins: [dayGridPlugin, interactionPlugin],
    plugins: this.calendarPlugins,
    initialView: "dayGridMonth",
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    weekends: true,
    selectable: true,
    events: [],
    eventTimeFormat: {
      // configurez le format de l'heure ici
      hour: "2-digit",
      minute: "2-digit",
      meridiem: true,
      hour12: true, // assurez-vous que cette option est définie sur true pour le format 12 heures
    },
    headerToolbar: {
      //left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
  };
  calendars: Calendar[];
  drawerMode: CalendarDrawerMode = "side";
  drawerOpened: boolean = true;
  event: CalendarEvent;
  eventEditMode: CalendarEventEditMode = "single";
  eventTimeFormat: any;
  Events: any[] = [];
  events: CalendarEvent[] = [];
  panelMode: CalendarEventPanelMode = "view";
  settings: CalendarSettings;
  view: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listYear" =
    "dayGridMonth";
  views: any;
  viewTitle: string;
  eventsPromise: Promise<EventInput>;
  private _eventPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @Input() pagedUserTab: Notification[];
  email: any;
  idUserConnected: any;
  /**
   * Constructor
   */
  constructor(
    private datePipe: DatePipe,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    private _formBuilder: FormBuilder,
    private eventService: CalendarEventService,
    private notificationService: NotificationService,
    private _matDialog: MatDialog,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private store: Store
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const token = localStorage.getItem("accessToken");
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    this.email = decoded.sub;
    this.getIdUser(this.email);

    this.getAllMyEvents().subscribe((calendarEvents: CalendarEvent[]) => {
      // Transformez les objets CalendarEvent en objets EventInput pour les utiliser avec FullCalendar
      this.events = calendarEvents;
      this._changeDetectorRef.detectChanges();
    });

    this.myNotif().subscribe((notifications: Notification[]) => {
      this.userTab = notifications;
      this._changeDetectorRef.detectChanges();
    });
  }
  getIdUser(username: string) {
    this.eventService.getUserByUsername(username).subscribe((result: any) => {
      if (result) {
        this.idUserConnected = result.id;
      }
    });
  }
  // je veux le changer   apres pour avoir travailler avec le ngxs technology
  getAllEvents(): Observable<CalendarEvent[]> {
    return this.eventService.getAllEvent();
  }
  //getEvent
  getEventById(id: string): Observable<CalendarEvent> {
    return this.eventService.getEvent(id);
  }
  getAllMyEvents(): Observable<CalendarEvent[]> {
    return this.eventService.myEvents();
  }
  // Notification
  myNotif(): Observable<Notification[]> {
    return this.notificationService.myNotif();
  }

  public childData(notif: Notification): void {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        notif,
        message: "Are you sure you want to confirm?",
        buttonText: {
          ok: "Yes",
          cancel: "No",
        },
      },
    });
  }

  public childChangeDate(notif: Notification): void {
    const dialogRef = this._matDialog.open(ChangeDateDialogComponent, {
      height: "320px",
      width: "450px",
      data: notif,
    });
  }
  /**
   * After view init
   */

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.complete();

    // Dispose the overlay
    if (this._eventPanelOverlayRef) {
      this._eventPanelOverlayRef.dispose();
    }
  }

  //

  handleDateClick() {
    this.openDialog();
  }
  openDialog() {
    this._matDialog.open(AddEventComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false, // to remove difference opacitie enter the dialog and the background.
    });
  }
  handleEventClick(clickInfo: EventClickArg) {
    // 'clickInfo' contient des informations sur l'événement cliqué, y compris les détails de l'événement.
    this.getEventById(clickInfo.event._def.publicId).subscribe(
      (calendarEvents: CalendarEvent) => {
        this.openEventDetailsDialog(calendarEvents);
      }
    );
  }

  openEventDetailsDialog(event: CalendarEvent) {
    this._matDialog.open(EventDetailsDialogComponent, {
      height: "480px",
      width: "430px",
      hasBackdrop: false,
      data: event,
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Drawer
   */
  toggleDrawer(): void {
    // Toggle the drawer
    this._drawer.toggle();
  }

  /**
   * Open recurrence panel
   */

  /**
   * Change the event panel mode between view and edit
   * mode while setting the event edit mode
   *
   * @param panelMode
   * @param eventEditMode
   */
  changeEventPanelMode(
    panelMode: CalendarEventPanelMode,
    eventEditMode: CalendarEventEditMode = "single"
  ): void {
    // Set the panel mode
    this.panelMode = panelMode;

    // Set the event edit mode
    this.eventEditMode = eventEditMode;

    // Update the panel position
    setTimeout(() => {
      this._eventPanelOverlayRef.updatePosition();
    });
  }

  /**
   * On date click
   *
   * @param calendarEvent
   */
  onDateClick(calendarEvent): void {
    calendarEvent.el = calendarEvent.dayEl;
  }

  /**
   * On event click
   *
   * @param calendarEvent
   */

  /**
   * On event render
   *
   * @param calendarEvent
   */
  onEventRender(calendarEvent): void {
    // Get event's calendar
    const calendar = this.calendars.find(
      (item) => item.id === calendarEvent.event.extendedProps.calendarId
    );

    // Return if the calendar doesn't exist...
    if (!calendar) {
      return;
    }

    // If current view is year list...
    // if (this.view === "listYear") {
    //   // Create a new 'fc-list-item-date' node
    //   const fcListItemDate1 = `<td class="fc-list-item-date">
    //                                           <span>
    //                                               <span>${moment(
    //                                                 calendarEvent.event.start
    //                                               ).format("D")}</span>
    //                                               <span>${moment(
    //                                                 calendarEvent.event.start
    //                                               ).format("MMM")}, ${moment(
    //     calendarEvent.event.start
    //   ).format("ddd")}</span>
    //                                           </span>
    //                                       </td>`;

    //   // Insert the 'fc-list-item-date' into the calendar event element
    //   calendarEvent.el.insertAdjacentHTML("afterbegin", fcListItemDate1);

    //   // Set the color class of the event dot
    //   calendarEvent.el
    //     .getElementsByClassName("fc-event-dot")[0]
    //     .classList.add(calendar.color);

    //   // Set the event's title to '(No title)' if event title is not available
    //   if (!calendarEvent.event.title) {
    //     calendarEvent.el.querySelector(".fc-list-item-title").innerText =
    //       "(No title)";
    //   }
    // }
    // If current view is not month list...
    else {
      // Set the color class of the event
      calendarEvent.el.classList.add(calendar.color);

      // Set the event's title to '(No title)' if event title is not available
      if (!calendarEvent.event.title) {
        calendarEvent.el.querySelector(".fc-title").innerText = "(No title)";
      }
    }

    // Set the event's visibility
    calendarEvent.el.style.display = calendar.visible ? "flex" : "none";
  }

  /**
   * On calendar updated
   *
   * @param calendar
   */

  /**
   * Add event
   */
  addEvent(eventData: CalendarEvent) {
    this.store.dispatch(new AddCalendarEvent(eventData));
  }

  /**
   * Delete the given event
   *
   * @param event
   * @param mode
   */

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create the event panel overlay
   *
   * @private
   */

  /**
   * Open the event panel
   *
   * @private
   */

  /**
   * Close the event panel
   *
   * @private
   */

  /**
   * Update the end value based on the recurrence and duration
   *
   * @private
   */
}
