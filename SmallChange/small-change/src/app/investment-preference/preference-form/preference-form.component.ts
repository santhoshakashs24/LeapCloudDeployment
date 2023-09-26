import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { InvestmentPreference } from 'src/app/models/investment-preference';
import { ToastService } from 'src/app/toast/toast.service';
import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-preference-form',
  templateUrl: './preference-form.component.html',
  styleUrls: ['./preference-form.component.css']
})
export class PreferenceFormComponent implements OnInit {

  preferenceForm!:FormGroup;

  constructor(private preferenceService:PreferenceService,private formBuilder:FormBuilder,
    private toastService:ToastService,private router:Router) { }

  ngOnInit(): void {
    this.preferenceForm=this.formBuilder.group({
      'investmentPurpose':['',[Validators.required]],
      'lengthOfInvestment':['',Validators.required],
      'riskTolerance':['',Validators.required],
      'incomeCategory':['',Validators.required]
    })
    this.preferenceService.getInvestmentPreferenceOfuser().subscribe({next:(data)=>{
      if(data!=undefined){
        console.log(data);
        this.preferenceForm.patchValue(data)
      }
    },
    error:(e)=>{ this.toastService.showError(e) }
  })
  }

  updateMyPreference(){
    //console.log(' innsuing update request with value',this.preferenceForm.value)
    this.preferenceService.setInestmentPreference(this.preferenceForm.value as InvestmentPreference).subscribe(
      {
        next: ()=>{  this.toastService.showSuccess('Your Investment preference updated'); this.router.navigate(['/preference','details'])},
        error: (e)=>{ this.toastService.showError(e) }
      }
    )
  }

}
