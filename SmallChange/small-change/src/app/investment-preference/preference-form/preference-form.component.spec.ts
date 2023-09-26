import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToastService } from 'src/app/toast/toast.service';
import { PreferenceService } from '../preference.service';

import { PreferenceFormComponent } from './preference-form.component';

describe('PreferenceFormComponent', () => {
  let component: PreferenceFormComponent;
  let fixture: ComponentFixture<PreferenceFormComponent>;
  let mockToastService:any;
  let mockPreferenceService:any;

  beforeEach(async () => {

    mockPreferenceService=jasmine.createSpyObj(['getInvestmentPreferenceOfuser','setInestmentPreference'])

    mockPreferenceService.getInvestmentPreferenceOfuser.and.returnValue(of(undefined))
    mockPreferenceService.setInestmentPreference.and.callFake((params:any)=>{
      return of(params)
    })

    mockToastService=jasmine.createSpyObj(['showError','showSuccess'])
    mockToastService.showError.and.callFake((params:any)=>{})
    mockToastService.showSuccess.and.callFake((params:any)=>{})

    await TestBed.configureTestingModule({
      declarations: [ PreferenceFormComponent ],
      imports:[ReactiveFormsModule,RouterTestingModule],
      providers:[FormBuilder, {provide:ToastService, useValue:mockToastService},
      {provide:PreferenceService, useValue:mockPreferenceService} ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefil the form details , when user has already set his preference',()=>{
    mockPreferenceService.getInvestmentPreferenceOfuser.and.returnValue(
      of({
        investmentPurpose:'Retirement',
        incomeCategory:'LOW',
        riskTolerance:'CONSERVATIVE',
        lengthOfInvestment:'BASIC'
      }))
      component.ngOnInit()
      fixture.detectChanges()
      expect(component.preferenceForm.get('investmentPurpose')?.value).toBe('Retirement')
      expect(component.preferenceForm.get('lengthOfInvestment')?.value).toBe('BASIC')
      expect(component.preferenceForm.get('riskTolerance')?.value).toBe('CONSERVATIVE')
      expect(component.preferenceForm.get('incomeCategory')?.value).toBe('LOW')
      expect(component.preferenceForm.dirty).toBeFalsy()
    })

    it('should take user preference and successfully update his/her preference',()=>{
      expect(component.preferenceForm.valid).toBeFalsy()
      component.preferenceForm.get('investmentPurpose')?.setValue('Retirement')
      component.preferenceForm.get('lengthOfInvestment')?.setValue('BASIC')
      component.preferenceForm.get('riskTolerance')?.setValue('CONSERVATIVE')
      component.preferenceForm.get('incomeCategory')?.setValue('LOW')
      expect(component.preferenceForm.valid).toBeTruthy()
      fixture.detectChanges()
      const button=fixture.debugElement.queryAll(By.css('button'))[0].nativeElement
      button.dispatchEvent(new Event('click'))
      fixture.detectChanges()
      expect(mockPreferenceService.setInestmentPreference).toHaveBeenCalledOnceWith({
        investmentPurpose:'Retirement',
        incomeCategory:'LOW',
        riskTolerance:'CONSERVATIVE',
        lengthOfInvestment:'BASIC'
      })
    })
});
