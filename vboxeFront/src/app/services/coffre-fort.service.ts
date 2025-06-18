import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../store/user.state';
import { AccessRequest } from '../pages/coffre-fort/accessRequest';
import { MoveEntityRequest } from '../pages/my-vbox/components/deplacer-elmnt-boxe/MoveEntityRequest';
export const url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CoffreFortService {

  constructor(private http: HttpClient) { }

  addPasswordCoffre(email: string, passwordCoffre: string): Observable<boolean> {
    const params = new HttpParams().set('email', email).set('passwordCoffre', passwordCoffre);
    return this.http.post<boolean>(`${url}coffre-fort/add-password`, params);
  }

  public getUserByUsername(username:string): Observable<User> {
    return this.http.get<User>(`${url}coffre-fort/getUserAuth/${username}`);
  }
  getData(username:string): Observable<boolean> {
    return this.http.get<boolean>(`${url}coffre-fort/getHaspassword/${username}`);
  }
  public getHasPassWord(username:string): Promise<boolean> {
    return firstValueFrom(this.getData(username));
  }
  checkAccess( data:AccessRequest):Observable<boolean> {
    return this.http.post<boolean>(
      `${url}coffre-fort/checkAccess`,data
    );
  }
  checkSecondVerif( data:AccessRequest):Observable<boolean> {
    return this.http.post<boolean>(
      `${url}coffre-fort/checkSecondVerif`,data
    );
  }
}
