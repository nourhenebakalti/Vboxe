import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { SignatureService } from 'src/app/services/signature.service';
import { VboxApiService } from 'src/app/services/vbox-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  id: any;
  message: any;
  signature: any;
  corbeille: any;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private signatureService: SignatureService,
      private api: VboxApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.emailService.getmessageById(this.id).subscribe(elem => {
        this.message = elem;
     
        if(this.message.id_signature) {
          this.signatureService.getSignatureById(this.message.id_signature).subscribe(elem => {
            this.signature = elem.signature;
          });
        }
      });
    });
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px',
      data: { messageSubject: this.message.subject }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteMessage();
      }
    });
  }

  deleteMessage() {
    this.emailService.deletemessage(this.message.id_message).subscribe(elem => {
      console.log(elem);
    });
  
  }}

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      Are you sure you want to delete the message ?
      
    </mat-dialog-content>
    <mat-dialog-actions>
      
      <button mat-button class="btn btn-danger" [mat-dialog-close]="'confirm'">Delete</button>
      <button mat-button class="btn" mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { messageSubject: string }
  ) { }
}