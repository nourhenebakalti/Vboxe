import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { CoffreFortService } from "src/app/services/coffre-fort.service";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { MENU } from "src/app/shared/menu/menu.component";
import { User } from "src/app/store/user.state";
import { GetPasswordDialogComponent } from "../my-vbox/components/get-password-dialog/get-password-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { exportFile } from "src/app/utils/file-utils";
import { PdfViewerComponent } from "../my-vbox/components/pdf-viewer/pdf-viewer.component";
import { FileResponse } from "src/app/utils/FileResponse";
import { AddFilesDialogComponent } from "../my-vbox/components/add-files-dialog/add-files-dialog.component";
import { AddFolderDialogComponent } from "../my-vbox/components/add-folder-dialog/add-folder-dialog.component";
import { AddSafetyCodeComponent } from "./components/add-safety-code/add-safety-code.component";
import { AccessRequest } from "./accessRequest";
import { DeplacerElmntComponent } from "../my-vbox/components/deplacer-elmnt/deplacer-elmnt.component";
import { DeplacerElmntBoxeComponent } from "../my-vbox/components/deplacer-elmnt-boxe/deplacer-elmnt-boxe.component";
import { MoveEntityRequest } from "../my-vbox/components/deplacer-elmnt-boxe/MoveEntityRequest";
import { PartageElmentComponent } from "../my-vbox/components/partage-elment/partage-elment.component";
// export interface User {
//   _id: string;
//   name: string;
// }
@Component({
  selector: "app-coffre-fort",
  templateUrl: "./coffre-fort.component.html",
  styleUrls: ["./coffre-fort.component.scss"],
})
export class CoffreFortComponent implements OnInit {
  menuTopLeftPosition = { x: "0", y: "0" };
  selectedDigit: any | null = null;
  public selectedFile;
  public selectedFolder;
  page = "files";
  private destroy$ = new Subject();
  public content = null;

  emplacementActuel: any;
  idFile: any;
  hidePassword = true;

  @ViewChild("menu") menu: ElementRef;
  subMenus: Array<MENU> = [
    {
      picto: "my-vbox-folder",
      content: "MY_VBOX",
      link: "files",
    },
    {
      picto: "my-vbox-share",
      content: "MY_VBOX_SHARE",
      link: "share",
    },
    {
      picto: "my-vbox-clock",
      content: "MY_VBOX_MOST_RECENT",
      link: "most_recent",
    },
    {
      picto: "my-vbox-star",
      content: "MY_VBOX_FAVORITES",
      link: "favorites",
    },
    {
      picto: "my-vbox-trash",
      content: "MY_VBOX_TRASH",
      link: "trash",
    },
  ];

  formGroup: FormGroup;
  email: string;
  hasPasswordCoffre: boolean = null;
  confirmCodeInvalid: boolean = false;
  form: FormGroup;
  formIsValid: boolean = false;
  checkAccess: boolean = false;
  secondVerif: boolean = false;
  firstVerif: boolean = false;
  user: any;
  data: boolean;
  Object: any;
  dialogMove: any;
  dialogMoveSecond: any;
  constructor(
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private apiCoffreFort: CoffreFortService,
    public api: VboxApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private render: Renderer2
  ) {
    this.subMenus.forEach((menu) => {
      this.iconRegistery.addSvgIcon(
        menu.picto,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/" + menu.picto + ".svg"
        )
      );
    });

    this.form = new FormGroup({
      passcode: new FormControl("", [
        Validators.pattern("[0-9]*"),
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
    this.iconRegistery.addSvgIcon(
      "lock",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/accessCoffre/lock.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "folder-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/envelop.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "pdf-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/pdf.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file-trash-2",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-trash-2.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file-share",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-share.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file-download",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-download.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file-move",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-move.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "unlock",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/unlock.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "unlock2",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/unlock2.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file_any",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file_any.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file_doc",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file_doc.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "file_pptx",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/pptx.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file_excel",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file_excel.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "txtIcon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/txtIcon.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "chiffrer",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/chiffrer.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "file_img",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file_img.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "zip-file",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/zipfile.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "unlock-doc",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/unlock-doc.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "visibility",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/visibility.svg"
      )
    );
    this.formGroup = this.formBuilder.group({
      code: [
        "",
        [
          Validators.pattern("[0-9]*"),
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });
  }
  getFileIcon(name) {
    if (!name) return "file_any";
    const parseName = name.split(".");
    const ext = parseName[parseName.length - 1];
    if (ext === "doc" || ext === "docx" || ext === "odt") {
      return "file_doc";
    }
    if (ext === "pptx" || ext === "ppt") {
      return "file_pptx";
    }
    if (ext === "txt") {
      return "txtIcon";
    }

    if (ext === "xls" || ext === "xlsx") {
      return "file_excel";
    }

    if (ext === "pdf") {
      return "pdf-icon";
    }

    if (
      ext === "png" ||
      ext === "PNG" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "gif" ||
      ext === "bmp" ||
      ext === "tiff"
    ) {
      return "file_img";
    }
    if (ext === "zip") {
      return "zip-file";
    }

    return "file_any";
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((page) => {
      this.page = page["id"];
      if (this.page === "files" || this.page === "share") {
        this.getFolderContent("");
      }
    });

    const token = localStorage.getItem("accessToken");
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    this.email = decoded.sub;
    try {
      this.data = await this.apiCoffreFort.getHasPassWord(this.email);

      this.hasPasswordCoffre = this.data;
      // Vous pouvez maintenant utiliser this.data en toute sécurité ici
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
    if (this.hasPasswordCoffre !== null && !this.hasPasswordCoffre) {
      this.openCodeDialog(this.email);
    }
  }
  receiveData(data: any) {
    this.hasPasswordCoffre = data;
  }

  onValidPassCode() {
    if (this.form.valid) {
      let data: AccessRequest = new AccessRequest(
        this.email,
        this.form.value.passcode,
        null
      );

      this.apiCoffreFort.checkAccess(data).subscribe((value) => {
        this.firstVerif = value;
      });
    }
  }
  onSubmit(): void {
    // Valider le code
    if (this.formGroup.valid) {
      // Envoyer le code et accéder au coffre-fort
      let data: AccessRequest = new AccessRequest(
        this.email,
        null,
        this.formGroup.value.code
      );
      this.apiCoffreFort.checkSecondVerif(data).subscribe((value) => {
        this.secondVerif = value;
        this.checkAccess = value;
      });
    }
  }
  getUserByUsername(username: string) {
    this.apiCoffreFort.getUserByUsername(username).subscribe((result: User) => {
      this.hasPasswordCoffre = result.hasPasswordCoffre;
    });
  }
  // async getUserByUsername(email: string): Promise<void> {
  //   try {
  //      this.user = await this.apiCoffreFort.getUserByUsername(email);
  //     this.hasPasswordCoffre = this.user.hasPasswordCoffre;
  //   } catch (error) {
  //     console.error("Error getting user by username:", error);
  //   }
  // }
  validateInput(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener("click", ["$event"])
  click(event) {
    if (
      event.target.className !== "menu" &&
      event.target.className !== "menu-item"
    ) {
      this.hideMenu();
      if (
        typeof event.target.className === "string" &&
        (event.target.className.indexOf("content") > -1 ||
          event.target.className.indexOf("container") > -1)
      ) {
        this.selectedFile = null;
        this.selectedFolder = null;
      }
    }
  }

  addDigit(digit: any) {
    const currentPasscode = this.form.get("passcode").value;
    const updatedPasscode = currentPasscode + digit;
    this.form.patchValue({
      passcode: updatedPasscode,
    });
    this.selectedDigit = updatedPasscode.length + "";
  }

  clickFolder(id) {
    this.selectedFolder = id;
    this.selectedFile = null;
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  getFolderContent(idFolder) {
    this.api.getTotalSize();
    if (this.page === "share") {
      if (!idFolder) {
        this.api
          .getallShared(true)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.content = data.results;
          });
        return;
      }
    }
    this.api
      .getFolderContent(
        idFolder ? idFolder : "",
        "",
        this.content &&
          this.content.currentFolder &&
          this.content.currentFolder.folderId === idFolder
          ? "current"
          : "",
        true
      )
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(
        (content: any) => {
          if (content.status === 200) {
            this.content = content.body.results;
          }
        },
        (err) => {
          if (err.status === 403) {
            const dialog = this.dialog.open(GetPasswordDialogComponent, {
              width: "453.44px",
              panelClass: "custom-dialog",
              data: {
                type: "open",
                title: "Décrypter le document",
              },
            });

            dialog
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (password) => {
                  if (password) {
                    this.api
                      .getFolderContent(idFolder, password, "", true)
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((content: any) => {
                        if (content.status === 200) {
                          this.content = content.body.results;
                        }
                      });
                  }
                },
                (err) => {
                  if (err.status === 403) {
                    alert("Mot de passe incorrecte");
                  }
                }
              );
          }
        }
      );
  }
  get selectedDocumentuserInfo() {
    if (
      this.selectedFile &&
      this.selectedFile.userInfo &&
      this.selectedFile.userInfo[0]
    )
      return this.selectedFile.userInfo[0];

    if (
      this.selectedFolder &&
      this.selectedFolder.userInfo &&
      this.selectedFolder.userInfo[0]
    )
      return this.selectedFolder.userInfo[0];

    return null;
  }
  get selectedDocumentuserShared() {
    if (this.selectedFile && this.selectedFile.share)
      return this.selectedFile.share;

    if (this.selectedFolder && this.selectedFolder.share)
      return this.selectedFolder.share;

    return null;
  }

  getStatusUser(user) {
    if (user.status) {
      const date1 = new Date(user.lastOnLine);
      const date2 = new Date();
      var Time = date2.getTime() - date1.getTime();
      if (Time < 10 * 1000 * 60) return "online";
      if (Time < 30 * 1000 * 60) return "padding";
    }
    return "offline";
  }
  onRightClick(event: any) {
    event.preventDefault();
    if (
      event.target.className === "container" ||
      (typeof event.target.className === "string" &&
        event.target.className.indexOf("content") !== -1)
    ) {
      this.selectedFile = null;
      this.selectedFolder = null;
      if (this.page === "share") return;
    }
    if (this.menu && !this.menu.nativeElement) return;
    this.showMenu();
    this.menuTopLeftPosition.x = event.clientX + 4 + "px";
    this.menuTopLeftPosition.y = event.clientY + 4 + "px";
    const menuBoundingClient = this.menu.nativeElement.getBoundingClientRect();
    if (menuBoundingClient.height + event.clientY > window.innerHeight) {
      this.menuTopLeftPosition.y =
        window.innerHeight - menuBoundingClient.height - 30 + "px";
    }
    if (menuBoundingClient.width + event.clientX > window.innerWidth) {
      this.menuTopLeftPosition.x =
        window.innerWidth - menuBoundingClient.width - 30 + "px";
    }
    return;
  }

  showMenu() {
    if (!this.menu || (this.menu && !this.menu.nativeElement)) return;
    this.render.setStyle(this.menu.nativeElement, "visibility", "visible");
    this.render.setStyle(this.menu.nativeElement, "opacity", "1");
  }

  dbClickFolder(id) {
    this.getFolderContent(id);
  }
  clickFile(id) {
    this.selectedFile = id;
    this.selectedFolder = null;
  }

  dbClickFile(id, name) {
    this.api
      .downloadFile(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (file) => {
          if (file.status === 200) {
            exportFile(file.body, name, file.body.type, "DOWNLOAD");
          }
        },
        (err) => {
          if (err.status === 403) {
            const dialog = this.dialog.open(GetPasswordDialogComponent, {
              width: "453.44px",
              panelClass: "custom-dialog",
              data: {
                type: "open",
                title: "Décrypter le document",
              },
            });

            dialog
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (password) => {
                  if (password) {
                    this.api
                      .downloadFile(id, password)
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((file) => {
                        if (file.status === 200) {
                          exportFile(
                            file.body,
                            name,
                            file.body.type,
                            "DOWNLOAD"
                          );
                        }
                      });
                  }
                },
                (err) => {
                  if (err.status === 403) {
                    alert("Mot de passe incorrecte");
                  }
                }
              );
          }
        }
      );
  }

  redirectToPdfViewer(id: string) {
    if (id !== undefined || id !== null) {
      this.api.getFileById(id).subscribe((res: FileResponse) => {
        if (res) {
          const dialogRef = this.dialog.open(PdfViewerComponent, {
            width: "100%",
            height: "95%",
            data: res, // Passer la source du fichier PDF au composant de la boîte de dialogue modale
          });
        }
      });
    }
  }

  share() {
    const dialog = this.dialog.open(PartageElmentComponent, {
      width: "90%",
      maxHeight: "80vh",
      panelClass: "custom-dialog",
      data: {
        type: "share",
        file: this.selectedFile ? this.selectedFile : null,
        folder: this.selectedFolder ? this.selectedFolder : null,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      this.getFolderContent(
        this.content.currentFolder ? this.content.currentFolder.folderId : ""
      );
    });
  }
  decrypt() {
    this.api
      .dechiffrerFichier(this.selectedFile?._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.statusText === "OK") {
          this.getFolderContent(
            this.content.currentFolder
              ? this.content.currentFolder.folderId
              : ""
          );
        }
      });
  }
  moveFiles() {
    if (this.selectedFile) {
      this.idFile = this.selectedFile._id;
      console.log(this.idFile);
      this.api.getFileById(this.selectedFile._id).subscribe((data: any) => {
        this.dialogMove = this.dialog.open(DeplacerElmntBoxeComponent, {
          width: "453.44px",
          panelClass: "custom-dialog",
          data: {
            type: "protect",
            title:
              "Déplacer le " +
              (this.selectedFile ? "fichier vers Vboxe" : "dossier vers Vboxe"),
            confirm: false,
          },
        });
        this.dialogMove
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((confirm) => {
            if (confirm) {
              this.api
                .checkAccessMoveCode(this.idFile)
                .subscribe((data: any) => {
                  if (data) {
                    this.dialogMoveSecond = this.dialog.open(
                      DeplacerElmntBoxeComponent,
                      {
                        width: "453.44px",
                        panelClass: "custom-dialog",
                        data: {
                          type: "protect",
                          title:
                            "Déplacer le " +
                            (this.selectedFile ? "fichier" : "dossier"),
                          confirm: true,
                        },
                      }
                    );
                    this.dialogMoveSecond
                      .afterClosed()
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((confirm) => {
                        if (confirm != null) {
                          let data: MoveEntityRequest = new MoveEntityRequest(
                            this.idFile,
                            confirm,
                            false
                          );

                          this.api
                            .checkSecondVerifMoveFile(data)
                            .subscribe((value) => {
                              if (value) {
                                let currentUrl = this.router.url;
                                this.router
                                  .navigateByUrl("/", {
                                    skipLocationChange: true,
                                  })
                                  .then(() => {
                                    this.router.navigate([currentUrl]);
                                  });
                              }
                            });
                        }
                      });
                  }
                });
            }
          });
      });
    }
    if (this.selectedFolder) {
      this.idFile = this.selectedFolder._id;
      if (this.idFile != null) {
        this.dialogMove = this.dialog.open(DeplacerElmntBoxeComponent, {
          width: "453.44px",
          panelClass: "custom-dialog",
          data: {
            type: "protect",
            title:
              "Déplacer le " +
              (this.selectedFile ? "fichier vers Vboxe" : "dossier vers Vboxe"),
            confirm: false,
          },
        });
        this.dialogMove
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((confirm) => {
            if (confirm) {
              this.api
                .checkAccessMoveCodeFolder(this.idFile)
                .subscribe((data: any) => {
                  if (data) {
                    this.dialogMoveSecond = this.dialog.open(
                      DeplacerElmntBoxeComponent,
                      {
                        width: "453.44px",
                        panelClass: "custom-dialog",
                        data: {
                          type: "protect",
                          title:
                            "Déplacer le " +
                            (this.selectedFile ? "fichier" : "dossier"),
                          confirm: true,
                        },
                      }
                    );
                    this.dialogMoveSecond
                      .afterClosed()
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((confirm) => {
                        if (confirm != null) {
                          let data: MoveEntityRequest = new MoveEntityRequest(
                            this.idFile,
                            confirm,
                            false
                          );

                          this.api
                            .checkSecondVerifMoveFolder(data)
                            .subscribe((value) => {
                              if (value) {
                                let currentUrl = this.router.url;
                                this.router
                                  .navigateByUrl("/", {
                                    skipLocationChange: true,
                                  })
                                  .then(() => {
                                    this.router.navigate([currentUrl]);
                                  });
                              }
                            });
                        }
                      });
                  }
                });
            }
          });
      }
    }
  }

  deleteShare() {
    if (this.selectedFile) {
      console.log(this.selectedFile);
      this.api.deleteShare(this.selectedFile._id).subscribe((input: any) => {
        if (input) {
          let currentUrl = this.router.url;
          this.router
            .navigateByUrl("/", { skipLocationChange: true })
            .then(() => {
              this.router.navigate([currentUrl]);
            });
        }
      });
    }
    if (this.selectedFolder) {
      console.log(this.selectedFolder._id);
      this.api.deleteShare(this.selectedFolder._id).subscribe((input: any) => {
        if (input) {
          let currentUrl = this.router.url;
          this.router
            .navigateByUrl("/", { skipLocationChange: true })
            .then(() => {
              this.router.navigate([currentUrl]);
            });
        }
      });
    }
  }

  download() {
    if (this.selectedFile)
      this.dbClickFile(this.selectedFile._id, this.selectedFile.name);
    if (this.selectedFolder)
      this.downloadFolder(
        this.selectedFolder._id,
        this.selectedFolder.folderName
      );
  }
  downloadFolder(id, name) {
    this.api
      .downloadFolder(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (folder) => {
          if (folder.status === 200) {
            exportFile(
              folder.body,
              name + ".zip",
              folder.body.type,
              "DOWNLOAD"
            );
          }
        },
        (err) => {
          if (err.status === 403) {
            const dialog = this.dialog.open(GetPasswordDialogComponent, {
              width: "453.44px",
              panelClass: "custom-dialog",
              data: {
                type: "open",
                title: "Décrypter le document",
              },
            });

            dialog
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (password) => {
                  if (password) {
                    this.api
                      .downloadFolder(id, password)
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((folder) => {
                        if (folder.status === 200) {
                          exportFile(
                            folder.body,
                            name + ".zip",
                            folder.body.type,
                            "DOWNLOAD"
                          );
                        }
                      });
                  }
                },
                (err) => {
                  if (err.status === 403) {
                    alert("Mot de passe incorrecte");
                  }
                }
              );
          }
        }
      );
  }

  addForlder() {
    this.hideMenu();
    const dialog = this.dialog.open(AddFolderDialogComponent, {
      width: "453.44px",
      panelClass: "custom-dialog",
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((folderName) => {
        if (folderName) {
          this.api
            .addFolder(
              folderName,
              this.selectedFolder
                ? this.selectedFolder._id
                : this.content.currentFolder
                ? this.content.currentFolder.folderId
                : "",
              true
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (data && data.statusText === "OK") {
                this.getFolderContent(
                  this.content.currentFolder
                    ? this.content.currentFolder.folderId
                    : ""
                );
              }
            });
        }
      });
  }

  addFiles() {
    this.hideMenu();
    const dialog = this.dialog.open(AddFilesDialogComponent, {
      width: "650px",
      panelClass: "custom-dialog",
      data: {
        type: "open",
      },
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((files) => {
        if (files) {
          this.api
            .addFiles(
              files,
              this.selectedFolder
                ? this.selectedFolder._id
                : this.content.currentFolder
                ? this.content.currentFolder.folderId
                : "",
              true
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (data && data.statusText === "OK") {
                this.getFolderContent(
                  this.content.currentFolder
                    ? this.content.currentFolder.folderId
                    : ""
                );
              }
            });
        }
      });
  }

  addFilesChiffrer() {
    this.hideMenu();
    const dialog = this.dialog.open(AddFilesDialogComponent, {
      width: "650px",
      panelClass: "custom-dialog",
      data: {
        type: "open",
      },
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((files) => {
        if (files) {
          this.api
            .chiffrerService(
              files,
              this.selectedFolder
                ? this.selectedFolder._id
                : this.content.currentFolder
                ? this.content.currentFolder.folderId
                : ""
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (data && data.statusText === "OK") {
                this.getFolderContent(
                  this.content.currentFolder
                    ? this.content.currentFolder.folderId
                    : ""
                );
              }
            });
        }
      });
  }

  hideMenu() {
    if (!this.menu || (this.menu && !this.menu.nativeElement)) return;
    this.render.setStyle(this.menu.nativeElement, "opacity", "0");
    setTimeout(() => {
      this.render.setStyle(this.menu.nativeElement, "visibility", "hidden");
    }, 100);
  }

  deleteFiles() {
    if (this.selectedFile) {
      if (
        confirm(
          "vous êtes sûr de supprimer le dossier '" +
            this.selectedFile.name +
            "'"
        )
      )
        this.api.deleteFile(this.selectedFile._id).subscribe((data) => {
          setTimeout(() => {
            this.getFolderContent(
              this.content.currentFolder
                ? this.content.currentFolder.folderId
                : ""
            );
          }, 20);
        });
    }
  }

  protect() {
    const dialog = this.dialog.open(GetPasswordDialogComponent, {
      width: "453.44px",
      panelClass: "custom-dialog",
      data: {
        type: "protect",
        title: "Protéger votre " + (this.selectedFile ? "fichier" : "dossier"),
      },
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((password) => {
        if (password)
          (this.selectedFile
            ? this.api.protectFile(this.selectedFile._id, password)
            : this.api.protectFolder(this.selectedFolder._id, password)
          ).subscribe(() => {
            setTimeout(() => {
              this.getFolderContent(
                this.content.currentFolder
                  ? this.content.currentFolder.folderId
                  : ""
              );
            }, 100);
          });
      });
  }
  deleteProtect() {
    const dialog = this.dialog.open(GetPasswordDialogComponent, {
      width: "453.44px",
      panelClass: "custom-dialog",
      data: {
        type: "deleteProtect",
        title:
          "Eliminer la protection de " +
          (this.selectedFile ? "fichier" : "dossier"),
        file: this.selectedFile ? this.selectedFile : null,
        folder: this.selectedFolder ? this.selectedFolder : null,
      },
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((password) => {
        if (password)
          (this.selectedFile
            ? this.api.inprotectFile(this.selectedFile._id, password)
            : this.api.inprotectFolder(this.selectedFolder._id, password)
          ).subscribe(
            () => {
              setTimeout(() => {
                this.getFolderContent(
                  this.content.currentFolder
                    ? this.content.currentFolder.folderId
                    : ""
                );
              }, 100);
            },
            (err) => {
              alert("Mot de passe incorrect");
            }
          );
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  openCodeDialog(email: string) {
    if (!this.hasPasswordCoffre) {
      const dialog = this.dialog.open(AddSafetyCodeComponent, {
        width: "453.44px",
        panelClass: "custom-dialog",
        data: {
          type: "open",
          title: "Ajouter votre code",
          email: this.email,
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
