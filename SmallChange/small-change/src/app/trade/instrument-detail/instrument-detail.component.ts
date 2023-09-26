import { Component, Input, OnInit } from '@angular/core';
import { InstrumentPrice } from 'src/app/models/instrument-price';

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit {

  @Input() instrument?:InstrumentPrice;
  @Input() type?:string;

  constructor() { }

  ngOnInit(): void {
  }

}
