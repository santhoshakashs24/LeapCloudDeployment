import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Trade } from '../models/trade';
import { Order } from '../models/order';
import { Portfolio } from '../models/portfolio';
import { Stock } from '../models/stock';
import { NgbTimeStructAdapter } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { InstrumentPrice } from '../models/instrument-price';
import { UserServiceService } from './user-service.service';



@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  PortfolioDetails: any[] = [];
  instrumentDetails: any[] = [];
  combinedDetails: any[] = [];
  //portfolioUrl = 'assets/portfolio.json';
  //1728765503
  portfolioUrl="http://localhost:8080/portfolios"
  instrumentInfoUrl = 'assets/instruments.json';
  errorMessage: string = '';
  allPortfolio: Portfolio[] = [
    {
      "portfolio_id": "1111",
      "user_id": 1,
      "portfolio_category": "BROKERAGE",
      "portfolio_name": "My new portfolio",
      stocks: [{ "id": "1", "instrumentId": "Q123", "instrument": "APL", "quantity": 450, "value": 89000, "price": 776, "change": -14.07 },
               { "id": "2", "instrumentId": "N123456", "instrument": "AMZ", "quantity": 450, "value": 89000, "price": 776, "change": 5.07 }
      ],
      "portfolio_balance": 100000,
      "totalInvestmentPrice":1000,
      "totalSharesWorth":12000
    },
    {

      "portfolio_id": "2222",
      "user_id": 1,
      "portfolio_category": "BROKERAGE",
      "portfolio_name": "Demo portfolio",
      stocks: [{ "id": "1", "instrumentId": "Q123", "instrument": "APL", "quantity": 450, "value": 89000, "price": 776, "change": -14.07 },
               { "id": "2", "instrumentId": "N123456", "instrument": "AMZ", "quantity": 450, "value": 89000, "price": 776, "change": 5.07 }
              ],
      "portfolio_balance": 100000,
      "totalInvestmentPrice":1000,
      "totalSharesWorth":12000
    },
  ]

  constructor(private http: HttpClient,private clientService:UserServiceService) { }

  getPortfolioData(): Observable<Portfolio[]> {


    let httpHeaders=new HttpHeaders()
    httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.clientService.getLogedInUserToken()}`)

    return this.http.get<any[]>(`${this.portfolioUrl}/client`,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError),
        switchMap((serverPortfolioData:any[],index:number)=>{

          const resp:Portfolio[]=serverPortfolioData.map( (serverPortfolio)=>{

            const stocks=serverPortfolio.holdings.map((hold:any)=>{
              console.log(hold.insrumentId,hold.quantity);
              return new Stock("",hold.insrumentId,"",hold.quantity,
              -1,hold.invetsmentprice,-1
              )
            });

            return new Portfolio(serverPortfolio.portfolioId,serverPortfolio.clientId,
              serverPortfolio.portfolioTypeName, serverPortfolio.portfolioName ,
              serverPortfolio.balance,stocks);
          });
          return of(resp);
        })
      );
  }


  // getPortfolioDataNew():Observable<Portfolio[]>{

  //   let portfolios:Portfolio[]=[];
  //   portfolios=this.allPortfolio;
  //   let instrument_arr:any[]=[];
  //   portfolios.map((elem)=>{
  //     elem.stocks?.map((stock)=>{
  //      instrument_arr.push(stock.instrumentId);
  //     })
  //   })
  //   console.log(instrument_arr);
  //   const httpHeaders=new HttpHeaders({
  //     'Content-type':'application/json'
  //   })

  //    let instrument_prices:InstrumentPrice[];
  //   // let request={instrumentIds:instrument_arr}
  //   // return this.http.post<InstrumentPrice[]>("http://localhost:3000/fmts/trades/prices/list",request,{headers:httpHeaders});

  //   console.log("before request");
  //   let request={instrumentIds:instrument_arr}
  //   return this.http.post<InstrumentPrice[]>("http://localhost:3000/fmts/trades/prices/list",request,{headers:httpHeaders})
  //   .pipe(catchError(this.handleError),
  //   switchMap((value:InstrumentPrice[],index:number)=>{
  //     console.log(value);
  //    const newport=portfolios.map((elem)=>{

  //       elem.stocks= elem.stocks?.map((data)=>
  //       {
  //         var currprice=value.find((obj)=>{
  //           return obj.instrument.instrumentId===data.instrumentId
  //         })
  //         console.log(currprice);
  //         if(currprice)
  //         {
  //         data.change=((data.value/data.quantity)-currprice?.bidPrice)
  //         }
  //         return data;
  //       })
  //       return elem;
  //     })
  //     console.log(newport);
  //     console.log(portfolios);
  //      return of(newport);
  //   }))







  // }

  getPortfolioDataNew():Observable<Portfolio[]>{
    return this.getPortfolioData()
      .pipe(
        switchMap((portfolios:Portfolio[],index:number)=>{
          let instrument_arr:any[]=[];
          portfolios.map((elem)=>{
            elem.stocks?.map((stock)=>{
            instrument_arr.push(stock.instrumentId);
            })
          })
          let instrument_prices:InstrumentPrice[];
          let request={instrumentIds:instrument_arr}
          return this.http.post<InstrumentPrice[]>("http://localhost:3000/fmts/trades/prices/list",request)
          .pipe(catchError(this.handleError),
          switchMap((value:InstrumentPrice[],index:number)=>{
            console.log(value);
          const newport=portfolios.map((elem)=>{
              let totalPresentStockValue:number=0;
              let totalInvestmentPrice:number=0

              elem.stocks= elem.stocks?.map((data)=>
              {

                totalInvestmentPrice+=data.price

                var currprice=value.find((obj)=>{
                  return obj.instrument.instrumentId===data.instrumentId
                })
                //console.log(currprice);
                if(currprice)
                {
                 data.change=-1*((data.price/data.quantity)-currprice?.bidPrice)
                 data.value=data.quantity*currprice.bidPrice
                 data.id=currprice.instrument.instrumentDescription
                 totalPresentStockValue+=data.value
                }
                return data;
              })
              elem.totalInvestmentPrice=totalInvestmentPrice
              elem.totalSharesWorth=totalPresentStockValue
              return elem;
            })
            console.log(newport);
            console.log(portfolios);
            return of(newport);
          }))

        })
      )
  }

  getTradeDetails() {

    //input received
    let instrument_name="AAA";
    let testtrad: Trade =
    {
      "tradeId": "a62375d7-bcb4-46a1-b2f0-5ba6719ae9b5",
      "quantity": 10,
      "executionPrice": 104.75,
      "direction": "S",
      order: new Order('123455', 4, 4.5, '123', 'B'),
      "cashValue": 1052.5,
      "clientId": 1,
      "instrumentId": "N123456",
      "portfolioId": "2222",
      "transactionAt": new Date(),
    }
    let response_arr:InstrumentPrice[]=[];
    let request_arr:any[]=[];
    request_arr.push(testtrad.instrumentId);
    let request=[{"instrumentIds":request_arr}];
    const httpHeaders=new HttpHeaders({
      'Content-type':'application/json'
    })
    this.http.post<InstrumentPrice[]>("http://localhost:3000/fmts/trades/prices/list",request,{headers:httpHeaders})
    .subscribe((data)=>response_arr=data);

    let length: number = 0;
    let newport: Portfolio[] = [];
    newport=this.allPortfolio.filter(t=>t.user_id===testtrad.clientId); //[{},{}]
    length = Object.keys(newport).length;
    console.log(newport);
    if(length>0)
    {
      console.log("user has exsiting  exisiting portfolios")
      let currPortfolio:Portfolio[]=[];
      currPortfolio=newport.filter(t=>t.portfolio_id===testtrad.portfolioId);//[{}]
      console.log(currPortfolio);
      let instrumentFound:boolean=false;
      if(Object.keys(currPortfolio).length>0)
      {
        this.allPortfolio.filter(t=>t.user_id===testtrad.clientId).filter(e=>e.portfolio_id===testtrad.portfolioId)[0].stocks?.map((elem)=>{
          if(elem.instrumentId===testtrad.instrumentId)
          {
            console.log("found");
            instrumentFound=true;
            if(testtrad.direction==='B')
            {
            elem.quantity=elem.quantity+testtrad.quantity;
            elem.value=elem.value+testtrad.cashValue;
            }
            else{
              elem.quantity=elem.quantity-testtrad.quantity;
              elem.value=elem.value-testtrad.cashValue;
            }
            //add logic for change value
          }

        })

        if(!instrumentFound)
        {


          this.allPortfolio.filter(t=>t.user_id===testtrad.clientId).filter(e=>e.portfolio_id===testtrad.portfolioId)[0].stocks?.push({
            "id":"12",
            "instrumentId":testtrad.instrumentId,
            "instrument":response_arr[0].instrument.externalIdType,
            "quantity":testtrad.quantity,
            "price":testtrad.executionPrice,
            "value":testtrad.cashValue,
            "change":0

          })

        }
      }




    }
    else{
      console.log("inside else");
      let defaultPort:Portfolio={
        portfolio_id:"6666",
        user_id:testtrad.clientId,
        portfolio_category:"BROKERAGE",
        portfolio_name:"Default Portfolio",
        "totalInvestmentPrice":1000,
        "totalSharesWorth":12000,
        portfolio_balance:testtrad.quantity*testtrad.executionPrice,
        stocks:[{ "id": "6", "instrumentId": testtrad.instrumentId, "instrument": response_arr[0].instrument.externalIdType, "quantity": testtrad.quantity, "value": testtrad.cashValue, "price": testtrad.executionPrice, "change": 0 }
      ]
      }
      this.allPortfolio.push(defaultPort);
      console.log(this.allPortfolio);

    }





  }




  //     },
  //     error: error => {
  //         this.handleError(error);
  //         console.error('There was an error!', error);

  //     }
  // })
  // }

  getInstrumentData(): void {
    console.log("portfolio service called for insytrument data");
    this.http.get<any>(this.instrumentInfoUrl).subscribe({
      next: data => {
        this.instrumentDetails = data;
        //console.log(this.instrumentDetails);


      },
      error: error => {
        this.handleError(error);
        console.error('There was an error!', error);

      }
    })
  }


  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occured: ${err.error.message}`;
    }

    else {

      errorMessage = `server returned code: ${err.status},error message is :${err.message}`;

    }

    console.log(errorMessage);

    return throwError(() => errorMessage);

  }

  createNewDefaultPortfolio():Observable<Portfolio>{
    let httpHeaders=new HttpHeaders()
    httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.clientService.getLogedInUserToken()}`)

    return this.http.post<Portfolio>(`${this.portfolioUrl}/client/default`,null,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError),
        switchMap((serverPortfolio:any,index:number)=>{

            const resp:Portfolio= new Portfolio(serverPortfolio.portfolioId,serverPortfolio.clientId,
              serverPortfolio.portfolioTypeName, serverPortfolio.portfolioName ,
              serverPortfolio.balance,[]);
              return of(resp);
          })
      );
  }


}
