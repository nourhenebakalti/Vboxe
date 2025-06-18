import { Router } from "@angular/router";
import { VboxApiService } from "./../../services/vbox-api.service";
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

export interface MENU {
  picto: string;
  content: string;
  link: string;
}

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  total = 0;
  temporary: boolean;
  storageSize: number = 0;
  menus: Array<MENU> = [
    {
      picto: "folder",
      content: "MY_VEBOX",
      link: "my_vbox",
    },
    {
      picto: "safety",
      content: "SAFETY_BOX",
      link: "safty",
    },
    {
      picto: "users",
      content: "USERS",
      link: "users",
    },
    {
      picto: "pie-chart",
      content: "STAT",
      link: "statistic",
    },
    {
      picto: "mail",
      content: "MAIL",
      link: "email",
    },
    {
      picto: "calendar",
      content: "PLANNING",
      link: "full-calendar",
    },
    {
      picto: "visio",
      content: "VISIO",
      link: "visio",
    },
  ];
  constructor(
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public api: VboxApiService,
    private router: Router
  ) {
    this.api.getTotalSize();
    this.api.getTotal().subscribe((total) => {
      this.total = total;
    });
    this.api.getStorageSize().subscribe((limitSize) => {
      this.storageSize = limitSize;
    });
    this.menus.forEach((menu) => {
      this.iconRegistery.addSvgIcon(
        menu.picto,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/" + menu.picto + ".svg"
        )
      );
    });
  }

  ngOnInit() {
    if (localStorage.getItem("temporary") == "true") {
      this.temporary = true;
    } else {
      this.temporary = false;
    }
  }

  logout() {
    this.api.logout().subscribe(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.api.profile = null;
      this.router.navigate(["/"]);
    });
  }
}
