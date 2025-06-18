import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {
  private IpUrl = 'http://ip-api.com/json';  // URL de l'API ip-api
  private apiUrl = 'http://localhost:8080/api/appointments';
  constructor(private http: HttpClient) { }

  getIpInfo(): Observable<any> {
    return this.http.get(this.IpUrl);
  }
  addAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, appointment);
  }
  getAppointmentsByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
}