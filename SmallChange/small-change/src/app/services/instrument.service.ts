import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, delay, map, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Instrument } from '../models/instrument';
import { InstrumentCategory } from '../models/instrument-category';
import { InstrumentPrice } from '../models/instrument-price';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {

  private instrumentUrl:string='http://localhost:3000/fmts/trades/prices'

  instruments:Instrument[]=[
    {
      instrumentId:'123-123-456',
      instrumentDescription:'Apple Inc.' ,
      externalIdType:'CUSIP',
      externalId:'037833100',
      categoryId:'1',
      minQuantity:1 ,
      maxQuantity:200
    },
    {
      instrumentId:'678-123-456',
      instrumentDescription:'Alphabet Inc.' ,
      externalIdType:'CUSIP',
      externalId:'02079K107',
      categoryId:'2',
      minQuantity:3 ,
      maxQuantity:19
    },
    {
      instrumentId:'768-345-556',
      instrumentDescription:'Alaska Air Group' ,
      externalIdType:'CUSIP',
      externalId:'011659109',
      categoryId:'1',
      minQuantity:1 ,
      maxQuantity:20
    },
    {
      instrumentId:'123-456-456',
      instrumentDescription:'Walmart Stores, Inc. ' ,
      externalIdType:'CUSIP',
      externalId:'931142103',
      categoryId:'2',
      minQuantity:1 ,
      maxQuantity:200
    }
  ]

  categories:InstrumentCategory[]=[
    {
      categoryId:'GOVT',
      categoryName:'Government Instruments'
    },
    {
      categoryId:'STOCK',
      categoryName:'Non Government Instruments'
    },
    {
      categoryId:' ',
      categoryName:'All Instruments'
    }
  ]

  instrumentPrices :InstrumentPrice[]  = [
    {
      'instrumentId':'123-123-456',
      askPrice:34,
      bidPrice:33.56,
      priceTimestamp:new Date(Date.now()),
      instrument:this.instruments[0],
    },
    {
      'instrumentId':'678-123-456',
      askPrice:40,
      bidPrice:41.56,
      priceTimestamp:new Date(Date.now()),
      instrument:this.instruments[1],
    },
    {
      'instrumentId':'768-345-556',
      askPrice:120,
      bidPrice:121.56,
      priceTimestamp:new Date(Date.now()),
      instrument:this.instruments[2],
    },
    {
      'instrumentId':'123-456-456',
      askPrice:180,
      bidPrice:182.12,
      priceTimestamp:new Date(Date.now()),
      instrument:this.instruments[3],
    },

  ]



  constructor(private http:HttpClient) { }

  getAllCategories():Observable<InstrumentCategory[]>{
    return of(this.categories);
  }

  getInstrumentsByCategory(categoryId:string) :Observable<InstrumentPrice[]> {
    // return of(this.instruments.filter(i => i.categoryId===categoryId))
    // .pipe(
    //   mergeMap(data=> {
    //     let instrumentIds:string[]=data.map(i => i.instrumentId);
    //     return this.getTheInstrumentPriceDetails(instrumentIds).pipe(
    //       map(prices=> { return prices;}),
    //       delay(1000)
    //     )
    //   })
    // )

    // getting the insruments from the server and then populating the instrument id
    return this.http.get<InstrumentPrice[]>(`${this.instrumentUrl}/${categoryId}`).pipe(
      catchError(this.handleError),
      switchMap((value:InstrumentPrice[],index:number)=>{
        return of(value.map(p=>{ p.instrumentId=p.instrument.instrumentId; return p }));
      })
    )
  }

  getTheInstrumentPriceDetails(instrumentIds:string[]): Observable<InstrumentPrice[]>{
    return of(this.instrumentPrices.filter( ip => instrumentIds.includes(ip.instrumentId))).pipe(
      delay(1000)
    )
  }

  handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error("Error occured with message ",error.error.message)
    }else{
      console.error("Server error with code ",error.status," with message ",error.statusText)
    }
    return throwError(()=>"Error occured, please try again later")
  }
}
