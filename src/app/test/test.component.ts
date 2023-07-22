import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone:true
})
export class TestComponent {

  public backgroundFetchUrl:string = 'https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf';

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
  async performBackgroundFetch() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const controller = registration.active;

      const backgroundFetch = await (self as any).backgroundFetch.fetch(
        'backgroundFetch',
        [this.backgroundFetchUrl],
        { title: 'Background Fetch' }
      );

      backgroundFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch success and process the fetched data here
          console.log('Background Fetch Success:', fetchRecord);
        });
      });

      backgroundFetch.addEventListener('backgroundfetchfail', (event: any) => {
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch failure here
          console.error('Background Fetch Failed:', fetchRecord);
        });
      });
    } catch (error) {
      console.error('Background Fetch Error:', error);
    }
  }
}
