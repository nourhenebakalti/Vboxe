import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export const url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  getNombreFiles(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    
    return this.http.get<number>(`${url}history/count/upload/all`, { params })
  }
  getNombreFilesDepuisMoisDernier(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/nbrFilesDepuisMoisDernier` , { params })
  }

  getNombreFolders(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/count/folder/all`, { params })
  }
  getNombreFoldersDepuisMoisDernier(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/nbrFoldersDepuisMoisDernier` , { params })
  }

  getPourcentPdf(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/count/extension/pdf`, { params })
  }
  getPourcentword(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/count/extension/docx`, { params })
  }

  getPourcentppt(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/count/extension/ppt`, { params })
  }
  getPourcentimages(id : string) : Observable<number>{
    let params = new HttpParams()
    .set('userId', id);
    return this.http.get<number>(`${url}history/count/extension/img`, { params })
  }
}
