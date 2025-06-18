import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Notification } from "../utils/Notification";
export const url = environment.apiUrl;
@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  public myNotif(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${url}notification/my/all`);
  }


  public updateNotif(notification: Notification): Observable<Notification> {
    return this.httpClient.post<Notification>(
      `${url}notification/update`,
      notification
    );
  }
 
  
}
