import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { PortfolioService } from 'src/app/services/portfolio.service';

import { PortfolioPageComponent } from './portfolio-page.component';

describe('PortfolioPageComponent', () => {
  let component: PortfolioPageComponent;
  let fixture: ComponentFixture<PortfolioPageComponent>;
  let MockPortfolioService:any=null;
  const mockportfolio=[
    {
      "portfolio_id": 2222,
      "user_id" : 1,
      "portfolio_category":"BROKERAGE",
      "portfolio_name":"Demo portfolio",
      "stocks":[
          { "id":1, "instrumentId": "APL", "instrument_codename":"APL", "quantity":450, "value":89000, "price":776,"change":-4.07},
          { "id":2, "instrumentId": 87738384, "instrument_codename":"AMZ","quantity":450, "value":89000, "price":776, "change":10.99}
      ],
      "portfolio_balance":100000}
  ]
  let stockspy:null;
  MockPortfolioService=jasmine.createSpyObj('PortfolioService',['getPortfolioDataNew','createNewDefaultPortfolio']);
  stockspy=MockPortfolioService.getPortfolioDataNew.and.returnValue(of(mockportfolio));
  MockPortfolioService.createNewDefaultPortfolio.and.returnValue(of(mockportfolio[0]));


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioPageComponent ],
      providers:[{provide:PortfolioService, useValue:MockPortfolioService}],
    })
    .compileComponents();
    fixture = TestBed.createComponent(PortfolioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct page title', () => {
    expect(fixture.debugElement.nativeElement.querySelector('h2').textContent) // Testing the contentof h1 tag
.toContain('Portfolio');
});

it('should return right table content',fakeAsync(()=>{

  component.ngOnInit()
  fixture.detectChanges()
  const compiled = fixture.debugElement.nativeElement;
    const table = compiled.querySelector('table');
    //console.log(table)
    fixture.detectChanges()
  expect(table.rows[1].cells[0].textContent).toBe('APL');
}));

it('should call the portfolio service to fetch the data', () => {
  component.getUserPortfolioData();
  expect(stockspy).toHaveBeenCalled();
});

it("shoud show create default portfolio button on no user portfolios",fakeAsync(()=>{
  MockPortfolioService.getPortfolioDataNew.and.returnValue(of([]));
  component.ngOnInit()
  fixture.detectChanges()
  const createButton=fixture.debugElement.query(By.css('#create-button'))

  expect(createButton!=undefined).toBeTruthy();

}))


});


