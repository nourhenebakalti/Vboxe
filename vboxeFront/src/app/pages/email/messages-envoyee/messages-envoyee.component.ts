import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';
import { SignatureService } from 'src/app/services/signature.service';
import { VboxApiService } from 'src/app/services/vbox-api.service';

@Component({
  selector: 'app-messages-envoyee',
  templateUrl: './messages-envoyee.component.html',
  styleUrls: ['./messages-envoyee.component.scss']
})
export class MessagesEnvoyeeComponent implements OnInit {
  userId: any;

  constructor(private emailService:EmailService,private api: VboxApiService,) { }
messages:any[] 
  ngOnInit(): void {
    this.api.getProfile().subscribe((data:any) => {
      this.userId=data.id;
    this.emailService.getmessagesBySender(this.userId).subscribe(data => {
      console.log(data);
      this.messages = data.sort((a, b) => new Date(b.mail_date).getTime() - new Date(a.mail_date).getTime());
    })
    })
  }

}
