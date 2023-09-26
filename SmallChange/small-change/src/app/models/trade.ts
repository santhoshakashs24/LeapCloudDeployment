import { Order } from "./order"

export class Trade {

  constructor(
  public tradeId:string,
  public quantity: number,
  public executionPrice: number,
  public direction:string,
  public order:Order | undefined,
  public  cashValue: number,
  public  clientId: number,
  public  instrumentId: string,
  public portfolioId:string,
  public transactionAt:Date){}
}
