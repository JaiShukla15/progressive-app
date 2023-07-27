import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone:true,
  imports:[
    CommonModule
  ],
  providers:[
    ApiService
  ]
})
export class UsersComponent {
  public users: Array<any> = [];
  public message:string = '';
  constructor(
    private api:ApiService
  ){}

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
}
