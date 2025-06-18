import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-indicator-storage",
  templateUrl: "./indicator-storage.component.html",
  styleUrls: ["./indicator-storage.component.scss"],
})
export class IndicatorStorageComponent implements OnInit {
  //@Input("total") total: number = 0;
  @Input("used") used: number = 0;
  public total= 3221135872;
  constructor() {}

  ngOnInit() {}

  get getTotal() {
    return this.formatBytes(this.total);
   
  }

  get getUsed() {
    return this.formatBytes(this.used);
   
  }

  get getPercent() {
    if (this.used === 0 || this.total === 0) return 0;
    return (this.used / this.total) * 100;
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
