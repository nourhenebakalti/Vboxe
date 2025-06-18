import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MENU } from 'src/app/shared/menu/menu.component';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {
  subMenus: Array<MENU> = [
    {
      picto: 'my-vbox-folder',
      content: 'MY_VBOX',
      link: "files"
    },
    {
      picto: 'my-vbox-share',
      content: 'MY_VBOX_SHARE',
      link: "share"
    },
    {
      picto: 'my-vbox-clock',
      content: 'MY_VBOX_MOST_RECENT',
      link: "most_recent"
    },
    {
      picto: 'my-vbox-star',
      content: 'MY_VBOX_FAVORITES',
      link: "favorites"
    },
    {
      picto: 'my-vbox-trash',
      content: 'MY_VBOX_TRASH',
      link: "trash"
    }
  ];
  constructor(
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer) { 
    this.subMenus.forEach(menu => {
      this.iconRegistery.addSvgIcon(
        menu.picto,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/' + menu.picto + '.svg'
        )
      );
    });
  }

  ngOnInit() {
  }

}
