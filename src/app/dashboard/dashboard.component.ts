import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports:[
    CommonModule,
    HttpClientModule
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public posts: Observable<any> = of(null);
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.posts = this.api.getPosts();
  }
}
