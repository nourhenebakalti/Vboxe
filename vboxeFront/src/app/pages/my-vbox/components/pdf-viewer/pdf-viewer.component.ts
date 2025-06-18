import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { FileResponse } from "src/app/utils/FileResponse";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
})
export class PdfViewerComponent implements OnInit {
  idFile: string = null;
  urlFormated: any;
  ifImage: boolean;
  typeFile: any;
  extension:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: FileResponse,
    private route: ActivatedRoute,
    public api: VboxApiService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.typeFile = this.getMimeType(this.getExtension(this.data.name));
    if (this.typeFile !== "") {
      if (this.typeFile === "application/pdf") {
      }
      this.afficherPdf();
    }
  }


  afficherPdf() {
    //if (this.data)
    // Décodage de la chaîne base64 en contenu binaire
    const binaryData = atob(this.data.content);

    // Création d'un tableau d'octets à partir du contenu binaire
    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }
    // Déterminer le type de fichier à partir de son extension
    this.extension = this.getExtension(this.data.name);
    // Créer un objet Blob à partir du tableau d'octets
    const blob = new Blob([byteArray], { type: this.getMimeType(this.extension) });
    // Créer une URL objet à partir du Blob
    const url = URL.createObjectURL(blob);
    // Afficher le contenu en fonction du type de fichier
   
    this.urlFormated = url;
    if (this.isImage(this.extension)) {
      this.ifImage = true;
      // Convertir l'URL objet en une URL sécurisée
      this.urlFormated = this.sanitizer.bypassSecurityTrustResourceUrl(
        url
      ) as SafeResourceUrl;
    }
    if (this.extension == "pdf") {
      this.urlFormated = this.sanitizer.bypassSecurityTrustResourceUrl(
        url
      ) as SafeResourceUrl;
    }
  }

  getExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts[parts.length - 1].toLowerCase();
  }

  // Méthode pour obtenir le type MIME à partir de l'extension du fichier
  getMimeType(extension: string): string {
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      // Ajoutez d'autres types MIME au besoin
      case "doc":
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      default:
        return "";
    }
  }

  // Méthode pour vérifier si l'extension correspond à une image
  isImage(extension: string): boolean {
    return ["jpg", "jpeg", "png", "gif", "bmp", "tiff"].includes(extension);
  }
}
