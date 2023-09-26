import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastService } from 'src/app/toast/toast.service';
import { PreferenceService } from '../preference.service';

import { PreferenceDetailsComponent } from './preference-details.component';

describe('PreferenceDetailsComponent', () => {
  let component: PreferenceDetailsComponent;
  let fixture: ComponentFixture<PreferenceDetailsComponent>;
  let mockRouter:any;
  let mockToastService:any;
  let mockpreferenceService:any;

  beforeEach(async () => {
    mockRouter=jasmine.createSpyObj(['navigate'])
    mockRouter.navigate.and.callFake((params:any)=>{})

    mockToastService=jasmine.createSpyObj(['showInformation'])
    mockToastService.showInformation.and.callFake((params:any)=>{})

    mockpreferenceService=jasmine.createSpyObj(['getInvestmentPreferenceOfuser'])

    await TestBed.configureTestingModule({
      declarations: [ PreferenceDetailsComponent ],
      providers:[
        {provide:ToastService, useValue:mockToastService},
        {provide:Router, useValue:mockRouter},
        {provide:PreferenceService, useValue:mockpreferenceService}
      ]
    })
    .compileComponents();
    mockpreferenceService.getInvestmentPreferenceOfuser.and.returnValue(
      of({
        investmentPurpose:'Retirement',
        incomeCategory:'LOW',
        riskTolerance:'CONSERVATIVE',
        lengthOfInvestment:'LOW'
      }))
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the details when the user investment preference is there',()=>{
    mockpreferenceService.getInvestmentPreferenceOfuser.and.returnValue(
      of({
        investmentPurpose:'Retirement',
        incomeCategory:'BASIC',
        riskTolerance:'CONSERVATIVE',
        lengthOfInvestment:'LOW'
      }))
      component.ngOnInit()
      const paras=fixture.debugElement.queryAll(By.css('p'))
      expect(paras.length).toBe(4)
      expect(paras[0].nativeElement.textContent).toContain('Retirement')
      expect(paras[1].nativeElement.textContent).toContain('5-7 years')
      expect(paras[2].nativeElement.textContent).toContain('20,001 - 40,000')
      expect(paras[3].nativeElement.textContent).toContain('CONSERVATIVE')

      expect(mockRouter.navigate).not.toHaveBeenCalled()
  })

  it('should redirect user to set investment preference if he .she has not set',()=>{
    mockpreferenceService.getInvestmentPreferenceOfuser.and.returnValue(
      of(undefined))
      component.ngOnInit()
      expect(mockRouter.navigate).toHaveBeenCalled()
  })

});
