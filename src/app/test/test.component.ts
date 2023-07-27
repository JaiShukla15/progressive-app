import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports:[
    CommonModule
  ]
})
export class TestComponent {

  public abortControllers = new Map();
  public backgroundFetchUrl: string = 'https://www.eurofound.europa.eu/sites/default/files/ef_publication/field_ef_document/ef1710en.pdf';
  public downloadProgress:number = 0;
  public users:Array<any> = [];
  public startDownload:boolean = false;
  public message:string = '';
  public context:any = this;
  constructor(
    private api: ApiService
  ) { }

  getData() {
    this.api.showLoader();
    this.api.getUsers().subscribe(async (res: any) => {
      this.users = res;
      this.api.hideLoader();
    }, (error) => {
      this.api.hideLoader();
      this.api.backgroundSync('get-users').then((message:any)=>{
        console.log(message,'SYNC COMPLETED------');
        this.message = message;
        this.vanishMessage();
      }).catch(err=>{
        console.log(err,'SYNC ERROR -----');
      })
    })
  }

  vanishMessage(){
    setTimeout(()=>{
      this.message = '';
    },2000);
  }

  notifyMe() {
    this.api.showNotification().subscribe((data:any)=>{
     console.log('Notification sent !');
    });
  };
  downloadFile() {
    console.log('Starting background Fetch ----');
    navigator.serviceWorker.ready.then(async (swReg: any) => {

      const bgFetch = await swReg.backgroundFetch.fetch(
        "bg-fetch-4",
        [
          this.backgroundFetchUrl
        ],

        {
          title: "Test file",
          icons: [
            {
              sizes: "300x300",
              src: "../../assets/icons/android/android-launchericon-48-48.png",
              type: "image/png",
            },
          ],
          downloadTotal: 5 * 1024 * 1024,
        },
      );

      this.monitorBgFetch(bgFetch,this.context);
      navigator.serviceWorker.ready.then(async (swReg:any) => {
        const ids = await swReg.backgroundFetch.getIds();
        console.log(ids,'IDS')
      });

      bgFetch.addEventListener('progress', (event:any) => {
        let fetchProgress = event.currentTarget;

        // const percent = Math.round(bgFetch.downloaded * 100 / bgFetch.downloadTotal);
        this.context.downloadProgress = fetchProgress.downloaded;
        // progressStatus.innerHTML = `Progress: downloaded ${bytesToSize(
        //   fetchProgress.downloaded
        // )}  from ${bytesToSize(fetchProgress.downloadTotal)} (${Math.round(
        //   (fetchProgress.downloaded * 100) / fetchProgress.downloadTotal
        // )}%)`;
        this.context.startDownload = true;
        // alert(`Progress started ${this.context.downloadProgress}`);
      });

      bgFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        this.context.message = 'File Downloaded successfully !';
        this.context.vanishMessage();
        event.waitUntil(
          (
            async function(){
              console.log('Completed ######');
            }
          )
        )
      });

      // For Storing records in cache !!!!!

      // bgFetch.addEventListener('backgroundfetchsuccess', event => {
      //   console.log('[Service Worker] Background Fetch Success', event.registration);
      //   event.waitUntil(
      //     (async function() {
      //       try {
      //         // Iterating the records to populate the cache
      //         const cache = await caches.open(event.registration.id);
      //         const records = await event.registration.matchAll();
      //         const promises = records.map(async record => {
      //           const response = await record.responseReady;
      //           await cache.put(record.request, response);
      //         });
      //         console.log(records,'RECORDS #####');
      //         await Promise.all(promises);

      //         // [Optional] This could be an API call to our backend

      //         // Updating UI
      //         alert('Download is ready #####');
      //       } catch (err) {
      //         alert('Download is failed #####');
      //       }
      //     })()
      //   );
      // });

      bgFetch.addEventListener('backgroundfetchfail', (event: any) => {
         this.message = 'Background Fetch Failed:';
         this.context.vanishMessage();
      });

      bgFetch.addEventListener('backgroundfetchclick', (event:any) => {
        const bgFetch = event.registration;

        if (bgFetch.result === 'success') {
          alert('DOWNLOAD SUCCESS')
        }
      });

    });
  }

  async monitorBgFetch(bgFetch:any,context:any) {
    function doUpdate() {
      const update:any = {};

      if (bgFetch.result === '') {
        update.state = 'fetching';
        context.downloadProgress = bgFetch.downloaded / bgFetch.downloadTotal;
        alert(context.context.downloadProgress+'- PROGRESS');
      } else if (bgFetch.result === 'success') {
        update.state = 'fetching';
        context.context.downloadProgress = 1;
        alert(context.context.downloadProgress+'- Download started');

      } else if (bgFetch.failureReason === 'aborted') { // Failure
        update.state = 'not-stored';
      } else { // other failure
        update.state = 'failed';
      }

    };

    doUpdate();

    bgFetch.addEventListener('progress', doUpdate);
  }

  bytesToSize(bytes:any, decimals:any) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


}
