import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
export const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private Baseurl:string =url+"api/messages"
  constructor(private http: HttpClient,
    ) { 
      url
    }

  createMessage(message: any) {
    const messageUrl: string = `${this.Baseurl}`;
    return this.http.post(messageUrl, message);
  }

  getmessages() {
    return this.http.get<Array<any>>(this.Baseurl);
  }
  getmessagesByReceiver(receiver:string) {
    return this.http.get<Array<any>>( `${this.Baseurl}/receiver/${receiver}`);
  }
  getmessagesBySender(sender:string) {
    return this.http.get<Array<any>>( `${this.Baseurl}/sender/${sender}`);
  }


  deletemessage(id: any) {
    return this.http.delete(`${this.Baseurl}/${id}`);
  }

  getmessageById(id: any) {
    return this.http.get<any>(`${this.Baseurl}/${id}`);
  }

  updatemessage(id: any, updatedData: any) {
    return this.http.put(`${this.Baseurl}/${id}`, updatedData);
  }
  uplomessage(data : any) {
    return this.http.post(`${this.Baseurl}/upload`, data);
  }
}