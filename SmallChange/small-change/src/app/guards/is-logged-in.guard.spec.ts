import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

import { IsLoggedInGuard } from './is-logged-in.guard';

describe('IsLoggedInGuard', () => {
  let guard: IsLoggedInGuard;
  let routerStub;
  let userService;

  beforeEach(() => {
    routerStub=jasmine.createSpyObj('router', ['navigate']);
    userService=jasmine.createSpyObj('UserServiceService',['isLoggedIn'])
    // userService.isLoggedIn.and.returnValue(true);
    TestBed.configureTestingModule({
      providers:[{provide: UserServiceService, useValue:userService},
        { provide: Router, useValue: routerStub }]
    });
    guard = TestBed.inject(IsLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
