import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm!:FormGroup
  errorMessage='';


  constructor(private userService:UserServiceService,private router:Router,
    private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      username:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9-_@\.\-]{3,18}$/)]],
      password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9-_@\-]{6,24}$/)]]
    })
  }

  login(){

    this.userService.authenticateUser(this.loginForm.get('username')?.value,
    this.loginForm.get('password')?.value).subscribe({
      next:
      (data)=>{
      if(data){
        this.errorMessage=''
        this.router.navigate(['/portfolio']);
      }else{
        this.errorMessage='User Name or password wrong'
        //alert('User Name or password wrong')
      }
    },
    error:(err)=>{ this.errorMessage='User Name or password wrong' }

  })
  }
  register(){
    this.router.navigate(['/register']);
  }

  hasUserNameError():string{
    if(this.loginForm.get('username')?.pristine || this.loginForm.get('username')?.valid){
      return '';
    }
    let message=''
    if(this.loginForm.get('username')?.hasError('required')){
      message='Please enter user name'
    }else {
      message="User name must be an email having 3 to 18 characters"
    }
    return message;
  }

  hasPasswordError():string{
    if(this.loginForm.get('password')?.pristine || this.loginForm.get('password')?.valid){
      return '';
    }
    let message=''
    if(this.loginForm.get('password')?.hasError('required')){
      message='Please enter password'
    }else {
      message="Password can have special chapacters @,. , numbers and letters and have 6 - 24 letters"
    }
    return message;
  }

}
