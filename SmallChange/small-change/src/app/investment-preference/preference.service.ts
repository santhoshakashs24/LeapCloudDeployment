import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { InvestmentPreference } from '../models/investment-preference';
import { UserServiceService } from '../services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(private clientService:UserServiceService,private httpClient:HttpClient){}

  private preferenceUrl="http://localhost:8080/preference"

  private investmentPreference: {[key:string]:InvestmentPreference}={
    '123-123-123':{
      investmentPurpose:'Retirement',
      incomeCategory:'20,001 - 40,000',
      riskTolerance:'CONSERVATIVE',
      lengthOfInvestment:'5-7 years'
    }
  }

  public setInestmentPreference(preference:InvestmentPreference): Observable<InvestmentPreference|undefined> {
    let httpHeaders=new HttpHeaders()
    httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.clientService.getLogedInUserToken()}`)

    return this.httpClient.post<InvestmentPreference>(`${this.preferenceUrl}/updatepref`,preference,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError));
  }

  public getInvestmentPreferenceOfuser() : Observable<InvestmentPreference|undefined>{
    let httpHeaders=new HttpHeaders()
    httpHeaders= httpHeaders.append('Authorization',`Bearer ${this.clientService.getLogedInUserToken()}`)

    return this.httpClient.get<InvestmentPreference>(`${this.preferenceUrl}`,{headers:httpHeaders})
      .pipe(
        catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occured: ${err.error.message}`;
    }

    else {

      errorMessage = `server returned code: ${err.status},error message is :${err.message}`;

    }

    console.log(errorMessage);

    return throwError(() => errorMessage);

  }
}
