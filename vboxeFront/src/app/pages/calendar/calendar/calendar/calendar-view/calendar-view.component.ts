import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { FullCalendarComponent } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OverlayRef } from "@angular/cdk/overlay";
import {
  CalendarOptions,
  EventClickArg,
  Calendar as FullCalendar,
} from "@fullcalendar/core";
import { Observable, Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import {
  Calendar,
  CalendarDrawerMode,
  CalendarEvent,
  CalendarEventEditMode,
  CalendarEventPanelMode,
  CalendarSettings,
} from "../../calendar.types";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { EventDetailsDialogComponent } from "../../event-details-dialog/event-details-dialog.component";
import { CalendarEventService } from "src/app/services/calendar-event.service";
import { AddEventComponent } from "../../add-event/add-event.component";
import { NotificationService } from "src/app/services/notification.service";
import { Notification } from "src/app/utils/Notification";

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class CalendarViewComponent implements OnInit {
  @ViewChild("fullCalendar") private _fullCalendar: FullCalendarComponent;
  @ViewChild("drawer") private _drawer: MatDrawer;

  calendars: Calendar[];
  calendarPlugins: any[] = [
    dayGridPlugin,
    interactionPlugin,
    listPlugin,
    momentPlugin,
    rrulePlugin,
    timeGridPlugin,
  ];
  drawerMode: CalendarDrawerMode = "side";
  drawerOpened: boolean = true;
  event: CalendarEvent;
  eventEditMode: CalendarEventEditMode = "single";
  eventForm: FormGroup;
  eventTimeFormat: any;
  events: CalendarEvent[] = [];
  panelMode: CalendarEventPanelMode = "view";
  settings: CalendarSettings;
  view: "timeGridWeek" | "dayGridMonth" | "timeGridDay" | "listYear" =
    "dayGridMonth";
  views: any;
  currentMounth: any;
  initialViewIsMounth: boolean = true;
  viewTitle: string;
  dateRrange: string;
  weekNum: string;
  private _eventPanelOverlayRef: OverlayRef;
  private _fullCalendarApi: FullCalendar;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  calendarOptions: CalendarOptions;
  userTab: Notification[] = [];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    private eventService: CalendarEventService,
    private notificationService: NotificationService
  ) {
    this._matIconRegistry.addSvgIconSetInNamespace(
      "heroicons_outline",
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/heroicons-outline.svg"
      )
    );
    this._matIconRegistry.addSvgIconSetInNamespace(
      "heroicons_solid",
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/heroicons-solid.svg"
      )
    );

    // Build the view specific FullCalendar options
    this.views = {
      dayGridMonth: {
        eventTimeFormat: this.eventTimeFormat,
        dayHeaderFormat: { weekday: "long" },
        fixedWeekCount: false,
      },
      timeGrid: {
        allDayText: "",
        slotDuration: "01:00:00",
        slotLabelFormat: this.eventTimeFormat,
      },
      timeGridWeek: {
        slotLabelFormat: {
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: true,
          meridiem: "short", // Permet d'afficher 'AM' ou 'PM'
          hour12: true, // Pour utiliser le format 12 heures au lieu de 24 heures
        },

        slotLabelContent: function (args) {
          // Récupère l'heure et le méridien (AM/PM) à partir du texte d'origine
          const time = args.text; // Ex : "12AM" ou "3PM"

          // Utilisation d'une expression régulière pour séparer l'heure du méridien
          const regex = /(\d+)([a-zA-Z]+)/; // Sépare les chiffres de la partie alphabétique (AM/PM)
          const match = time.match(regex);

          if (match) {
            const hour = match[1]; // L'heure, par ex. "12"
            const meridiem = match[2].toUpperCase(); // AM ou PM, en majuscules

            // Retourne le texte modifié avec un espace supplémentaire entre l'heure et le méridien
            return {
              html: hour + " " + meridiem, // Ex : '12 AM'
            };
          } else {
            // Retourne le texte d'origine si aucune correspondance
            return { html: time };
          }
        },
        dayHeaderContent: function (args) {
          // Récupère le jour et la date
          const day = args.date.toLocaleDateString("en-US", {
            weekday: "short",
          }); // Ex: Sun
          const date = args.date.getDate(); // Ex: 22

          // Crée un élément div pour encapsuler le jour et la date
          const div = document.createElement("div");

          // Crée un élément span pour le jour
          const daySpan = document.createElement("span");
          daySpan.textContent = day;

          // Crée un élément span pour la date avec un style plus grand
          const dateSpan = document.createElement("span");
          dateSpan.textContent = date;
          dateSpan.style.fontSize = "20px"; // Change la taille ici selon tes besoins
          dateSpan.style.color = "black";
          dateSpan.style.fontWeight = "400";
          // Ajoute les deux éléments au div
          div.appendChild(daySpan);
          div.appendChild(document.createElement("br")); // Saut de ligne entre le jour et la date
          div.appendChild(dateSpan);

          // Retourne l'élément div comme contenu
          return { html: div.innerHTML };
        },
      },
      timeGridDay: {
        slotLabelContent: function (args) {
          // Récupère l'heure et le méridien (AM/PM) à partir du texte d'origine
          const time = args.text; // Ex : "12AM" ou "3PM"

          // Utilisation d'une expression régulière pour séparer l'heure du méridien
          const regex = /(\d+)([a-zA-Z]+)/; // Sépare les chiffres de la partie alphabétique (AM/PM)
          const match = time.match(regex);

          if (match) {
            const hour = match[1]; // L'heure, par ex. "12"
            const meridiem = match[2].toUpperCase(); // AM ou PM, en majuscules

            // Retourne le texte modifié avec un espace supplémentaire entre l'heure et le méridien
            return {
              html: hour + " " + meridiem, // Ex : '12 AM'
            };
          } else {
            // Retourne le texte d'origine si aucune correspondance
            return { html: time };
          }
        },
        dayHeaderContent: function (args) {
          // Récupère le jour de la semaine et le jour du mois
          const day = args.date.toLocaleDateString("en-US", {
            weekday: "long",
          }); // Ex: Friday
          const date = args.date.getDate(); // Ex: 22

          // Retourne le format "Friday 22"
          return day + " " + date;
        },
      },
      listYear: {
        allDayText: "All day",
        eventTimeFormat: this.eventTimeFormat,
        listDayFormat: false,
      },
    };
    // ajouter par moi
    this.calendarOptions = {
      plugins: this.calendarPlugins,
      initialView: "dayGridMonth",
      views: this.views,
      weekends: true,
      selectable: true,
      events: [],
      dateClick: this.onDateClick.bind(this),
      eventClick: this.onEventClick.bind(this),
      // eventContent:this.onEventRender.bind(this),
      headerToolbar: {
        left: "", // Remove 'prev' and 'next' buttons from the left section
        center: "", // Keep the title in the center
        right: "", // You can add other buttons here if needed, like 'dayGridMonth,timeGridWeek,timeGridDay'
      },
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getAllMyEvents().subscribe((calendarEvents: CalendarEvent[]) => {
      this.events = calendarEvents;
      this._changeDetectorRef.detectChanges();
    });

    this.myNotif().subscribe((notifications: Notification[]) => {
      this.userTab = notifications;
      this._changeDetectorRef.detectChanges();
    });

    this.eventForm = this._formBuilder.group({
      id: [""],
      calendarId: [""],
      recurringEventId: [null],
      title: [""],
      description: [""],
      start: [null],
      end: [null],
      duration: [null],
      allDay: [true],
      recurrence: [null],
      range: [{}],
    });
  }

  getAllMyEvents(): Observable<CalendarEvent[]> {
    return this.eventService.myEvents();
  }
  // Notification
  myNotif(): Observable<Notification[]> {
    return this.notificationService.myNotif();
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._fullCalendar) {
      // Get the full calendar API
      this._fullCalendarApi = this._fullCalendar.getApi();
      // Utiliser le formatteur pour convertir la date en "Septembre 2024"
      this.viewTitle = this._fullCalendarApi.view.title;
      const num = this.getWeekNumber(this._fullCalendarApi.view.currentStart);
      this.weekNum = "Week n : " + num;
      this.currentMounth = this.viewTitle;
    } else {
      console.warn("FullCalendar component is not yet initialized");
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    // Dispose the overlay
    if (this._eventPanelOverlayRef) {
      this._eventPanelOverlayRef.dispose();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Change the calendar view
   *
   * @param view
   */
  changeView(
    view: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listYear"
  ): void {
    // Store the view
    this.view = view;

    // If the FullCalendar API is available...
    if (this._fullCalendarApi) {
      this._fullCalendarApi.changeView(view);

      // Get the current view's title title.match(/[A-Za-z]+ \d{4}/);
      this.updateDateRange(this._fullCalendarApi);
    }
  }

  updateDateRange(calendarApi: FullCalendar) {
    const monthName = new Intl.DateTimeFormat("en", { month: "long" }).format(
      calendarApi.view.currentStart
    );
    this.currentMounth =
      monthName + " " + calendarApi.view.currentStart.getFullYear();

    if (calendarApi.view.type == "timeGridWeek") {
      const num = this.getWeekNumber(calendarApi.view.currentStart);
      this.weekNum = "Week n : " + num;

      this.dateRrange = this.extractDateRange(calendarApi.view.title);
      this.initialViewIsMounth = false;
    }
    if (calendarApi.view.type == "timeGridDay") {
      this.initialViewIsMounth = false;
      const parts = calendarApi.view.title.split(" ");

      this.dateRrange = parts[1].replace(",", ""); // Extract "22"
    }
    if (calendarApi.view.type == "dayGridMonth") {
      const num = this.getWeekNumber(calendarApi.view.currentStart);
      this.weekNum = "Week n : " + num;
      this.initialViewIsMounth = true;
    }
  }
  extractDateRange(input: string): string {
    // Cas 1: Extrait le format "Oct 27 – Nov 2"
    const pattern1 = /(\w{3} \d{1,2} – \w{3} \d{1,2})/;
    const match1 = input.match(pattern1);

    if (match1) {
      return match1[1];
    }

    // Cas 2: Extrait le format "22 – 28"
    const pattern2 = /(\d{1,2} – \d{1,2})/;
    const match2 = input.match(pattern2);

    if (match2) {
      return match2[1];
    }

    return "Format non reconnu";
  }

  /**
   * Moves the calendar one stop back
   */
  previous(): void {
    // Go to previous stop
    this._fullCalendarApi.prev();
    // Update the view title
    this.updateDateRange(this._fullCalendarApi);
    // Get the view's current start date
    const start = moment(this._fullCalendarApi.view.currentStart);

    // Prefetch past events
    // je veux changer ca
  }

  /**
   * Moves the calendar one stop forward
   */
  next(): void {
    // Go to next stop
    this._fullCalendarApi.next();
    // Update the view title
    this.updateDateRange(this._fullCalendarApi);
    // Get the view's current end date
    //const end = moment(this._fullCalendarApi.view.currentEnd);
    // Prefetch future events
    // je veux changer ca
  }

  openEventDetailsDialog(event: CalendarEvent) {
    this._matDialog.open(EventDetailsDialogComponent, {
      height: "480px",
      width: "430px",
      hasBackdrop: false,
      data: event,
    });
  }

  //getEvent
  getEventById(id: string): Observable<CalendarEvent> {
    return this.eventService.getEvent(id);
  }

  /**
   * On date click
   *
   * @param calendarEvent
   */
  onDateClick(clickInfo: EventClickArg): void {
    this._matDialog.open(AddEventComponent, {
      height: "610px",
      width: "480px",
      hasBackdrop: false, // to remove difference opacitie enter the dialog and the background.
    });
  }

  /**
   * On event click
   *
   * @param calendarEvent
   */
  onEventClick(clickInfo: EventClickArg): void {
    this.getEventById(clickInfo.event._def.publicId).subscribe(
      (calendarEvents: CalendarEvent) => {
        this.openEventDetailsDialog(calendarEvents);
      }
    );
  }

  // Fonction pour obtenir le numéro de la semaine
  getWeekNumber(date: Date): number {
    // Copier la date pour ne pas la modifier
    const currentDate = new Date(date.getTime());

    // Définir le premier jour de l'année
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Calculer le nombre de jours entre la date actuelle et le premier jour de l'année
    const pastDaysOfYear =
      (currentDate.getTime() - firstDayOfYear.getTime()) / 86400000;

    // Retourner le numéro de la semaine
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
