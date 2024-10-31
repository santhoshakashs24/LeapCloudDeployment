import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { TradeHistoryComponent } from '../activity/trade-history/trade-history.component';
import { Order } from '../models/order';
import { Trade } from '../models/trade';

import { TradeHisService } from './trade-his.service';
import { UserServiceService } from './user-service.service';

describe('TradeHisService', () => {
  let service: TradeHisService;

  let httpTestingController: HttpTestingController;
  let mockUserService;
  let mocktrades:Trade[]=[
    {
      instrumentId:'A1234',
      quantity:24,
      executionPrice:200,
      direction:'B',
      order:undefined,
      clientId:123,
      tradeId:'T123',
      cashValue:3500,
      portfolioId:"123",
      transactionAt:new Date(Date.now())
    },
    {
      instrumentId:'A2341',
      quantity:20,
      executionPrice:300,
      direction:'S',
      order:undefined,
      clientId:456,
      tradeId:'T234',
      cashValue:4505,
      portfolioId:"123" ,
      transactionAt:new Date(Date.now())
    }
  ];

  beforeEach(() => {
    mockUserService=jasmine.createSpyObj(['getLoginUserId','getLogedInUserToken'])
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[{provide:UserServiceService, useValue:mockUserService}]
    });
    service = TestBed.inject(TradeHisService);
    mockUserService.getLoginUserId.and.returnValue(123);
    httpTestingController=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return trades', inject([TradeHisService],
    fakeAsync((service: TradeHisService) => {
    let trades: Trade[] = [];
    service.getTradeHis()
    .subscribe(data => trades = data);
      const req=httpTestingController.expectOne("http://localhost:8080/activity/client")
      req.flush(mocktrades)

      httpTestingController.verify()

    tick();
    expect(trades).toBeTruthy();
    //console.log(trades)
    expect(trades[0].clientId).toBe(123);
    })));

    // it('should add a trade', inject([TradeHisService],
    // fakeAsync((service: TradeHisService) => {
    // let trades: Trade[] = [];
    // let order:Order = new Order("",-1,-1,"","");
    // let added: Trade = new Trade("",-1,-1,"",order,-1,-1,"","",new Date(Date.now()));
    // const expected = new Trade("T123",24,201,"S",undefined,3500,123,'A1234','123',new Date(Date.now()));
    // service.getTradeHis()
    // .subscribe(data => trades = data);
    // tick();
    // const expectedLength = trades.length + 1;
    // service.addTradeHis(expected)
    // .subscribe(data => added = data);
    // service.getTradeHis()
    // .subscribe(data => trades = data);
    // tick();
    // expect(trades.length).toBe(expectedLength);
    // expect(trades[0]).toBe(expected);
    // expect(added).toBe(expected); })));
});

