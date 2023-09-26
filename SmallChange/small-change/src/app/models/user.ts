import { ClientIdentification } from "./client-identification";

export class User {
  public token:number=NaN;
  constructor(public clientId:number,public email:string,public dateOfBirth:Date,public country:string,
    public postalCode:string, public phone: string, public password:string,public userName:string,
    public identification:ClientIdentification[]){}

  setToken(t:number){
    this.token=t
  }

  getToken():number{
    return this.token
  }
}
