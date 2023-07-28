import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  providers: [
    ApiService
  ],
  imports: [
    CommonModule
  ]
})
export class UsersComponent implements OnInit {
  public users: Array<any> = [];
  public message: string = '';
  constructor(
    private api: ApiService
  ) { }


  ngOnInit(): void {
  }

  getData() {
    this.api.showLoader();
    this.api.getUsers().subscribe(async (res: any) => {
      this.users = res;
      this.api.hideLoader();
    }, (error) => {
      this.api.hideLoader();
      this.api.backgroundSync('get-users').then((message: any) => {
        console.log(message, 'SYNC COMPLETED------');
        this.message = message;
        this.vanishMessage();
        this.detectConnectionStatus();
      }).catch(err => {
        console.log(err, 'SYNC ERROR -----');
      })
    })
  }

  vanishMessage() {
    setTimeout(() => {
      this.message = '';
    }, 2000);
  }
  @HostListener('window:online', ['$event'])
  detectConnectionStatus() {
    this.sync();
  }

  sync() {
    setTimeout(async () => {
      this.message = 'Syncing ..';
      this.vanishMessage();
      let cache = await caches.open('get-users');
      let response = await cache.match('get-users');
      this.users = await response?.json();
    }, 2000);
  }
  clearData(){
    caches.delete('get-users');
    this.message = 'Cache cleared';
    this.vanishMessage();
  }

}
