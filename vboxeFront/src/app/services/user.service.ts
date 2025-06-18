import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

export const url = environment.apiUrl;
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserCount(day: number, year: number, month: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${url}count/user/all/connexion/${day}/${year}/${month}`
    );
  }
  getNombreUsers(): Observable<number> {
    return this.http.get<number>(`${url}users/nombreUsers`);
  }
  getNombreUsersDepuisMoisDernier(): Observable<number> {
    return this.http.get<number>(`${url}users/nbrUserDepuisMoisDernier`);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.get<any>(`${url}users/role/${userId}`, {
      params: { role },
    });
  }
  updatePassWord(userId: string, password: string): Observable<any> {
    return this.http.get<any>(`${url}users/update/password/${userId}`, {
      params: { password },
    });
  }
}
