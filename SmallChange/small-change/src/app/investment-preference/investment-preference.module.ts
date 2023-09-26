import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencePageComponent } from './preference-page/preference-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PreferenceFormComponent } from './preference-form/preference-form.component';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from '../guards/is-logged-in.guard';
import { PreferenceDetailsComponent } from './preference-details/preference-details.component';

const routes:Routes=[
  {path:'preference',component:PreferencePageComponent,canActivate:[IsLoggedInGuard],
    children:[
      {path:'details',component:PreferenceDetailsComponent},
      {path:'edit',component:PreferenceFormComponent}
    ]
  }
]

@NgModule({
  declarations: [
    PreferencePageComponent,
    PreferenceFormComponent,
    PreferenceDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class InvestmentPreferenceModule { }
