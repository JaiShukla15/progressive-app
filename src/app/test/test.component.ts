import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone:true
})
export class TestComponent {

  constructor(
    private api:ApiService
  ){}

  getData(){
    this.api.getUsers().subscribe((res)=>{
      console.log(res,'GOT USERS');
    },(error)=>{
      this.api.backgroundSync('get-users')
    })
  }

  notifyMe(){

  }
  downloadFile(){
    const urls = ['https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf'];
    navigator.serviceWorker.ready.then(async (swRegisteration:any)=>{
     const bgFetch  = swRegisteration.backgroundFetch.fetch('my-fetch',urls,{
      title:'Excel file',
      icons:[
        {
          sizes:'72x72',
          src:'../../assets/icons/android/android-launchericon-72-72.png',
          type:'application/pdf'
        }]
     })
    })
  }
}
