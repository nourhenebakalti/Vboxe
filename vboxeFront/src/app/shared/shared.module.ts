import { MatIconModule } from "@angular/material/icon";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { HttpLoaderFactory } from "../app.module";
import { IndicatorStorageComponent } from "./indicator-storage/indicator-storage.component";
import { ApiTokenInterceptor } from "../services/interceptor.service";
import { ProfilComponent } from "./profil/profil.component";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [IndicatorStorageComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    RouterModule,
    ReactiveFormsModule,
    MatChipsModule,
    //matrial theme modules
    MatCardModule,
    MatButtonModule,


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiTokenInterceptor,
      multi: true,
    },
  ],
  exports: [TranslateModule, IndicatorStorageComponent, RouterModule],
  entryComponents: [ProfilComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
