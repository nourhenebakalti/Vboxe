import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MENU } from 'src/app/shared/menu/menu.component';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
navigate() {
  this.router.navigateByUrl("/page/email/add-email")
}

  @ViewChild('drawer') drawer: MatDrawer;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    subMenus: Array<MENU> = [
      {
        picto: 'mail',
        content: 'reception',
        link: "reception"
      },
      {
        picto: 'mail',
        content: 'messages envoyees',
        link: "emails-envoyee"
      },
      
    ];


  constructor(    private iconRegistery: MatIconRegistry,private router:Router,
    private sanitizer: DomSanitizer,) {
    this.subMenus.forEach(menu => {
      this.iconRegistery.addSvgIcon(
        menu.picto,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/' + menu.picto + '.svg'
        )
      );
    });
   }

  ngOnInit(): void {
  }

}
