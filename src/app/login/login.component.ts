import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule

  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginForm: any;
  public loader:boolean = false;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    if(this.api.isLogin()){
       this.router.navigate(['/dashboard']);
    }else
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  loginHandler() {
    if (this.loginForm.invalid) {
      return alert('Please enter login details');
    }
    this.loader = true;
    this.api.login(this.loginForm.value).subscribe((response: any) => {
      if (response.message) {
        return alert(response.message)
      }
      if (response.token) {
        localStorage.setItem('access-token', response.token);
        localStorage.setItem('refresh-token', response.refreshToken);
        localStorage.setItem('userId', response.userId);
        this.api.userId = localStorage.getItem('userId');
      }
      this.loader = false;
      this.router.navigate(['/dashboard']);
    }, (error) => {
      console.log(error)
      this.loader = false;
      alert(error.error.message);
    });
  }



}
