import { Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { environment } from "./../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, BehaviorSubject, Observable } from "rxjs";
import { FileResponse } from "../utils/FileResponse";
import { Share } from "../models/share.model";
import { NotifInfo } from "../utils/NotifInfo";
import { MoveEntityRequest } from "../pages/my-vbox/components/deplacer-elmnt-boxe/MoveEntityRequest";
import { IpServiceService } from "../ip-service.service";
import { ShareRequest } from "../pages/my-vbox/components/partage-elment/component/ShareRequest";

export const url = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class VboxApiService {
  public profile;
  private total: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public ipInfo: any;
  user: any;
  userId: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ipService: IpServiceService
  ) {}

  public getTotal() {
    return this.total.asObservable();
  }

  getFolderContent(idFolder, password = "", isCurrent = "", inSafety = false) {
    return this.http.get(
      `${url}folder/allContent/${idFolder}?password=${password}&isCurrent=${isCurrent}&inSafety=${inSafety}`,
      {
        observe: "response",
      }
    );
  }

  authenticateLink(username: string, password: string) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return this.http
      .post(
        `${url}authenticateLink`,
        { username, password },
        { observe: "response" }
      )
      .pipe(
        map((data: any) => {
          if (data && data.body.token.AccessToken) {
            localStorage.setItem("accessToken", data.body.token.AccessToken);
            localStorage.setItem("refreshToken", data.body.token.RefreshToken);
            localStorage.setItem("temporary", data.body.temporary);

            // Fetch user profile after successful authentication
            this.getProfile().subscribe((profile: any) => {
              this.user = profile;
              this.userId = profile.id;

              // Fetch IP info and create an appointment
              this.ipService.getIpInfo().subscribe(
                (ipData: any) => {
                  this.ipInfo = ipData;
                  console.log("IP Info:", this.ipInfo);

                  const appointment = {
                    user: this.user,
                    ipAddress: ipData.query,
                    addressFromIp: ipData.country,
                  };

                  console.log("Appointment:", appointment);

                  this.ipService.addAppointment(appointment).subscribe({
                    next: (response) => {
                      console.log("Appointment added successfully", response);
                    },
                    error: (error) => {
                      console.error("Error adding appointment", error);
                    },
                  });
                },
                (error) => {
                  console.error("Error fetching IP info", error);
                }
              );
            });

            return true;
          }
          return false;
        })
      );
  }


  fileUpdateParentForlder(idFile: string, folderid: string) {
    return this.http.put(`${url}file/update/folderid?id=${idFile}&folder_id=${folderid}`, {id: idFile, folder_id: folderid});
  }

  folderUpdateParentForlder(id: string, folderid: string) {
    return this.http.put(`${url}folder/update/parent_folder?id=${id}&folder_id=${folderid}`, {id: id, folder_id: folderid});
  }
  authenticate(username: string, password: string) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return this.http
      .post(
        `${url}authenticate`,
        { username, password },
        { observe: "response" }
      )
      .pipe(
        map((data: any) => {
          if (data && data.body.token.AccessToken) {
            localStorage.setItem("accessToken", data.body.token.AccessToken);
            localStorage.setItem("refreshToken", data.body.token.RefreshToken);
            localStorage.setItem("temporary", data.body.temporary);

            // Fetch user profile after successful authentication
            this.getProfile().subscribe((profile: any) => {
              this.user = profile;
              this.userId = profile.id;

              // Fetch IP info and create an appointment
              this.ipService.getIpInfo().subscribe(
                (ipData: any) => {
                  this.ipInfo = ipData;
                  console.log("IP Info:", this.ipInfo);

                  const appointment = {
                    user: this.user,
                    ipAddress: ipData.query,
                    addressFromIp: ipData.country,
                  };

                  console.log("Appointment:", appointment);

                  this.ipService.addAppointment(appointment).subscribe({
                    next: (response) => {
                      console.log("Appointment added successfully", response);
                    },
                    error: (error) => {
                      console.error("Error adding appointment", error);
                    },
                  });
                },
                (error) => {
                  console.error("Error fetching IP info", error);
                }
              );
            });

            return true;
          }
          return false;
        })
      );
  }

  getFileById(id): Observable<FileResponse> {
    return this.http.get<FileResponse>(`${url}file/find/${id}`);
  }

  downloadFile(id, password = null) {
    return this.http.get(`${url}file/download?id=${id}&password=${password}`, {
      responseType: "blob",
      observe: "response",
    });
  }

  downloadFolder(id, password = null) {
    return this.http.get(
      `${url}folder/download?id=${id}&password=${password}`,
      {
        responseType: "blob",
        observe: "response",
      }
    );
  }

  registerUser(email, password, name, tel) {
    return this.http.post(`${url}register`, {
      username: email,
      password: password,
      name: name,
      tel: tel,
      role: "ROLE_USER",
    });
  }

  registerUserProfile(email, password, name, tel, deletionHours) {
    return this.http.post(`${url}registerProfile`, {
      username: email,
      password: password,
      name: name,
      tel: tel,
      role: "ROLE_USER",
      deletionHours: deletionHours,
    });
  }
  fetchAuthenticatedUser() {
    return this.http.get(`${url}userauth`);
  }

  registerAdmin(email, password, name, tel) {
    return this.http.post(`${url}register`, {
      username: email,
      password: password,
      name: name,
      tel: tel,
      role: "ROLE_ADMIN",
    });
  }

  addFolder(folderName, idParent = "", inSafety = false) {
    const formdata = new FormData();
    formdata.append("folderName", folderName);
    formdata.append("idparent", idParent);
    formdata.append("inSafety", inSafety.toString());
    return this.http.post(`${url}folder/add`, formdata, {
      observe: "events",
    });
  }

  addFiles(files, idFolder = "", inSafety = false) {
    const formdata = new FormData();
    files.forEach((file) => {
      formdata.append("files", file, file.name);
    });
    formdata.append("idFolder", idFolder);
    formdata.append("inSafety", inSafety.toString());
    return this.http.post(`${url}file/upload`, formdata, {
      observe: "events",
    });
  }

  chiffrerService(files, idFolder = "") {
    const formdata = new FormData();
    files.forEach((file) => {
      formdata.append("files", file, file.name);
    });
    formdata.append("idFolder", idFolder);

    return this.http.post(`${url}file/chiffrer`, formdata, {
      observe: "events",
    });
  }
  dechiffrerFichier(idFile: string) {
    return this.http.post(`${url}file/dechiffrer/${idFile}`, null); // null si aucun corps de requête n'est nécessaire
  }
  logout() {
    return this.http.delete(`${url}session/logout`);
  }

  getProfile() {
    return this.http.get(`${url}profileInfo`);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const formdata = new FormData();
      formdata.append("refreshToken", refreshToken);
      return this.http.post(`${url}refreshTokens`, formdata);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.router.navigate(["/"]);
    return of(null);
  }

  updateUser(user) {
    return this.http.put(`${url}update`, user, {
      observe: "events",
    });
  }

  getAllFriends() {
    return this.http.get(`${url}friend/allFriends`);
  }
  getAllUsers() {
    return this.http.get(`${url}friend/allUsers`);
  }

  deleteProfile(idUser: string) {
    return this.http.delete(`${url}users/delete/${idUser}`);
  }

  getFriendsForShare(idDoc: string) {
    return this.http.get(`${url}friend/allFriendsforshare/${idDoc}`);
  }

  deleteFriend(idFriend) {
    return this.http.delete(`${url}friend/delete/${idFriend}`, {
      observe: "events",
    });
  }

  searchFriends(word) {
    return this.http.get(`${url}friend/search/${word}`);
  }

  addFriend(id) {
    const formdata = new FormData();
    formdata.append("user", id);
    return this.http.post(`${url}friend/add`, formdata);
  }

  deleteFile(id) {
    return this.http.delete(`${url}file/delete/${id}`, {
      observe: "events",
    });
  }

  protectFile(id, password) {
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("password", password);
    return this.http.put(`${url}file/protect`, formdata, {
      observe: "events",
    });
  }

  protectFolder(id, password) {
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("password", password);
    return this.http.put(`${url}folder/protect`, formdata, {
      observe: "events",
    });
  }

  shareDocument(data: ShareRequest, id, type) {
    const formdata = new FormData();
    // formdata.append("document", id);
    // formdata.append("type", type);
    const params = { document: id, type: type };
    return this.http.post(`${url}share/add`, data, { params });
  }

  getFolderShared() {
    return this.http.get(`${url}share/sharedDocuments`);
  }

  getFileShared() {
    return this.http.get(`${url}share/sharedFiles`);
  }

  getallShared(inSafety: any) {
    return this.http.get(`${url}share/allShared?inSafety=${inSafety}`);
  }

  inprotectFolder(id, password) {
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("password", password);
    return this.http.put(`${url}folder/inprotect`, formdata, {
      observe: "events",
    });
  }
  delereFolder(id) {
    return this.http.delete(`${url}folder/delete/${id}`, {
      observe: "events",
    });
  }
  inprotectFile(id, password) {
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("password", password);
    return this.http.put(`${url}file/inprotect`, formdata, {
      observe: "events",
    });
  }

  getTotalSize() {
    this.http
      .get(`${url}file/total`)
      .pipe(take(1))
      .subscribe((total: any) => {
        this.total.next(total);
      });
  }

  getallSharedByUser() {
    return this.http.get<Share[]>(`${url}share/allShare`);
  }
  deleteShared(id: string) {
    let params = new HttpParams().set("id", id);
    return this.http.delete(`${url}share/delete`, { params });
  }

  getStorageSize() {
    return this.http.get<number>(`${url}file/limitSize`);
  }

  getAllFolders() {
    return this.http.get(`${url}folder/all`);
  }
  getFolderById(id) {
    return this.http.get(`${url}folder/find/${id}`);
  }
  getAllFileByIdFolder(id) {
    return this.http.get(`${url}file/folderfiles/${id}`);
  }
  getAllFolderByfolderParentId(id) {
    return this.http.get(`${url}folder/subfolders/${id}`);
  }

  updateFileFolderId(id: string, folderId: string): Observable<File> {
    const params = new HttpParams().set("id", id).set("folder_id", folderId);
    return this.http.put<File>(`${url}file/update/folderid`, {}, { params });
  }
  updateFolderIdParent(id: string, folderId: string): Observable<boolean> {
    const params = new HttpParams().set("id", id).set("idparent", folderId);
    return this.http.put<boolean>(
      `${url}folder/update/idParent`,
      {},
      { params }
    );
  }

  getNotifByUser1() {
    return this.http.get<NotifInfo[]>(`${url}notification/getmesnotif`);
  }

  deleteShare(iddoc: string) {
    let params = new HttpParams().set("iddoc", iddoc);
    return this.http.post<any>(`${url}share/khouloud`, params);
  }

  checkAccessMoveCode(idFile: string): Observable<boolean> {
    return this.http.post<boolean>(`${url}file/deplaceCode/${idFile}`, null);
  }
  checkAccessMoveCodeFolder(idFolder: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${url}folder/deplaceCode/${idFolder}`,
      null
    );
  }
  checkSecondVerifMoveFile(data: MoveEntityRequest): Observable<boolean> {
    return this.http.post<boolean>(`${url}file/deplaceCodeVerif`, data);
  }
  checkSecondVerifMoveFolder(data: MoveEntityRequest): Observable<boolean> {
    return this.http.post<boolean>(`${url}folder/deplaceCodeVerif`, data);
  }
  getNotifByUser() {
    return this.http.get<NotifInfo[]>(`${url}notification/my/all`);
  }
  getUserById(id: string) {
    return this.http.get(`${url}users/${id}`);
  }
  renameFile(id: string, name: string): Observable<boolean> {
    const params = new HttpParams().set("name", name);
    return this.http.post<boolean>(`${url}file/rename/${id}`, null, { params });
  }

  renameFolder(id: string, name: string): Observable<boolean> {
    const params = new HttpParams().set("name", name);
    return this.http.post<boolean>(`${url}folder/rename/${id}`, null, {
      params,
    });
  }
}
