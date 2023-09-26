import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

import { LogOutComponent } from './log-out.component';

describe('LogOutComponent', () => {
  let component: LogOutComponent;
  let fixture: ComponentFixture<LogOutComponent>;
  let mockRouter:any;
  let mockUserService:any;

  beforeEach(async () => {

    mockUserService=jasmine.createSpyObj(['logout'])
    mockUserService.logout.and.callFake(()=>{})

    mockRouter=jasmine.createSpyObj(['navigate'])
    mockRouter.navigate.and.callFake((params:any)=>{})
    await TestBed.configureTestingModule({
      declarations: [ LogOutComponent ],
      providers:[{provide:Router, useValue:mockRouter},
      {provide:UserServiceService, useValue:mockUserService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout method on clicking on yes',()=>{
    const button=fixture.debugElement.query(By.css('button')).nativeElement
    button.dispatchEvent(new Event('click'))
    fixture.detectChanges()
    expect(mockUserService.logout).toHaveBeenCalled()
  })
});
