import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-add-folder-dialog',
  templateUrl: './add-folder-dialog.component.html',
  styleUrls: ['./add-folder-dialog.component.scss']
})
export class AddFolderDialogComponent implements OnInit {
  formGroup: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<AddFolderDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      folderName: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  ngOnInit() {
  }

  close(arg) {
    const folderName = this.formGroup.get('folderName').value;
    folderName ?
    this.dialogRef.close(folderName):
    
      this.dialogRef.close(null);
  }

}
