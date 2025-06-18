import { SharedModule } from './../../shared/shared.module';
import { UserManagementComponent } from './user-management.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

const route: Routes = [
  {path:'', component: UserManagementComponent}
]

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserManagementModule { }
