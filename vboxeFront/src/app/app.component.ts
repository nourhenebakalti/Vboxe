import { VboxApiService } from "./services/vbox-api.service";
import { TranslateService } from "@ngx-translate/core";
import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { ResetUser } from "./store/user.state";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "vbox";
  constructor(
    private store: Store,
    private translate: TranslateService,
    private api: VboxApiService
  ) {
    this.translate.use("fr");
    if (localStorage.getItem("accessToken")) {
      this.api.getProfile().subscribe((data) => {
        this.api.profile = data;
      });
    }
  }
}
