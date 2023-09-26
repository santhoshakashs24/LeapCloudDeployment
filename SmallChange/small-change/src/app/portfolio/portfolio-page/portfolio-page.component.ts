import { Component, OnInit } from '@angular/core';
import { InstrumentPrice } from 'src/app/models/instrument-price';
import { Portfolio } from 'src/app/models/portfolio';
import { PortfolioService } from 'src/app/services/portfolio.service';
import {ToastService} from 'src/app/toast/toast.service';

@Component({
  selector: 'app-portfolio-page',
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit {
  portfolio:any[]=[];
  port:Portfolio[]=[]
  instrument_prices:InstrumentPrice[]=[];
  length:number=0;
  userid:number=1;

  constructor(private portfolioService:PortfolioService,private toastService:ToastService) {

  }

  ngOnInit(): void {

   this.getUserPortfolioData();





  }


  getUserPortfolioData()
  {

    this.portfolioService.getPortfolioDataNew().subscribe({
      next:(data)=>{
      this.port=data;
      this.length=Object.keys(this.port).length;
      console.log(this.port);},
      error:(err) =>{
        this.toastService.showError("Could not get portfolio")
      }

   } )


  }

  createClientDefaultPortfolio(){
    this.portfolioService.createNewDefaultPortfolio().subscribe({
      next:(data)=>{
        this.getUserPortfolioData()
        this.toastService.showSuccess("Default Portfolio Created")
      },
      error:(err) =>{
        this.toastService.showError("Could not create portfolio")
      }});
  }

}
