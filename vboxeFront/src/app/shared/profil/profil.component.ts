import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VboxApiService } from './../../services/vbox-api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  public profile;
  public formGroup: FormGroup;
  public edit: boolean = true;
  file : File;
  constructor(private api: VboxApiService, public dialogRef: MatDialogRef<ProfilComponent>,private fb: FormBuilder) { }

  ngOnInit() {
    this.api.getProfile().subscribe(data => {
      this.api.profile = data;
    })
    this.profile = (this.api.profile && {...this.api.profile});
    if(!this.profile) this.dialogRef.close({});
    this.formGroup = this.fb.group({
      pic: [this.profile.profilePicture],
      profession: [ this.profile.profession],
      tel: [ this.profile.tel],
      group: [ this.profile.group],
      name: [this.profile.name, [Validators.required]]
    })
  }
  get abrefName() {
    return this.api.profile ? (this.profile.name as string).substring(0,2).toUpperCase() : "";
  }

  get profilePicture() {
    return this.api.profile && this.profile.profilePicture;
  }

  openDialogSetImage(inputFile) {
    inputFile.click();
  }

  setImage(event) {
    const file = event.target.files[0];
    this.file = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.profile.profilePicture = (reader.result as string).substring((reader.result as string).indexOf(',') + 1);
    };
  }

  updatUser() {
    if(this.formGroup.valid) {
      this.api.updateUser({
        ...this.profile,
        ...this.formGroup.getRawValue(),
        pic: this.file
      }).subscribe(()=> {
        this.closeDialog(true);
      })
    }
  }

  closeDialog(arg) {
    this.dialogRef.close(arg);
  } 
}
