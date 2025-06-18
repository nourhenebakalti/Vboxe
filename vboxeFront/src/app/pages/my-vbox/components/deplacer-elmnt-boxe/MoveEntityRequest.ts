
export class MoveEntityRequest {
    id: string;
    code: string;
    inSafety:boolean;
  
    constructor(id: string,code: string,inSafety:boolean) {
      this.id = id;
      this.code = code;
      this.inSafety = inSafety;
    }
  }