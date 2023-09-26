import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIdentification } from '../models/client-identification';
import { UserServiceService } from '../services/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {

  // user: User = new User(
  //   NaN,
  //   'user1@email.com',
  //   new Date('1999-09-11'),
  //   'IN',
  //   '560061',
  //   'Nikhil@123',
  //   'Nikhil V',
  //   [{type:'SSN',value:'87698765'}]
  // )
  email: string = '';
  dob: Date = new Date();
  country: string = '';
  postalCode: string = '';
  phone: string = '';
  password: string = '';
  userName: string = '';
  identification: ClientIdentification[] = [];
  registrationForm!: FormGroup;
  constructor(private userservice: UserServiceService, private router: Router, private formbuilder: FormBuilder) {

      this.registrationForm = formbuilder.group({
        'email': ['',Validators.required],
        'dob': ['',Validators.required],
        'country': ['',Validators.required],
        'postalCode': ['',Validators.required],
        'phone': ['',Validators.required],
        'password': ['',Validators.required],
        'userName': ['',Validators.required],
        'identification_type': ['',Validators.required],
        'identification_value': ['',Validators.required]
      });
   }
  
  ngOnInit(): void {
  }
  register(){
     let user: User = new User(NaN,
      this.registrationForm.get('email')?.value,
      this.registrationForm.get('dob')?.value,
      this.registrationForm.get('country')?.value,
      this.registrationForm.get('postalCode')?.value,
      this.registrationForm.get('phone')?.value,
      this.registrationForm.get('password')?.value,
      this.registrationForm.get('userName')?.value,
      [new ClientIdentification(this.registrationForm.get('identification_type')?.value, this.registrationForm.get('identification_value')?.value)]
    );
    console.log(user);
    this.userservice.registerNewUser(user).subscribe(data=>{
      if(data){
        alert('Registeration Successful');
        this.router.navigate(['/login']);
      }else{
        alert('Unknown error occured');
      }
    })
  }
}
