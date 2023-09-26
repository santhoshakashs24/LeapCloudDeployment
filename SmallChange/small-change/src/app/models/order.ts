export class Order {
  public instrumentId:string="";
  quantity:number=0;
  targetPrice:number=0;
  direction:string='';
  clientId:number=NaN;
  orderId:string='';
  portfolioId:string='';
  constructor(instrumentId:string,quantity:number,targetPrice:number,portfolioId:string,direction:string){
    this.instrumentId=instrumentId;
    this.quantity=quantity;
    this.targetPrice=targetPrice;
    this.portfolioId=portfolioId
    this.direction=direction
  }

  setClientId(clientId:number){
    this.clientId=clientId
  }

  serOrderId(orderId:string){
    this.orderId=orderId;
  }
}
