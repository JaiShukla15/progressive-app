import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'pwa';
  public isOnline: boolean = false;
  public isLogin:boolean = false;
  public publicKey = 'BN69bTRuil6wT1gdV_daOX6usqgVZofjaFUDFz-2WtKeC2YlUGEMz8vvVbqhuA-cp8IwBFfrde6Dp3QhiEwgyfc';
  constructor(
    private update: SwUpdate,
    private swPush: SwPush,
    public api:ApiService
    ) { }

  ngOnInit() {
    this.isLogin = this.api.isLogin();
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    this.checkForUpdate();
    this.checkPushSubscription();
    this.checkNotifications();
  }


  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      this.api.updateConnectionStatus(true);
      console.log('User is online');
    } else {
      console.log('User is offline');
      this.api.updateConnectionStatus(false);
    }
  }

  checkForUpdate() {
    if (!this.update.isEnabled) { return }
    this.update.available.subscribe((event) => {
      console.log(event, 'EVENT')
      if (confirm('Update available for the app please confirm')) {
        this.update.activateUpdate().then(() => {
          location.reload();
        })
      }
    })
  }

  checkPushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('Not Enabled !');
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey:this.publicKey
    }).then(sub=>{
      console.log(JSON.stringify(sub));
    }).catch(err=>console.log)
  }

  checkNotifications(){
   this.swPush.notificationClicks.subscribe(({action,notification})=>{
     console.log(action,'ACTION');
     console.log(notification,'NOTIFICATIONS');
   })
  }
};
