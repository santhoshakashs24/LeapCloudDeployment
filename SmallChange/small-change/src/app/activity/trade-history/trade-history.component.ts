import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Trade } from 'src/app/models/trade';
import { TradeHisService } from 'src/app/services/trade-his.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css']
})
export class TradeHistoryComponent implements OnInit {

  tradeList:Trade[]=[];

  getTradeHis(){
    this.tradeService.getTradeHis()
    .subscribe(data => this.tradeList=data);
  }
  constructor(private tradeService:TradeHisService) { }

  ngOnInit(): void {
    this.tradeService.getTradeHis()
    .subscribe(data => this.tradeList=data);
  }

}

@Pipe({name:"expand"})
export class ExpandPipe implements PipeTransform{
  transform(field:string) {
    if(field == "B"){
      return("Buy");
    }
    else if(field == "S"){
      return("Sell");
    }
    else{
      return("NaN");
    }
  }
}
