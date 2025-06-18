import { AddSignatureDialogComponent } from './../../add-signature-dialog/add-signature-dialog.component';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { SignatureService } from 'src/app/services/signature.service';
import { VboxApiService } from 'src/app/services/vbox-api.service';



@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {
  openSignatureModal() {
    const dialogRef = this.dialog.open(AddSignatureDialogComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.signatureAdded.subscribe((data) => {
      
      console.log('Signature added:', data);
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.signatureService.getSignaturesByUserId(this.api.profile.id).subscribe(elem=>{
      this.signatures =elem

      })
    });
  }
selectedSignature: any;


  reciever: any;
  signature: any;
  content: any;
  subject: any;
  signatures: any[] = [];

  constructor(
      private api: VboxApiService,
      private emailService: EmailService,
      private router: Router,
      private signatureService:SignatureService,
      private dialog: MatDialog
    ) { 
      this.signatureService.getSignaturesByUserId(this.api.profile.id).subscribe(elem=>{
        elem.forEach(signature=>{
          this.signatures.push(signature)
        })

      })
    }

  ngOnInit(): void {
   
  }

  

  onSubmit() {
    const email: any = {
      senderEmail: this.api.profile.username,
      receiverEmail: this.reciever,
      subject: this.subject,
      content: this.content,
      mailDate:new Date(),
    };
  
    if (this.selectedSignature) {
      email.idSignature = this.selectedSignature.id;
    }
  
    this.emailService.createMessage(email).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl('/page/email/emails-envoyee');
    });
  }
}
