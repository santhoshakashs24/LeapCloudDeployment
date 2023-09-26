import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Trade } from 'src/app/models/trade';
import { TradeHisService } from 'src/app/services/trade-his.service';

import { ExpandPipe, TradeHistoryComponent } from './trade-history.component';

describe('TradeHistoryComponent', () => {
  let component: TradeHistoryComponent;
  let fixture: ComponentFixture<TradeHistoryComponent>;
  let trades:Trade[]=[
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

  let tradeHisService = jasmine.createSpyObj('TradeHisService', ['getTradeHis']); 
  tradeHisService.getTradeHis.and.returnValue(of(trades));
  beforeEach(async () => {
      await TestBed.configureTestingModule({
      declarations: [ TradeHistoryComponent,ExpandPipe ],
      providers: [ 
        { provide: TradeHisService, useValue: tradeHisService } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should contain a table and retrieve trades from the service',()=>{
    const compiled = fixture.debugElement.nativeElement;
    const table = compiled.querySelector('table table');
    expect(table.rows.length).toBe(3);
    expect(table.rows[1].cells[0].textContent).toBe('A1234');
    expect(tradeHisService.getTradeHis).toHaveBeenCalled();
  });

});
