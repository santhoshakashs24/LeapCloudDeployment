import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvestmentPreference } from 'src/app/models/investment-preference';
import { ToastService } from 'src/app/toast/toast.service';
import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-preference-details',
  templateUrl: './preference-details.component.html',
  styleUrls: ['./preference-details.component.css']
})
export class PreferenceDetailsComponent implements OnInit {

  currentUserInvestment?:InvestmentPreference;

  incomeCategoryMapping:{[key:string]:String}={
    "BASIC":"0 - 20,000",
    "LOW":"20,001 - 40,000",
	  "MEDIUM":" 40,001 - 60,000",
	  "HIGH":" 60,001 - 80,000",
    "EXTREME":" 80,001+"
  }

  lengthOfInvestmentMapping:{[key:string]:String}={
    "BASIC":" 0-5 years",
    "LOW":"5-7 years",
	  "MEDIUM":" 7-10 years",
	  "HIGH":"  10-15 years",
  }

  constructor(private preferenceService:PreferenceService,private router:Router,
    private toastService:ToastService) {
   }

  ngOnInit(): void {

    this.loadInvestmentPreference();
  }

  loadInvestmentPreference(){
    this.preferenceService.getInvestmentPreferenceOfuser().subscribe(data=>{
      if(data==undefined){
        this.toastService.showInformation('You have not set your Investment Preference, please set know')
        this.router.navigate(['/preference','edit'])
      }else{
        this.currentUserInvestment=data
      }
    })
  }

}
