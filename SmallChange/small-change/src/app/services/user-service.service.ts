import { Injectable } from '@angular/core';
import { catchError, map, merge, mergeMap, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ClientIdentification } from '../models/client-identification';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  //private clientUrl="http://localhost:3000/fmts/client"
  private clientUrl="http://localhost:8080/clients/login"
  private registerUrl="http://localhost:8080/clients/register"
  users:User[]=[
    new User(
      NaN,
      'user1@gmail.com',
      new Date('1999-09-11'),
      'IN',
      '560061',
      '1234567890',
      'Nikhil@123',
      'Nikhil V',
      [{type:'SSN',value:'87698765'}]
    ),
    new User(
      NaN,
      'user2@email.com',
      new Date('2000-09-11'),
      'IN',
      '560061',
      '1234567890',
      'Nikhil@123',
      'Nikhil V 2',
      [{type:'SSN',value:'09456433'}]
    )
  ]

  private loggedInUser?:User;

  constructor(private http:HttpClient) {
    // this.http.get<User[]>('http://localhost:4200/assets/db/clients.json').subscribe(
    //   data=> {
    //     const mappedData=data.map(u=>{
    //       return new User(u.clientId, u.email, u.dateOfBirth, u.country, u.postalCode, u.password
    //         , u.userName,u.identification)
    //     })
    //     this.users=mappedData
    //   }
    // )
  }



  // updateData(): void {
  //   //fs.writeFileSync('http://localhost:4200/assets/db/clients.json', JSON.stringify(this.users));
  //   const httpHeaders=new HttpHeaders({
  //     'Content-type':'application/json'
  //   })
  //   this.http.post('../../assets/db/clients.json', JSON.stringify(this.users),{headers:httpHeaders}).subscribe(()=>{
  //     console.log("data saved")
  //   })
  // }


  authenticateUser(email:string,password:string): Observable<boolean>{
    // let user:User | undefined;
    // user=this.users.find(u => u.email===email);
    // console.log("User find =",user)
    // if(user && user.password===password){
    //  const data = {...user,clientID:''};
    //   const httpHeaders=new HttpHeaders({
    //     'Content-type':'application/json'
    //   })
    //   return this.http.post<User>(this.clientUrl,data,{headers:httpHeaders})
    //   .pipe(
    //     catchError(this.handleError),
    //     mergeMap(clientData=>{
    //       console.log(clientData)
    //       if(user){
    //         user.clientId=clientData.clientId
    //         user.setToken(clientData.token)
    //         this.loggedInUser=user
    //         //this.updateData()
    //         return of(true)
    //       }
    //       return of(false)
    //     })
    //   ,,,,,,,,,,,,,,)
    // }else{
    //   return of(false);
    // }

    const httpHeaders=new HttpHeaders({
           'Content-type':'application/json'
      })

    let postData={"email":email,"password":password}
    
    //Client
    return this.http.post<any>(`${this.clientUrl}`,postData,{ "headers": httpHeaders})
    .pipe(
      mergeMap((clientData)=>{
        let user:User;
        user=new User(clientData.clientId,email,new Date(),"","","","",clientData.userName,[]);
        user.setToken(clientData.token)
        this.loggedInUser=user
        console.log(this.loggedInUser);
        return of(true);
      }),
      catchError(this.handleError)
    )

  }

  isLoggedIn():boolean{
    return this.loggedInUser!=undefined;
  }

  registerNewUser(user: User):  Observable<User> {
    // const existinUser=this.users.find(u => u.email===user.email);
    // if(existinUser){
    //   return throwError(()=> 'Already user with is email present')
    // }
    const httpHeaders = new HttpHeaders({
      'Content-type':'application/json'
    });
    let postData = {
      "name": user.userName,
      "email" : user.email,
      "password" : user.password,
      "postalCode" : user.postalCode,
      "phone": user.phone,
      "country" : user.country,
      "dateOfBirth": user.dateOfBirth,
      "clientIdentification" : {
        "type": user.identification[0].type,
        "value":user.identification[0].value
      },
      "investmentRiskAppetite": "CONSERVATIVE",
    };
    return this.http.post<User>(`${this.registerUrl}`,postData,{ "headers": httpHeaders})
    .pipe(catchError(this.handleError));
    // let user: User;
    // //user1: User[]= new User(NaN,email,dob,country,postalCode,password,userName,identification);
    // return this.http.post<User>(this.clientUrl,,{headers:httpHeaders1})
    //   .pipe(
    //     catchError(this.handleError),
    //     mergeMap(clientData=>{
    //       console.log(clientData)
    //       if(user){
    //         user.clientId=clientData.clientId
    //         user.setToken(clientData.token)
    //         this.loggedInUser=user
    //         //this.updateData()
    //         user = clientData;
    //         return of(user);
    //       }
    //     })
    // user.clientId=Math.floor(Math.random()*1000000)
    // console.log(user);
    // this.users.push(user);
    // console.log(this.users);
    // //this.updateData()
    // return of(user)

  }

  logout(){
    this.loggedInUser=undefined
  }

  getLoginUserId():number|undefined{
    return this.loggedInUser?.clientId;
  }

  getLogedInUserToken():undefined|number{
    return this.loggedInUser?.getToken()
  }

  getLoginUserEmail():string|undefined{
    return this.loggedInUser?.email;
  }

  handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error("Error occured ",error.error.message)
    }else{
      console.error("Server error status code ",error.status,' with text ', error.statusText)
      if(error.status==406){
        return throwError(()=>'Session timed out, lease login to get services')
      }
    }
    return throwError(()=>'Error occured please try again later')
  }

}
