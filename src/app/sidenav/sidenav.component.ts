import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  @Input() isLogin:boolean = false;

}
