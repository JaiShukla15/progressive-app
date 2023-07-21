import { Observable, of } from 'rxjs';
import { ApiService } from './../services/api.service';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]

})
export class ChatComponent {

  public innerWidth:number = 0;
  public isMobile:boolean = false;
  public users: Observable<any> = of(null);

  public chat_info: Array<any> = [];

  public loggedInUser = localStorage.getItem('userId');

  public selected_userId:string = '';

  public message:string='';


  constructor(
    public api: ApiService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
     this.isMobile = this.innerWidth < 769;
  }

  ngOnInit() {
    this.getChatUsers();
  }

  getChatUsers() {
    this.users = this.api.getAllUsers();
  }

  getSelectedChat(userId: string) {
    this.selected_userId = userId;
    this.api.getSelectedChat(userId).subscribe((response: any) => {
      this.chat_info = response.data;
    },(error)=>{
      console.log(error,'SELECTED CHAT');
    });
  }

  sendMessage() {
    const payload = {
      receiver_id:this.selected_userId,
      message:this.message
    };

    this.api.sendMessage(payload).subscribe(()=>{
     console.log('MESSAGE SENT !');
     this.chat_info.push({
      id:null,
      sender_id:this.loggedInUser,
      receiver_id:this.selected_userId,
      message:this.message,
      createdAt:Date.now()
     });
     this.message = '';
    },(err)=>{
      if(err.status==504){
        console.log('TIMEOUT')
      }
    })
  }


}
