import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { AppCustomPreloaderService } from "./app-custom-preloader.service";
import { ErrorState } from "./store/error.state";
import { UserState } from "./store/user.state";
import { VboxApiService } from "./services/vbox-api.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import localeFr from "@angular/common/locales/fr";
import localeFrExtra from "@angular/common/locales/extra/fr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { registerLocaleData, DatePipe } from "@angular/common";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxsModule } from "@ngxs/store";
import { ApiTokenInterceptor } from "./services/interceptor.service";
import { SahredDocumentsComponent } from "./pages/my-vbox/components/sahred-documents/sahred-documents.component";
import { LoadChildrenComponent } from "./load-children/load-children.component";
import { CalendarEventState } from "./store/event.state";
import { AddEventComponent } from "./pages/calendar/calendar/add-event/add-event.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { SharedModule } from "./shared/shared.module";
import { MatSelectModule } from "@angular/material/select";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ConfirmationDialogComponent } from "./pages/calendar/calendar/confirmation-dialog/confirmation-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { ChangeDateDialogComponent } from "./pages/calendar/calendar/change-date-dialog/change-date-dialog.component";
import { EditEventComponent } from "./pages/calendar/calendar/edit-event/edit-event.component";
import { DeleteEventComponent } from "./pages/calendar/calendar/delete-event/delete-event.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { PdfViewerComponent } from "./pages/my-vbox/components/pdf-viewer/pdf-viewer.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { MatRadioModule } from "@angular/material/radio";

import { ProgressbarComponent } from "./progressbar/progressbar.component";
import { DeplacerElmntBoxeComponent } from "./pages/my-vbox/components/deplacer-elmnt-boxe/deplacer-elmnt-boxe.component";
import { RenameElementComponent } from './pages/my-vbox/components/rename-element/rename-element.component';
import { LinkComponent } from './pages/link/link.component';

//import { AddSafetyCodeComponent } from './pages/coffre-fort/components/add-safety-code/add-safety-code.component';

registerLocaleData(localeFr, "fr", localeFrExtra);
const VERSION_LANG = "0.1.7";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    "./assets/i18n/",
    ".json?v=" + VERSION_LANG
  );
}
@NgModule({
  declarations: [
    AppComponent,
    SahredDocumentsComponent,
    LoadChildrenComponent,
    AddEventComponent,
    ConfirmationDialogComponent,
    ChangeDateDialogComponent,
    EditEventComponent,
    DeleteEventComponent,
    PdfViewerComponent,
    DeplacerElmntBoxeComponent,
    RenameElementComponent,
    LinkComponent,
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    DragDropModule,
    MatSelectModule,
    NgxDocViewerModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMomentDateModule,
    HttpClientModule,
    SharedModule,
    MatRadioModule,
    NgxsModule.forRoot([UserState, ErrorState, CalendarEventState]),
    NgxsRouterPluginModule.forRoot(),
    // debug tool
    NgxsReduxDevtoolsPluginModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    VboxApiService,
    AddEventComponent,
    AppCustomPreloaderService,
    DatePipe,
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
