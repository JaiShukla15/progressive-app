import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    HeaderComponent,
    SidenavComponent
  ]
})
export class DashboardComponent {

  public posts: Observable<any> = of(null);
  constructor(public api: ApiService) { }

  ngOnInit() {
    this.posts = this.api.getPosts();
  }
}
