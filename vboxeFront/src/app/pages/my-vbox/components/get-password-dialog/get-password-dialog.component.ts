import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-get-password-dialog',
  templateUrl: './get-password-dialog.component.html',
  styleUrls: ['./get-password-dialog.component.scss']
})
export class GetPasswordDialogComponent implements OnInit {
  formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GetPasswordDialogComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.iconRegistery.addSvgIcon(
      'unlock-dialog',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/file/unlock-dialog.svg'
      )
    );

    this.iconRegistery.addSvgIcon(
      'lock',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/file/lock.svg'
      )
    );

    this.iconRegistery.addSvgIcon(
      'unlock-doc',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/file/unlock-doc.svg'
      )
    );
  }

  ngOnInit() {
  }

  close(arg) {
    const password = this.formGroup.get('password').value;
    password ?
      this.dialogRef.close(password) :
      this.dialogRef.close(null);
  }

}
