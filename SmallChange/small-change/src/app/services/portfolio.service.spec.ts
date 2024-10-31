import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpTestingController: HttpTestingController;
  const mockportfolioV1=[
    {
      "portfolio_id": 2222,
      "user_id" : 1,
      "portfolio_category":"BROKERAGE",
      "portfolio_name":"Demo portfolio",
      "stocks":[
          { "id":1, "instrumentId": 28738384, "instrument_codename":"APL", "quantity":450, "value":89000, "price":776,"change":-4.07},
          { "id":2, "instrumentId": 87738384, "instrument_codename":"AMZ","quantity":450, "value":89000, "price":776, "change":10.99}
      ],
      "portfolio_balance":100000}
  ];
  const mockportfolioV2=[
    {
      "portfolioId": 2222,
      "clientId" : 1,
      "portfolioTypeName":"BROKERAGE",
      "portfolioName":"Demo portfolio",
      "holdings":[
          { "id":1, "instrumentId": 28738384, "instrument_codename":"APL", "quantity":450, "value":89000, "price":776,"change":-4.07},
          { "id":2, "instrumentId": 87738384, "instrument_codename":"AMZ","quantity":450, "value":89000, "price":776, "change":10.99}
      ],
      "balance":100000}
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
        ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return portfolios', inject([PortfolioService],
    fakeAsync((service: PortfolioService) => {
    let portfolios: any[] = [];
    service.getPortfolioData()
    .subscribe(data => {console.log(data);portfolios = data});
    const req = httpTestingController.expectOne('http://localhost:8080/portfolios/client');
    expect(req.request.method).toEqual('GET');

    req.flush(mockportfolioV2);

    httpTestingController.verify();
    tick();
    expect(portfolios).toBeTruthy();
    expect(portfolios[0].portfolio_name).toBe('Demo portfolio');
   })));

   it('should handle service error', fakeAsync( ()=>{
    const spyObject=spyOn(service,'handleError').and.callThrough()
    let errorMsg=''
    let resData:any[]=[]
    service.getPortfolioData().
    subscribe(
      { next:data=> fail("false"),
      error:(e)=> errorMsg=e}
    )
    const req=httpTestingController.expectOne('http://localhost:8080/portfolios/client')
    expect(req.request.method).toBe('GET')
    req.flush('Attribute error',{
      status:404,
      statusText:'Illegal url'
    })
    httpTestingController.verify()
    tick()
    const errorResponse=spyObject.calls.argsFor(0)[0]
    expect(errorResponse.status).toBe(404)
  }))


});
