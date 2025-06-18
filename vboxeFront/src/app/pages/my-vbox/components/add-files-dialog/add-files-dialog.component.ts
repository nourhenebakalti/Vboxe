import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-add-files-dialog',
  templateUrl: './add-files-dialog.component.html',
  styleUrls: ['./add-files-dialog.component.scss']
})
export class AddFilesDialogComponent implements OnInit {
  formGroup: FormGroup;
  @ViewChild('file') file: ElementRef;
  listselectFiles = [];

  constructor(
    public dialogRef: MatDialogRef<AddFilesDialogComponent>,
    private formBuilder: FormBuilder,
    private iconRegistery: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.formGroup = this.formBuilder.group({
      folderName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.iconRegistery.addSvgIcon(
      'trash-2',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/file/trash-2.svg'
      )
    );
    
  }

  ngOnInit() {
  }

  close(arg) {
    if(arg && this.listselectFiles.length > 0){

      this.dialogRef.close(this.listselectFiles);
    }
    else
      this.dialogRef.close(null);
  }

  clickFileSelect() {
    this.file.nativeElement.click();
  }

  deleteFile(i) {
    this.listselectFiles.splice(i, 1);
  }

  selectFiles(event) {
 
    this.listselectFiles.push(event.target.files[0]);//need to be syntexed event.target.files
  }
  
}
