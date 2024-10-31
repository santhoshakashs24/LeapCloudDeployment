import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InstrumentCategory } from '../models/instrument-category';
import { InstrumentPrice } from '../models/instrument-price';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { InstrumentService } from './instrument.service';

describe('InstrumentService', () => {
  let service: InstrumentService;
  let httpController:HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(InstrumentService);
    httpController=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrive all the instrument categories',fakeAsync(()=>{
    service.categories=[
      {
        categoryId:'3',
        categoryName:'Cat -2'
      }
    ]
    let returnedCategories:InstrumentCategory[]=[];
    service.getAllCategories().subscribe(data=> returnedCategories=data);
    tick()
    expect(returnedCategories.length).toBe(1)
  }))

  it('should handle server error',fakeAsync(()=>{
    let errorMessage=''
    const spyHandleError=spyOn(service,'handleError').and.callThrough()
    service.getInstrumentsByCategory('4').subscribe({
      next:()=> fail('should not be executed'),
      error:(e)=> errorMessage=e
    });
    const req=httpController.expectOne('http://localhost:3000/fmts/trades/prices/4')
      req.flush('Server Error',{
        status:500,
        statusText:'Internal Server error'
      })
      httpController.verify()
      tick(4000)
      expect(errorMessage).toBe('Error occured, please try again later')
      const resp=spyHandleError.calls.argsFor(0)[0]
      expect(resp.status).toBe(500)
  }))

  it('should return instrument pricing based on the category sent to the service',fakeAsync(()=>{
    const instruments=[
      {
        instrumentId:'678-123-457',
        instrumentDescription:'Alphabet dummy' ,
        externalIdType:'CUSIP',
        externalId:'02079K104',
        categoryId:'4',
        minQuantity:4 ,
        maxQuantity:20
      },
      {
        instrumentId:'768-345-558',
        instrumentDescription:'Alaska Air Group' ,
        externalIdType:'CUSIP',
        externalId:'011659104',
        categoryId:'4',
        minQuantity:4 ,
        maxQuantity:200
      }]

      const instrumentPrices  = [
        {
          'instrumentId':'678-123-457',
          askPrice:48,
          bidPrice:49.56,
          priceTimestamp:new Date(Date.now()),
          instrument:instruments[0],
        },
        {
          'instrumentId':'768-345-558',
          askPrice:121,
          bidPrice:124.56,
          priceTimestamp:new Date(Date.now()),
          instrument:service.instruments[1],
        }]

      let returnedInstruments: InstrumentPrice[]=[]
      service.getInstrumentsByCategory('4').subscribe(data=> returnedInstruments=data);

      const req=httpController.expectOne('http://localhost:3000/fmts/trades/prices/4')
      req.flush(instrumentPrices)
      httpController.verify()
      tick(4000)
      console.log(returnedInstruments)
      expect(returnedInstruments.length).toEqual(2)
      expect(returnedInstruments[0].instrument.instrumentId).toBe('678-123-457')

  }))
});
