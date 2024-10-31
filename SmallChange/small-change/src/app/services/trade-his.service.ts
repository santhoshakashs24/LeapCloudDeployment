import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Pipe,PipeTransform } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Trade } from '../models/trade';
import { User } from '../models/user';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class TradeHisService {

  // trades:Trade[]=[
  //   {
  //     instrumentId:'A1234',
  //     quantity:24,
  //     executionPrice:200,
  //     direction:'B',
  //     order:undefined,
  //     clientId:123,
  //     tradeId:'T123',
  //     cashValue:3500,
  //     portfolioId:"123",
  //     transactionAt:new Date(Date.now())
  //   },
  //   {
  //     instrumentId:'A2341',
  //     quantity:20,
  //     executionPrice:300,
  //     direction:'S',
  //     order:undefined,
  //     clientId:456,
  //     tradeId:'T234',
  //     cashValue:4505,
  //     portfolioId:"123" ,
  //     transactionAt:new Date(Date.now())
  //   },
  //   {
  //     instrumentId:'A2341',
  //     quantity:20,
  //     executionPrice:300,
  //     direction:'S',
  //     order:undefined,
  //     clientId:456,
  //     tradeId:'T234',
  //     cashValue:4505,
  //     portfolioId:"123" ,
  //     transactionAt:new Date(Date.now())
  //   },
  //   {
  //     instrumentId:'A2341',
  //     quantity:20,
  //     executionPrice:300,
  //     direction:'S',
  //     order:undefined,
  //     clientId:456,
  //     tradeId:'T234',
  //     cashValue:4505,
  //     portfolioId:"123" ,
  //     transactionAt:new Date(Date.now())
  //   },
  //   {
  //     instrumentId:'A2341',
  //     quantity:20,
  //     executionPrice:300,
  //     direction:'S',
  //     order:undefined,
  //     clientId:1,
  //     tradeId:'T234',
  //     cashValue:4505,
  //     portfolioId:"123" ,
  //     transactionAt:new Date(Date.now())
  //   }
  // ];

  activityUrl="http://localhost:8080/activity/client"

  constructor(private clientService:UserServiceService,private httpClient:HttpClient) { }


  getTradeHis():Observable<Trade[]>{
    let httpHeaders=new HttpHeaders()
    httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.clientService.getLogedInUserToken()}`)

    return this.httpClient.get<Trade[]>(`${this.activityUrl}`,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError));
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




}


