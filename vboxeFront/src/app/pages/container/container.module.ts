import { EmailComponent } from "./../email/email.component";
import { MenuComponent } from "./../../shared/menu/menu.component";
import { ProfilComponent } from "./../../shared/profil/profil.component";
import { HeaderComponent } from "./../../shared/header/header.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SubMenuComponent } from "./../my-vbox/components/sub-menu/sub-menu.component";
import { GetPasswordDialogComponent } from "./../my-vbox/components/get-password-dialog/get-password-dialog.component";
import { FindSearchDialogComponent } from "./../users/components/find-search-dialog/find-search-dialog.component";
import { AddFilesDialogComponent } from "./../my-vbox/components/add-files-dialog/add-files-dialog.component";
import { AddFolderDialogComponent } from "./../my-vbox/components/add-folder-dialog/add-folder-dialog.component";
import { ContainerComponent } from "./container.component";
import { SharedModule } from "../../shared/shared.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatMenuModule } from "@angular/material/menu";
import { UsersComponent } from "../users/users.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MyVboxComponent } from "../my-vbox/my-vbox.component";
import { MatButtonModule } from "@angular/material/button";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarComponent } from "../calendar/calendar/calendar.component";
import { AvatarCardComponent } from "src/app/shared/avatar-card/avatar-card.component";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatPaginatorModule } from "@angular/material/paginator";
import { PaginatorComponent } from "../calendar/calendar/paginator/paginator.component";
import { CoffreFortComponent } from "../coffre-fort/coffre-fort.component";

import { MatRadioModule } from "@angular/material/radio";
import { AddSafetyCodeComponent } from "../coffre-fort/components/add-safety-code/add-safety-code.component";

import { StatisticComponent } from "src/app/statistic/statistic.component";
import { TopWidgetsComponent } from "src/app/top-widgets/top-widgets.component";
import { MyAppointmentsComponent } from "src/app/my-appointments/my-appointments.component";
import { ActifUsersComponent } from "src/app/actif-users/actif-users.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatInputModule } from "@angular/material/input";
import { RecentActivitiesComponent } from "src/app/recent-activities/recent-activities.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ProgressbarComponent } from "src/app/progressbar/progressbar.component";
import { FlexLayoutModule } from "@angular/flex-layout";

import { CalendarViewComponent } from "../calendar/calendar/calendar/calendar-view/calendar-view.component";
import { MatSelectModule } from "@angular/material/select";
import { LangageComponent } from "src/app/shared/langage/langage.component";
import { DeplacerElmntComponent } from "../my-vbox/components/deplacer-elmnt/deplacer-elmnt.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { SupprimerElmntComponent } from "../my-vbox/components/supprimer-elmnt/supprimer-elmnt.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCalendarComponent } from "../calendar/calendar/mat-calendar/mat-calendar.component";
import { MatNativeDateModule, DateAdapter } from "@angular/material/core";
import { CustomDateAdapter } from "../calendar/calendar/mat-calendar/CustomDateAdapter";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { EventDetailsDialogComponent } from "../calendar/calendar/event-details-dialog/event-details-dialog.component";
import { NotificationDialogComponent } from "src/app/shared/notification-dialog/notification-dialog.component";

import { PartageElmentComponent } from "../my-vbox/components/partage-elment/partage-elment.component";
import { ProfileElementComponent } from "src/app/shared/profile-element/profile-element.component";
import { EditProfileComponent } from "src/app/shared/edit-profile/edit-profile.component";
import { ChangePssWordComponent } from "src/app/shared/change-pss-word/change-pss-word.component";
import { AddProfileComponent } from "src/app/shared/add-profile/add-profile.component";

import { ReceptionComponent } from "../email/reception/reception.component";
import { AddEmailComponent } from "../email/add-email/add-email.component";
import { MessagesEnvoyeeComponent } from "../email/messages-envoyee/messages-envoyee.component";
import {
  DeleteConfirmationDialogComponent,
  MessageComponent,
} from "../email/message/message.component";
import { AddSignatureDialogComponent } from "../add-signature-dialog/add-signature-dialog.component";

const route: Routes = [
  {
    path: "",
    component: ContainerComponent,
    children: [
      { path: "", redirectTo: "my_vbox/files", pathMatch: "full" },
      { path: "my_vbox", redirectTo: "my_vbox/files", pathMatch: "full" },
      { path: "safty", redirectTo: "safty/files", pathMatch: "full" },
      { path: "my_vbox/:id", component: MyVboxComponent },
      { path: "safty/:id", component: CoffreFortComponent },
      { path: "users", component: UsersComponent },
      {
        path: "email",
        component: EmailComponent,
        children: [
          {
            path: "",
            redirectTo: "reception",
            pathMatch: "full",
          },
          {
            path: "reception",
            component: ReceptionComponent,
          },
          {
            path: "add-email",
            component: AddEmailComponent,
          },
          {
            path: "emails-envoyee",
            component: MessagesEnvoyeeComponent,
          },
          {
            path: ":id",
            component: MessageComponent,
          },
        ],
      },
      { path: "full-calendar", component: CalendarComponent },
      { path: "statistic", component: StatisticComponent },
    ],
  },
];

@NgModule({
  declarations: [
    EventDetailsDialogComponent,
    ContainerComponent,
    NotificationDialogComponent,
    AddFolderDialogComponent,
    UsersComponent,
    AddFilesDialogComponent,
    AvatarCardComponent,
    MenuComponent,
    ProfilComponent,
    HeaderComponent,
    ChangePssWordComponent,
    AddProfileComponent,
    LangageComponent,
    FindSearchDialogComponent,
    PartageElmentComponent,
    GetPasswordDialogComponent,
    MyVboxComponent,
    EmailComponent,
    SubMenuComponent,
    PaginatorComponent,
    CoffreFortComponent,
    ProfileElementComponent,
    AddSafetyCodeComponent,
    EditProfileComponent,

    StatisticComponent,
    TopWidgetsComponent,
    MyAppointmentsComponent,
    ActifUsersComponent,
    RecentActivitiesComponent,
    ProgressbarComponent,

    CalendarComponent,
    CalendarViewComponent,
    DeplacerElmntComponent,
    SupprimerElmntComponent,
    MatCalendarComponent,
    MessageComponent,
    DeleteConfirmationDialogComponent,
    AddEmailComponent,
    ReceptionComponent,
    MessagesEnvoyeeComponent,
    AddSignatureDialogComponent,
  ],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatIconModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatChipsModule,
    SharedModule,
    RouterModule.forChild(route),
    MatMenuModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    FullCalendarModule,
    MatRadioModule,
    FontAwesomeModule,
    MatTableModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    FlexLayoutModule,
  ],
  entryComponents: [
    ContainerComponent,
    AddFolderDialogComponent,
    AddFilesDialogComponent,
    FindSearchDialogComponent,
    GetPasswordDialogComponent,
    AddSafetyCodeComponent,
  ],
  //providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContainerModule {}
