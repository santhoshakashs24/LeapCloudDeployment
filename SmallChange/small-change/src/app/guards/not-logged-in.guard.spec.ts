import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

import { NotLoggedInGuard } from './not-logged-in.guard';

describe('NotLoggedInGuard', () => {
  let guard: NotLoggedInGuard;
  let routerStub;
  let userService;

  beforeEach(() => {
    routerStub=jasmine.createSpyObj('router', ['navigate']);
    userService=jasmine.createSpyObj('UserServiceService',['isLoggedIn'])
    TestBed.configureTestingModule({
      providers:[
        {provide: UserServiceService, useValue:userService},
        {provide: Router, useValue: routerStub}]
    });
    guard = TestBed.inject(NotLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
