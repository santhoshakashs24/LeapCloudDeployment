import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderLogoComponent } from './header-logo/header-logo.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LogintextComponent } from './logintext/logintext.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PortfolioPageComponent } from './portfolio/portfolio-page/portfolio-page.component';
import { TradeModule } from './trade/trade.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from './toast/toast.module';
import { ActivityModule } from './activity/activity.module';
import { InvestmentPreferenceModule } from './investment-preference/investment-preference.module';
import { LogOutComponent } from './log-out/log-out.component';
import { RegisterationComponent } from './registeration/registeration.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderLogoComponent,
    FooterBarComponent,
    NavigationComponent,
    LogintextComponent,
    LoginFormComponent,
    LoginPageComponent,
    PortfolioPageComponent,
    LogOutComponent,
    RegisterationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    TradeModule,
    BrowserAnimationsModule,
    ToastModule,
    ActivityModule,
    InvestmentPreferenceModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
