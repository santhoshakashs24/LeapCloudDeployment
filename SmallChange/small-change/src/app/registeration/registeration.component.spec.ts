import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserServiceService } from '../services/user-service.service';

import { RegisterationComponent } from './registeration.component';

describe('RegisterationComponent', () => {
  let component: RegisterationComponent;
  let fixture: ComponentFixture<RegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterationComponent ],
      imports:[
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate content', () => {
    const emailCtrl = component.registrationForm.get('email');
    const dobCtrl = component.registrationForm.get('dob');
    const countryCtrl = component.registrationForm.get('country');
    const postalCodeCtrl = component.registrationForm.get('postalCode');
    const usernameCtrl = component.registrationForm.get('userName');
    const passwordCtrl = component.registrationForm.get('password');
    const idtypeCtrl = component.registrationForm.get('identification_type');
    const idvalueCtrl = component.registrationForm.get('identification_value');

    expect(component.registrationForm.valid).toBe(false);
    expect(emailCtrl?.hasError('required')).toBe(true);
    expect(dobCtrl?.hasError('required')).toBe(true);
    expect(countryCtrl?.hasError('required')).toBe(true);
    expect(postalCodeCtrl?.hasError('required')).toBe(true);
    expect(usernameCtrl?.hasError('required')).toBe(true);
    expect(passwordCtrl?.hasError('required')).toBe(true);
    expect(idtypeCtrl?.hasError('required')).toBe(true);
    expect(idvalueCtrl?.hasError('required')).toBe(true);
    // // Not asked for, but obvious test to add with additional validation
    // titleCtrl?.setValue('T');
    // expect(titleCtrl?.hasError('minlength')).toBe(true);

    // titleCtrl?.setValue('The Inklings');
    // authorCtrl?.setValue('Humphrey Carpenter');

    // expect(component.bookForm.valid).toBe(true);
});
});
