import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IpServiceService } from '../ip-service.service';
import { VboxApiService } from '../services/vbox-api.service';




@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {

  appointments: any[] = []; // To store fetched appointments
  dataSource = new MatTableDataSource<any>(); // Data source for the table
  displayedColumns: string[] = ['name', 'IpAdress', 'Adress', 'date']; // Table columns
  public ipInfo: any;
  user:any;
  userId:any;
  ngOnInit(): void {
    this.api.getProfile().subscribe((data:any) => {
      this.userId=data.id;
   

    this.ipService.getAppointmentsByUser(this.userId).subscribe({
      next: (response: any) => {
        console.log('Appointments fetched successfully', response);
        this.appointments = response; 
        console.log(response)
        this.dataSource.data = this.appointments; 
      },
      error: (error: any) => {
        console.error('Error fetching appointments', error);
      }
    });
  });
      
  }
  constructor(private ipService:IpServiceService,
    private api: VboxApiService,
  ){

  }

}
