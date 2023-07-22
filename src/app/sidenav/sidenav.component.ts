import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
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

  public innerWidth:number = 0;
  public isMobile:boolean = false;
  constructor(private api:ApiService){}

  @Input() isLogin:boolean = false;
  @HostListener('window:resize', ['$event'])

  ngOnint(){
    this.onResize();
  }
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isMobile = this.innerWidth < 800;
  }

  logout(){
    this.api.logout();
  }
}
