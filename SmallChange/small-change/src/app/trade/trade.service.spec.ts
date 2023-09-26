import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Order } from '../models/order';
import { Trade } from '../models/trade';
import { UserServiceService } from '../services/user-service.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { TradeService } from './trade.service';

describe('TradeService', () => {
  let service: TradeService;
  let mockUserService:any;
  let httpController:HttpTestingController

  beforeEach(() => {
    mockUserService=jasmine.createSpyObj(['getLoginUserId','getLoginUserEmail','getLogedInUserToken'])
    TestBed.configureTestingModule({
      providers:[{provide: UserServiceService, useValue:mockUserService}],
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(TradeService);
    httpController=TestBed.inject(HttpTestingController)
    mockUserService.getLoginUserId.and.returnValue(78658709)
    mockUserService.getLoginUserEmail.and.returnValue('nikhil@123')
    mockUserService.getLogedInUserToken.and.returnValue(2452323)


  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should place order ', fakeAsync( ()=>{
    const order=new Order('123455',4,4.5,'123','B');
    let respOrder!:Trade
    service.buyAInstrument(order).subscribe(expecutedOrder=>{
      respOrder=expecutedOrder
    })
    const req=httpController.expectOne('http://localhost:8080/trade')
    expect(req.request.method).toBe('POST')

    expect(req.request.body).toEqual(order)

    req.flush({
      "tradeId": "a62375d7-bcb4-46a1-b2f0-5ba6719ae9b5",
    "quantity": order.quantity,
    "executionPrice": order.targetPrice,
    "direction": order.direction,
    "order":order,
    "cashValue": order.quantity*order.targetPrice,
    "clientId": 78658709,
    "instrumentId": order.instrumentId
    })
    httpController.verify()

    tick()
    expect(respOrder.clientId).toBe(78658709)
    expect(respOrder.order?.orderId).not.toBeNull()
  }))

  it('should throw error on session timeout ', fakeAsync( ()=>{
    //mockUserService.getLoginUserId.and.returnValue(undefined)
    const order=new Order('123455',4,4.5,'123','B');
    let errorMessage:string='';
    service.buyAInstrument(order).subscribe({
      next:() =>fail('should not be'),
      error: (e)=> errorMessage=e
    })

    const req=httpController.expectOne('http://localhost:8080/trade')
    expect(req.request.method).toBe('POST')


    expect(req.request.body).toEqual(order)

    req.flush('Timeout',{
      status:406,
      statusText:'Timeout'
    })
    httpController.verify()

    tick()
    expect(errorMessage).toBe('Session timed out, lease login to get services')
  }))

  // it('should throw error on 5% variation in price ', fakeAsync( ()=>{
  //   //mockUserService.getLoginUserId.and.returnValue(undefined)
  //   const order=new Order('123455',4,4.5,'123','B');
  //   let errorMessage:string='';
  //   service.buyAInstrument(order).subscribe({
  //     next:() =>fail('should not be'),
  //     error: (e)=> errorMessage=e
  //   })

  //   const req=httpController.expectOne('http://localhost:3000/fmts/trades/trade')
  //   expect(req.request.method).toBe('POST')

  //   const expectedBody={
  //     ...order,
  //     clientId:mockUserService.getLoginUserId(),
  //     email:mockUserService.getLoginUserEmail(),
  //     token:mockUserService.getLogedInUserToken()
  //   }

  //   expect(req.request.body).toEqual(expectedBody)

  //   req.flush('Price change',{
  //     status:409,
  //     statusText:'Price change'
  //   })
  //   httpController.verify()

  //   tick()
  //   expect(errorMessage).toBe('The trade price was changed more than 5%, please review order')
  // }))

});
