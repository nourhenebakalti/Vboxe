import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VboxApiService } from 'src/app/services/vbox-api.service';
import { NotifInfo } from 'src/app/utils/NotifInfo';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {
 

  notifList: any[] = [];
constructor(@Inject(MAT_DIALOG_DATA) public data: NotifInfo[], private api: VboxApiService,) {}

  ngOnInit(): void {
    this.api.getProfile().subscribe((data) => {
      this.api.profile = data;
    });
    this.api.getNotifByUser().subscribe((data) => {
      if (data) {
        // Loop through notifications and fetch user data for each userId
        this.notifList = data.map((notif: any) => {
          this.api.getUserById(notif.idUserEventCreater).subscribe((user:any) => {
         
            notif.userImage = user.profilePicture;
          });
          return notif;
        });
    
        
      }
    });
  }

}
