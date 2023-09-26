import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.css']
})
export class FooterBarComponent implements OnInit {

  footerText: string = 'Copyright 1998-2021 FMR LLC. All Rights Reserved.';

  constructor() { }

  ngOnInit(): void {
  }

}
