import { Time } from "@angular/common";
import { detailsInfo } from "src/app/utils/detailsInfo";

export interface Calendar {
  id: string;
  title: string;
  color: string;
  visible: boolean;
}

export type CalendarDrawerMode = "over" | "side";

export interface CalendarEvent {
  id: string;
  calendarId: string;
  user: string;
  initiatorName:string;
  recurringEventId: string | null;
  attendents: string[] | null;
  isFirstInstance: boolean;
  confirmedGuestsList: detailsInfo[];
  unconfirmedGuestsList: detailsInfo[];
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
  startHour: Time;
  endHour: Time;
  allDay: boolean;
  recurrence: string;
}

export interface CalendarEventException {
  id: string;
  eventId: string;
  exdate: string;
}

export type CalendarEventPanelMode = "view" | "add" | "edit";
export type CalendarEventEditMode = "single" | "future" | "all";

export interface CalendarSettings {
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "ll";
  timeFormat: "12" | "24";
  startWeekOn: 6 | 0 | 1;
}

export interface CalendarWeekday {
  abbr: string;
  label: string;
  value: string;
}
