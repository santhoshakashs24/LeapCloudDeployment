import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of,  tap,  throwError } from 'rxjs';
import { Order } from '../models/order';
import { UserServiceService } from '../services/user-service.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Trade } from '../models/trade';
import { TradeHisService } from '../services/trade-his.service';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private tradeUrl:string="http://localhost:3000/fmts/trades/trade";
  private tradeUrlnew:string="http://localhost:8080/trade";

  constructor(private userService:UserServiceService,private http:HttpClient, private activityService:TradeHisService) {
   }

  buyAInstrument(order:Order) : Observable<Trade> {
    const userId=this.userService.getLoginUserId()
    if(userId){
      order.setClientId(userId);
      // const oderData={
      //   ...order,
      //   email: this.userService.getLoginUserEmail(),
      //   clientId:userId,
      //   token:this.userService.getLogedInUserToken()
      // }
      console.log(order);
      let httpHeaders=new HttpHeaders()
      httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.userService.getLogedInUserToken()}`)
  
      // const httpHeaders=new HttpHeaders({
      //   'Content-type':'application/json',
      //   'Authorization':`Bearer ${this.userService.getLogedInUserToken}`
      // })
      return this.http.post<Trade>(this.tradeUrlnew,order,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError),
      )
    }else{
      return throwError(()=>'Please re login to buy a instrument')
    }

  }

  handleError(error:HttpErrorResponse){
    console.log(error);
    if(error.error instanceof ErrorEvent){
      console.error("Error occured ",error.error.message)
    }else{
      console.error("Server error status code ",error.status,' with text ', error.statusText)
      if(error.status==406){
        return throwError(()=>'Session timed out, lease login to get services')
      }
      if(error.status==409){
        return throwError(()=>"The trade price was changed more than 5%, please review order")
      }
    }
    return throwError(()=>'Error occured please try again later')
  }


}
