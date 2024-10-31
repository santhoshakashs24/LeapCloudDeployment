import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { UserServiceService } from './user-service.service';
import * as uuid from "uuid";
import { of } from 'rxjs';
import { User } from '../models/user';

describe('UserServiceService', () => {
  let service: UserServiceService;
  let httpController: HttpTestingController
  const testData=[
    new User(
      NaN,
      'testSER@email.com',
      new Date('1999-09-11'),
      'IN',
      '560061',
      '8767565609',
      'Nikhil1@123',
      'Nikhil V',
      [{type:'SSN',value:'87698765'}]
    )
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(UserServiceService);
    httpController=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successful for esisting user', fakeAsync( ()=>{
    //service.users=testData;
    console.log(service.users)

    let resp=false;
    service.authenticateUser('testSER@email.com','Nikhil1@123').subscribe(data => resp=data)

    const req=httpController.expectOne('http://localhost:8080/clients/login')
    expect(req.request.method).toBe('POST')
    req.flush({
      ...testData[0],
      token:87656789,
      clientId:87556789
    })
    httpController.verify()
    tick()
    expect(resp).toBe(true);
    expect(service.getLoginUserId()).toBe(87556789)
  }))

  it('should return false while authenticating with incorrect password', fakeAsync( ()=>{
    //service.users=testData
    let errorMessage=""
    service.authenticateUser('testSER@email.com','Nikhil1@1234').subscribe(
      {next:data=> fail("should not excute"),
      error:(err)=>errorMessage=err})

    const req=httpController.expectOne('http://localhost:8080/clients/login')
    expect(req.request.method).toBe('POST')

    req.flush(400,{
      status:400,
      statusText:'Incorrect Credentials'
    })

    httpController.verify()
    tick()

    expect(errorMessage!="").toBeTruthy();

  }))

  // it('should create new user on non existing user registration', fakeAsync( ()=>{
  //   service.users=testData
  //   let userIdDummy=65456890;
  //   spyOn(service,'registerNewUser').and.callFake((user:User)=>{
  //     user.clientId=userIdDummy;
  //     return of(user)
  //   })

  //   let returnedUser:User|undefined;
  //   let newUser:User=new User(undefined,'dummy@gmail.com',new Date('1999-09-11'),'IN','560043','pass@#A','Dummy User');
  //   service.registerNewUser(newUser).subscribe(data=>returnedUser=data)
  //   tick()
  //   if(returnedUser){
  //     expect(newUser.userName).toEqual(returnedUser.userName)
  //     expect(returnedUser.userId).toEqual(userIdDummy)
  //   }else{
  //     fail('The returned user should not be null')
  //   }
  // }))

  // it('should throw error on create new user of an existing user registration', fakeAsync( ()=>{
  //   service.users=[
  //     {
  //       userId:'123-123-235',
  //       email:'testSER@email.com',
  //       userName:'Test Nikhil V1',
  //       dateOfBirth:new Date('1999-09-11'),
  //       country:'IN',
  //       postalCode:'560061',
  //       password:'Nikhil1@123'
  //     }
  //   ];
  //   let userIdDummy=uuid.v4();
  //   // spyOn(service,'registerNewUser').and.callFake((user:User)=>{
  //   //   user.userId=userIdDummy;
  //   //   return of(user)
  //   // })
  //   let errorMessage:string|undefined;
  //   let returnedUser:User|undefined;
  //   let newUser:User=new User(undefined,'testSER@email.com',new Date('1999-09-11'),'IN','560043','pass@#A','Dummy User');
  //   service.registerNewUser(newUser).subscribe({
  //     next:()=> fail('It should not create new user'),
  //     error: (e)=> errorMessage=e
  //   })
  //   tick()
  //   expect(errorMessage).toEqual('Already user with is email present')
  // }))


});
