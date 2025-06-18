import { ActivatedRoute, Router } from "@angular/router";
import { FindSearchDialogComponent } from "./../users/components/find-search-dialog/find-search-dialog.component";
import { GetPasswordDialogComponent } from "./components/get-password-dialog/get-password-dialog.component";
import { exportFile } from "./../../utils/file-utils";
import { AddFilesDialogComponent } from "./components/add-files-dialog/add-files-dialog.component";
import { AddFolderDialogComponent } from "./components/add-folder-dialog/add-folder-dialog.component";
import { VboxApiService } from "./../../services/vbox-api.service";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { DomSanitizer } from "@angular/platform-browser";
import { MENU } from "src/app/shared/menu/menu.component";
import { BehaviorSubject, forkJoin, Observable, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MatMenuPanel, MatMenuTrigger } from "@angular/material/menu";
import { MatIconRegistry } from "@angular/material/icon";
import { PdfViewerComponent } from "./components/pdf-viewer/pdf-viewer.component";
import { FileResponse } from "src/app/utils/FileResponse";
import { DeplacerElmntComponent } from "./components/deplacer-elmnt/deplacer-elmnt.component";
import { SupprimerElmntComponent } from "./components/supprimer-elmnt/supprimer-elmnt.component";
import JSZip from "jszip";
import { MoveEntityRequest } from "./components/deplacer-elmnt-boxe/MoveEntityRequest";
import { DeplacerElmntBoxeComponent } from "./components/deplacer-elmnt-boxe/deplacer-elmnt-boxe.component";
import { PartageElmentComponent } from "./components/partage-elment/partage-elment.component";
import { RenameElementComponent } from "./components/rename-element/rename-element.component";
interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileSystemItem[];
  content?: string; // Base64 string
  folderParentId?: string; // non utile
}

@Component({
  selector: "app-my-vbox",
  templateUrl: "./my-vbox.component.html",
  styleUrls: ["./my-vbox.component.scss"],
})
export class MyVboxComponent implements OnInit {
  menuTopLeftPosition = { x: "0", y: "0" };
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild("menu") menu: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  private destroy$ = new Subject();
  private fileSystemSubject = new BehaviorSubject<FileSystemItem | null>(null);
  fileSystem$ = this.fileSystemSubject.asObservable();
  public content = null;
  public selectedFile;
  public inShare;
  public selectedFolder;
  public pdfSrc: any;
  selectElementDrag: boolean;
  selectPositions: { start: { x: number; y: number; }; end: { x: number; y: number; }; } = { start: { x: null, y: null }, end: { x: null, y: null } };


  emplacementActuel: any;
  dialogDelete: any;
  renameDialog: any;
  idFile: any;
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
  page = "files";
  dialogMoveSecond: any;

  public dragedElement;
  constructor(
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    public api: VboxApiService,
    private render: Renderer2,
    private dialog: MatDialog
  ) {
    this.subMenus.forEach((menu) => {
      this.iconRegistery.addSvgIcon(
        menu.picto,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/" + menu.picto + ".svg"
        )
      );
    });

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
      "zip-file",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/zipfile.svg"
      )
    );

    this.iconRegistery.addSvgIcon(
      "file-trash-2",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file-trash-2.svg"
      )
    );
    this.iconRegistery.addSvgIcon(
      "rename",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/rename.svg"
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
      "file_img",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/file/file_img.svg"
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

    if (ext === "xls" || ext === "xlsx") {
      return "file_excel";
    }

    if (ext === "pdf") {
      return "pdf-icon";
    }
    if (ext === "txt") {
      return "txtIcon";
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

  ngOnInit() {
    this.route.params.subscribe((page) => {
      this.page = page["id"];
      if (this.page === "files" || this.page === "share") {
        this.getFolderContent("");
      }
    });
  }

  getFolderContent(idFolder) {
    this.api.getTotalSize();
    if (this.page === "share") {
      if (!idFolder) {
        this.api
          .getallShared(false)
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
        false
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
                      .getFolderContent(idFolder, password, "", false)
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

  clickFolder(id) {
    this.selectedFolder = id;
    this.selectedFile = null;
  }

  dbClickFolder(id) {
    this.getFolderContent(id);
  }

  clickFile(id) {
    this.selectedFile = id;
    this.selectedFolder = null;
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

  showMenu() {
    if (!this.menu || (this.menu && !this.menu.nativeElement)) return;
    this.render.setStyle(this.menu.nativeElement, "visibility", "visible");
    this.render.setStyle(this.menu.nativeElement, "opacity", "1");
  }

  hideMenu() {
    if (!this.menu || (this.menu && !this.menu.nativeElement)) return;
    this.render.setStyle(this.menu.nativeElement, "opacity", "0");
    setTimeout(() => {
      this.render.setStyle(this.menu.nativeElement, "visibility", "hidden");
    }, 100);
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
                : this.content?.currentFolder
                ? this.content?.currentFolder.folderId
                : ""
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (data && data.statusText === "OK") {
                this.getFolderContent(
                  this.content?.currentFolder
                    ? this.content?.currentFolder.folderId
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
              false
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

  deleteFiles() {
    if (this.selectedFile) {
      this.dialogDelete = this.dialog.open(SupprimerElmntComponent, {
        width: "420.44px",
        panelClass: "custom-dialog",
        data: {
          title: "Êtes-vous sûr de vouloir supprimer ce fichier ? ",
          description:
            "Si vous supprimez le fichier, vous ne pourrez pas le récupérer.",
        },
      });
      this.dialogDelete.afterClosed().subscribe((data1) => {
        if (data1) {
          this.api.deleteFile(this.selectedFile._id).subscribe((output) => {
            setTimeout(() => {
              this.getFolderContent(
                this.content.currentFolder
                  ? this.content.currentFolder.folderId
                  : ""
              );
            }, 20);
          });
        }
      });
    } else {
      if (this.selectedFolder) {
        const dialog = this.dialog.open(SupprimerElmntComponent, {
          width: "440.44px",
          panelClass: "custom-dialog",
          data: {
            title: "Êtes-vous sûr de vouloir supprimer ce dossier ? ",
            description:
              "Si vous supprimez le dossier, vous ne pourrez pas le récupérer.",
          },
        });
        dialog
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((supprime) => {
            if (supprime) {
              this.api
                .delereFolder(this.selectedFolder._id)
                .subscribe((data) => {
                  setTimeout(() => {
                    this.getFolderContent(
                      this.content.currentFolder
                        ? this.content.currentFolder.folderId
                        : ""
                    );
                  }, 20);
                });
            }
          });
      }
    }
  }

  renameFiles() {
    if (this.selectedFile) {
      this.renameDialog = this.dialog.open(RenameElementComponent, {
        width: "420.44px",
        panelClass: "custom-dialog",
        data: {
          nameFile: this.selectedFile.name,
          entity: "fichier",
        },
      });
      this.renameDialog.afterClosed().subscribe((data1) => {
        if (data1 && data1.isRenamed) {
          this.api
            .renameFile(this.selectedFile._id, data1.newFileName)
            .subscribe((output) => {
              setTimeout(() => {
                this.getFolderContent(
                  this.content.currentFolder
                    ? this.content.currentFolder.folderId
                    : ""
                );
              }, 20);
            });
        }
      });
    } else {
      if (this.selectedFolder) {
        const dialog = this.dialog.open(RenameElementComponent, {
          width: "440.44px",
          panelClass: "custom-dialog",
          data: {
            nameFile: this.selectedFolder.folderName,
            entity: "document",
          },
        });
        dialog
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((data2) => {
            if (data2 && data2.isRenamed) {
              this.api
                .renameFolder(this.selectedFolder._id, data2.newFileName)
                .subscribe((data) => {
                  setTimeout(() => {
                    this.getFolderContent(
                      this.content.currentFolder
                        ? this.content.currentFolder.folderId
                        : ""
                    );
                  }, 20);
                });
            }
          });
      }
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

  share() {
    const dialog = this.dialog.open(PartageElmentComponent, {
      width: "80%",
      //maxHeight: "80vh",
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
              console.log("errr", err);
              alert("Mot de passe incorrect");
            }
          );
      });
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

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  get selectedDocumentuserInfo() {
    if (
      this.selectedFile &&
      this.selectedFile.userInfo &&
      this.selectedFile.userInfo[0]
    ) {
      return this.selectedFile.userInfo[0];
    }
    if (
      this.selectedFolder &&
      this.selectedFolder.userInfo &&
      this.selectedFolder.userInfo[0]
    ) {
      return this.selectedFolder.userInfo[0];
    }

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
  dialogMove: any;
  moveFiles() {
    // if (this.selectedFile) {
    //   this.idFile = this.selectedFile._id;
    //   this.api.getFileById(this.selectedFile._id).subscribe((data: any) => {
    //     if (data.idFolder != null) {
    //       this.api.getFolderById(data.idFolder).subscribe((input: any) => {
    //         this.emplacementActuel = input.folderName;
    //         this.dialogMove = this.dialog.open(DeplacerElmntComponent, {
    //           width: "453.44px",
    //           panelClass: "custom-dialog",
    //           data: {
    //             type: "protect",
    //             title:
    //               "Déplacer le " + (this.selectedFile ? "fichier" : "dossier"),
    //             nameFolder: this.emplacementActuel,
    //           },
    //         });
    //         this.dialogMove
    //           .afterClosed()
    //           .pipe(takeUntil(this.destroy$))
    //           .subscribe((idFolder) => {
    //             if (idFolder) {
    //               this.api
    //                 .updateFileFolderId(this.idFile, idFolder)
    //                 .subscribe((data: any) => {
    //                   let currentUrl = this.router.url;
    //                   this.router
    //                     .navigateByUrl("/", { skipLocationChange: true })
    //                     .then(() => {
    //                       this.router.navigate([currentUrl]);
    //                     });
    //                 });
    //             }
    //           });
    //       });
    //     }
    //   });
    // }
    // if (this.selectedFolder) {
    //   this.idFile = this.selectedFolder._id;
    //   this.api.getFolderById(this.idFile).subscribe((input: any) => {
    //     if (input.folderParentId != null) {
    //       this.api
    //         .getFolderById(input.folderParentId)
    //         .subscribe((input: any) => {
    //           this.emplacementActuel = input.folderName;
    //           this.dialogMove = this.dialog.open(DeplacerElmntComponent, {
    //             width: "453.44px",
    //             panelClass: "custom-dialog",
    //             data: {
    //               type: "protect",
    //               title:
    //                 "Déplacer le " +
    //                 (this.selectedFile ? "fichier" : "dossier"),
    //               nameFolder: this.emplacementActuel,
    //             },
    //           });
    //           this.dialogMove
    //             .afterClosed()
    //             .pipe(takeUntil(this.destroy$))
    //             .subscribe((idFolder) => {
    //               if (idFolder) {
    //                 this.api
    //                   .updateFolderIdParent(this.idFile, idFolder)
    //                   .subscribe((data: any) => {
    //                     let currentUrl = this.router.url;
    //                     this.router
    //                       .navigateByUrl("/", { skipLocationChange: true })
    //                       .then(() => {
    //                         this.router.navigate([currentUrl]);
    //                       });
    //                   });
    //               }
    //             });
    //         });
    //     }
    //   });
    // }
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
                            true
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
                            true
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    //this.destroy$.unsubscribe();
  }
  currentItem: any;
  currentItemType: any;
  type: any = null;
  idContent: any = null;
  oneEventWork: boolean = false;
  isExternalDrag: boolean = false;

  onDropFromExternal(event: any) {
    if (!this.oneEventWork) {
    }
  }
  processDirectory(entry: any, parentFolderId: string = "") {
    const reader = entry.createReader();

    reader.readEntries((entries: any[]) => {
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].isDirectory) {
          this.api
            .addFolder(entries[i].name, parentFolderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (data && data.statusText === "OK") {
                // Si c'est un sous-dossier, appel récursif
                this.processDirectory(entries[i], data.body.folderId);
              }
            });
        } else if (entries[i].isFile) {
          entries[i].file((file: File) => {
            this.api
              .addFiles([file], parentFolderId, false)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: any) => {
                if (data && data.statusText === "OK") {
                }
              });
          });
        }
      }
    });
  }

  prepareStructure(idFolder: string): void {
    let fileSystemItem: FileSystemItem;

    // Appel backend pour récupérer les informations du dossier
    this.api.getFolderById(idFolder).subscribe((folder: any) => {
      fileSystemItem = {
        id: folder.folderId,
        name: folder.folderName,
        type: "folder",
        children: [],
      };

      // Récupération des fichiers dans le dossier
      this.api.getAllFileByIdFolder(idFolder).subscribe((files: any[]) => {
        files.forEach((file: any) => {
          const fileItem: FileSystemItem = {
            id: file.id,
            name: file.name,
            type: "file",
            content: file.content, // Ajoutez le contenu si nécessaire
          };
          fileSystemItem.children.push(fileItem);
        });

        // Récupération des sous-dossiers
        this.api
          .getAllFolderByfolderParentId(idFolder)
          .subscribe((subFolders: any[]) => {
            const subFolderRequests = subFolders.map((subFolder: any) => {
              return this.prepareStructureRecursive(subFolder.folderId);
            });

            // Attendre que tous les sous-dossiers soient traités
            forkJoin(subFolderRequests).subscribe(
              (results: FileSystemItem[]) => {
                fileSystemItem.children.push(...results);
                this.fileSystemSubject.next(fileSystemItem); // Émettre la structure finale
                // Ne déclencher le téléchargement qu'après la préparation complète
                if (this.fileSystemSubject.getValue()) {
                  this.triggerDownload(this.fileSystemSubject.getValue());
                }
              }
            );
          });
      });
    });
  }

  private prepareStructureRecursive(
    idFolder: string
  ): Observable<FileSystemItem> {
    return new Observable((observer) => {
      this.api.getFolderById(idFolder).subscribe((folder: any) => {
        if (folder != null) {
          const fileSystemItem: FileSystemItem = {
            id: folder.folderId,
            name: folder.folderName,
            type: "folder",
            children: [],
          };
          this.api.getAllFileByIdFolder(idFolder).subscribe((files: any[]) => {
            files.forEach((file: any) => {
              const fileItem: FileSystemItem = {
                id: file.id,
                name: file.name,
                type: "file",
                content: file.content,
              };
              fileSystemItem.children.push(fileItem);
            });

            // Récupération des sous-dossiers
            this.api
              .getAllFolderByfolderParentId(idFolder)
              .subscribe((subFolders: any[]) => {
                if (subFolders.length > 0) {
                  const subFolderRequests = subFolders.map((subFolder: any) => {
                    return this.prepareStructureRecursive(subFolder.folderId);
                  });

                  forkJoin(subFolderRequests).subscribe(
                    (results: FileSystemItem[]) => {
                      fileSystemItem.children.push(...results);
                      observer.next(fileSystemItem);
                      observer.complete();
                    }
                  );
                } else {
                  // Si pas de sous-dossiers, terminer l'observable
                  observer.next(fileSystemItem);
                  observer.complete();
                }
              });
          });
        }
      });
    });
  }

  // Fonction pour convertir une chaîne base64 en Blob
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64); // Décode la chaîne base64
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  getMimeType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "png":
      case "PNG":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "pdf":
        return "application/pdf";
      case "txt":
        return "application/txt";
      // Ajoute plus de types MIME selon les besoins
      default:
        return "application/octet-stream";
    }
  }

  triggerDownload(fileSystemItem: FileSystemItem) {
    // Fonction récursive pour ajouter des fichiers et dossiers au ZIP
    const addFilesToZip = (folder: FileSystemItem, parentFolder: JSZip) => {
      if (folder != null) {
        if (folder.type === "folder" && folder.children) {
          const zipFolder = parentFolder.folder(folder.name);
          folder.children.forEach((child) => addFilesToZip(child, zipFolder));
        } else if (folder.type === "file" && folder.content) {
          // Si le content est un base64, le convertir en Blob avant de l'ajouter au ZIP
          const mimeType = this.getMimeType(folder.name); // Fonction pour obtenir le mime-type en fonction de l'extension
          const fileBlob = this.base64ToBlob(folder.content, mimeType);
          parentFolder.file(folder.name, fileBlob, { binary: true });
        }
      }
    };
    const zip = new JSZip();
    addFilesToZip(fileSystemItem, zip);

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Folder.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  // 888888888888888888888
  onDragOverToApp(event: DragEvent) {
    event.preventDefault();
    if (!this.oneEventWork) {
      this.oneEventWork = true;
    }
  }
  onDropToApp(event: DragEvent) {
    event.preventDefault();
    if (this.oneEventWork) {
      this.oneEventWork = false;
      if (event.dataTransfer?.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          if (item.kind === "file") {
            const entry = item.webkitGetAsEntry();

            if (entry?.isDirectory) {
              console.log("DOSSIER");
              this.api
                .addFolder(entry.name, "")
                .pipe(takeUntil(this.destroy$))
                .subscribe((data: any) => {
                  if (data && data.statusText === "OK") {
                    // Si c'est un sous-dossier, appel récursif
                    console.log(data);
                    this.processDirectory(entry, data.body.folderId);
                  }
                });
            } else if (entry?.isFile) {
              const file = item.getAsFile();
              if (file) {
                console.log("File:", file.name, file.type, false);
                this.api
                  .addFiles([file], "")
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((data: any) => {
                    if (data && data.statusText === "OK") {
                      // this.getFolderContent(
                      //   this.content.currentFolder
                      //     ? this.content.currentFolder.folderId
                      //     : ""
                      // );
                    }
                  });
                // Uploader le fichier à votre backend ici
              }
            }
          }
        }
      }
      //event.stopPropagation();
      setTimeout(() => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      }, 3000);
      console.log("From Pc Vers App 88");
    }
  }
  onDragStartFromApp(event: any) {
    this.selectElementDrag = false;
    this.selectPositions = { start: { x: null, y: null }, end: { x: null, y: null } };
    let node = document.getElementById("select-eara");
    if (node)
      this.canvas.nativeElement.removeChild(node);
    const [elementType, id] = event.target.id.split("-");
    if (elementType == "fi") {
      this.dragedElement = { ...this.content.files.find((file: any) => file._id === id), id: id };
      delete this.dragedElement._id;
    } else {
      this.dragedElement = { ...this.content.folders.find((file: any) => file._id === id), id: id };
      delete this.dragedElement._id;
    }
  }
  onDragEndFromApp(event: DragEvent) {
 
  }
  onDragOver(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDrop(event: any, id: string) {
    event.preventDefault();
    if (this.dragedElement) {
      const elementToUpdate = { ...this.dragedElement, idFolder: id };
      if (elementToUpdate["folderName"]) {
        if (elementToUpdate.id !== id)
          this.api.folderUpdateParentForlder(elementToUpdate.id, id).subscribe(() => this.getFolderContent(this.content.currentFolder ? this.content.currentFolder.folderId : ""));

      } else {
        this.api.fileUpdateParentForlder(elementToUpdate.id, id).subscribe(() => this.getFolderContent(this.content.currentFolder ? this.content.currentFolder.folderId : ""));
      }
    }
  }

  chiffrerFile() {
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
  isSharedClicked = false;

  toggleShared() {
    this.isSharedClicked = !this.isSharedClicked;
  }
}
