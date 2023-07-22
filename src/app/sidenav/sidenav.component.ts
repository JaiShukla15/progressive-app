import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    RouterModule
  ]
})
export class SidenavComponent {

  constructor(private api:ApiService){}

  @Input() isLogin:boolean = false;

  logout(){
    this.api.logout();
  }
}
