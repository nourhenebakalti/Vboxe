import { Collaborator } from "./Collaborator";

export class ShareRequest {
  collaboratorList: Collaborator[];

  constructor(collaboratorList: Collaborator[]) {
    this.collaboratorList = collaboratorList;
  }
}
