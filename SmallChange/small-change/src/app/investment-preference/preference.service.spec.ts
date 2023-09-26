import { TestBed } from '@angular/core/testing';
import { UserServiceService } from '../services/user-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;
  let mockUserService:any;

  beforeEach(() => {
    mockUserService=jasmine.createSpyObj(['getLoginUserId'])
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[{provide:UserServiceService, useValue:mockUserService}]
    });
    service = TestBed.inject(PreferenceService);
    mockUserService.getLoginUserId.and.returnValue(12352426)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
