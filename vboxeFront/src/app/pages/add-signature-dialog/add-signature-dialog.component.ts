import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { SignatureService } from 'src/app/services/signature.service';
import { VboxApiService } from 'src/app/services/vbox-api.service';

@Component({
  selector: 'app-add-signature-dialog',
  templateUrl: './add-signature-dialog.component.html',
  styleUrls: ['./add-signature-dialog.component.scss']
})
export class AddSignatureDialogComponent implements OnInit {
  signature: any;
  nom:any

  // constructor(private api: VboxApiService,
  //   private emailService: EmailService,
  //   private router: Router,
  //   private signatureService: SignatureService,) { }

  ngOnInit(): void {
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Get the selected file
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
   
      const byteArray = new Uint8Array(reader.result as ArrayBuffer);
     
      this.signature = Array.from(byteArray);
    };

  }
  @Output() signatureAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<AddSignatureDialogComponent>,
      private signatureService: SignatureService, private api:VboxApiService
    ) {}

  addSignature() {
    const dataToSend = {
      nom: this.nom,
      signature: this.signature
    };
    this.signatureService.createSignature(
      {
        "userId":this.api.profile.id ,
        "nom":this.nom,
        "signature":this.signature
      }
    ).subscribe(signature => {
      this.signatureAdded.emit(dataToSend);
      this.dialogRef.close();
    });
    
    // Close the modal
   
  }
 
  // addSignature() {
  //   this.signatureService.createSignature(
  //     {
  //       "userId": this.api.profile.id,
  //       "signature": this.signature
  //     }
  //   );
  // }
}
