import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PostsComponent {
  public posts: Array<any> = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.showLoader();
    this.api.getPosts().subscribe((response: any) => {
      this.posts = response;
      this.api.hideLoader();
    }, (err) => {
      this.api.hideLoader();

    });
  }
}
