import { Component, OnInit } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { CustomDateAdapter } from "./CustomDateAdapter";

@Component({
  selector: "app-mat-calendar",
  templateUrl: "./mat-calendar.component.html",
  styleUrls: ["./mat-calendar.component.scss"],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})
export class MatCalendarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
