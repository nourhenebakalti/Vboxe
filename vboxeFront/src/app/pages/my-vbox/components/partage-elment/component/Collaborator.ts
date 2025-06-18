export class Collaborator {
  id: string;
  idUser: string;
  name: string;
  email: string;
  constructor(id:string,idUser:string,name:string,email:string){
    this.id = id;
    this.idUser = idUser;
    this.name = name;
    this.email = email;
  }
}
