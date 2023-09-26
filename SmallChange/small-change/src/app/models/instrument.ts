export class Instrument {
  constructor(public instrumentId:string ,
  public instrumentDescription:string ,
  public externalIdType:string,
  public externalId:string ,
  public categoryId:string,
  public minQuantity:number ,
  public maxQuantity:number){}
}
