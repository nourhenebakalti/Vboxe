import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { VboxApiService } from 'src/app/services/vbox-api.service';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit {
  userId: any;

navigateToDetails(id:string) {
  this.router.navigateByUrl(`/page/email/${id}`);
}

  constructor(private emailService:EmailService,private api: VboxApiService,private router:Router) { }
  newestEmail: any;
  messages:any[] 
  ngOnInit(): void {
    this.api.getProfile().subscribe((data:any) => {
      this.userId=data.id;
    this.emailService.getmessagesByReceiver(this.userId).subscribe(data => {
      console.log(data);
      this.messages = data.sort((a, b) => new Date(b.mail_date).getTime() - new Date(a.mail_date).getTime());
      this.newestEmail = this.messages.length > 0 ? this.messages[0] : null;
    })
  })
  
  }

}
