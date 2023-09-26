import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private userService:UserServiceService,private router:Router) { }

  logout(){
    this.userService.logout()
    this.router.navigate(['/login'])

  }

  ngOnInit(): void {
  }

}
