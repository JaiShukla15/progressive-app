import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  providers:[
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
    this.detectConnectionStatus();
  }

  getData() {
    this.api.showLoader();
    this.api.getUsers().subscribe(async (res: any) => {
      this.users = res;
      this.api.hideLoader();
    }, (error) => {
      this.api.hideLoader();
      this.api.backgroundSync('get-users').then((message: any) => {
        this.message = message;
        this.vanishMessage();
        console.log(message, 'SYNC COMPLETED------');
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
  detectConnectionStatus() {
    this.api.connectionStatus.subscribe(async (online: boolean) => {
      if (online) {
        let cache = await caches.open('get-users');
        let response = await cache.match('get-users');
        console.log(response, 'RESPONSE FROM CACHE ####');
      }
    })
  }

}
