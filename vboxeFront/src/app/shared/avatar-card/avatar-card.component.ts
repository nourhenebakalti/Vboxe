import { ChangeDetectorRef, Component, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { VboxApiService } from "src/app/services/vbox-api.service";
import { Notification } from "src/app/utils/Notification";

@Component({
  selector: "app-avatar-card",
  templateUrl: "./avatar-card.component.html",
  styleUrls: ["./avatar-card.component.scss"],
})
export class AvatarCardComponent implements OnInit {
  @Input() notifData: Notification;
  @Input() userId: any;
  @Output() stream = new EventEmitter();
  @Output() confirm = new EventEmitter<{ clickedObject: any }>();
  @Output() changeDate = new EventEmitter();

  constructor(private api: VboxApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
      this.api.getUserById(this.notifData.idUserEventCreater).subscribe((user:any) => {
        this.notifData.userImage = user?.profilePicture;
    
        this.cdr.detectChanges();
            });

  }

  onStream(clicked: any) {
    this.stream.emit(clicked);
  }
  onConfirm() {
    this.confirm.emit({ clickedObject: this.notifData });
  }
  onChange() {
    this.changeDate.emit(this.notifData);
  }
}
