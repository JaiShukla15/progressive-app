import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL, BASE_URL_API, BASE_URL_LOCAL_API } from 'src/environments/environment';
import { URLS } from '../constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public userId = localStorage.getItem('userId');
  public loader:boolean = false;
  public connectionStatus:boolean  = true;
  public showMsg = false;
  constructor(private http: HttpClient, private router: Router) { }

  login(payload: any) {
    return this.http.post(`${BASE_URL_API}/${URLS.USERS}/${URLS.LOGIN}`, payload);
  }

  getPosts() {
    return this.http.get(`${BASE_URL}/${URLS.POSTS}`);
  }

  getAllChats() {
    return this.http.get(`${BASE_URL_API}/${URLS.CHATS}`);
  }

  getUsers() {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

  getAllUsers() {
    return this.http.get(`${BASE_URL_API}/${URLS.USERS}`);
  }

  getSelectedChat(userId: string) {
    return this.http.get(`${BASE_URL_API}/${URLS.CHATS}/${userId}`);
  }

  sendMessage(payload: any) {
    return this.http.post(`${BASE_URL_API}/${URLS.CHATS}/${payload.receiver_id}/${URLS.SEND}`, payload);
  }

  isLogin() {
    return !!localStorage.getItem('access-token');
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');

  }

  getEndpoints(url:any){
    return url.split(`${BASE_URL_API}/`)[1];
  }

  backgroundSync(eventName: string,payload?:any) {
    return new Promise((resolve,reject)=>{
      navigator.serviceWorker.ready.then((swRegisteration: any) => {
        swRegisteration.sync.register(eventName).then(()=>{
          // Background sync registration was successful
          resolve('Background sync is registered !')
        }).catch(()=>{
             // Background sync registration failed
           reject('Something went wrong ....');
        });
      }).catch(console.log)
    })

  }


  showNotification(){
   return this.http.get(`${BASE_URL_LOCAL_API}/notification`);
  }

  showLoader(){
    this.loader = true;
  }
  hideLoader(){
    this.loader = false;
  }

  updateConnectionStatus(online:boolean){
    this.connectionStatus = online;
    this.showMsg = true;
    setInterval(()=>{
      this.showMsg = false;
    },2000);
  }
}
