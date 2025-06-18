import { Details } from "./Details";

export interface Notification {
  idNotification: string;
  user: string;
  idUserEventCreater: string;
  notif_title: string | null;
  idEvent: string | null;
  notif_msg: string;
  type: string;
  details: Details;
  userImage:String
}
