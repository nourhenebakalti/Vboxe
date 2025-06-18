export class AccessRequest {
  email: string;
  passcodeCoffre: string;
  code: string;

  constructor(email: string, password: string,code: string) {
    this.email = email;
    this.passcodeCoffre = password;
    this.code = code;
  }
}
