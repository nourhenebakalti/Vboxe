import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// tslint:disable-next-line:no-duplicate-imports

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-actif-users',
  templateUrl: './actif-users.component.html',
  styleUrls: ['./actif-users.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ActifUsersComponent implements OnInit {
chosenDayHandler($event: Event,_t7: MatDatepicker<any>) {
throw new Error('Method not implemented.');
}
  users: User[] =[];
 
  selectedMonth: number;
  selectedYear: number;

  progressValue: number = 50;
  date = new FormControl(moment());
  constructor(private userService:UserService) { }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.selectedYear = normalizedYear.year();
    console.log("Year",this.selectedYear)
  
  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.selectedMonth = normalizedMonth.month();
    console.log("month",this.selectedMonth)
    datepicker.close();
  }
  ngOnInit(): void {
   const date =new Date();
   const month =date.getMonth()+1
   const day = date.getDate();
   const year = date.getFullYear()
   console.log("thi is voila" ,day,month,year)
   this.getUser(day, year,month)
    
   }
  
 getUser( day : number ,month : number , year : number) {
    this.userService.getUserCount(day , year, month  ).subscribe( {
      next : (data)=>{
      console.log("this is data",data)
      this.users=data;},
      error : (err) =>{
        console.log(err)
      }
      
 });}}




