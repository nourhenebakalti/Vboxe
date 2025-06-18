import { Injectable } from "@angular/core";
import { CalendarEvent } from "../pages/calendar/calendar/calendar.types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "./../../environments/environment";
import { User } from "../store/user.state";

export const url = environment.apiUrl;
@Injectable({
  providedIn: "root",
})
export class CalendarEventService {
  constructor(private httpClient: HttpClient) {}

  public addEvent(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    return this.httpClient.post<CalendarEvent>(
      `${url}event/add`,
      calendarEvent
    );
  }

  public updateEvent(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    return this.httpClient.patch<CalendarEvent>(
      `${url}event/update`,
      calendarEvent
    );
  }

  public getAllEvent(): Observable<CalendarEvent[]> {
    return this.httpClient.get<CalendarEvent[]>(`${url}event/all`);
  }

  public getEvent(id: string): Observable<CalendarEvent> {
    return this.httpClient.get<CalendarEvent>(`${url}event/find/${id}`);
  }

  public findbyattendant(id: string): Observable<CalendarEvent[]> {
    return this.httpClient.get<CalendarEvent[]>(`${url}event/find`, {
      params: { id },
    });
  }
  findAllattdesc(user: string): Observable<any> {
    return this.httpClient.get<any>(`${url}event/findall`, {
      params: { user },
    });
  }
  public myEvents(): Observable<CalendarEvent[]> {
    return this.httpClient.get<CalendarEvent[]>(`${url}event/findall/my`);
  }

  public getNamesInvites(listId: string[]): Observable<string[]> {
    return this.httpClient.post<string[]>(`${url}event/usersname`, listId);
  }
  public deleteEvent(idEvent: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${url}event/delete/${idEvent}`);
  }

  public getUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${url}event/getUserAuth/${username}`);
  }
}
