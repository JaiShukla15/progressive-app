import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true
})
export class TestComponent {

  public abortControllers = new Map();
  public backgroundFetchUrl: string = 'https://speed.hetzner.de/100MB.bin';
  public downloadProgress:number = 0;

  constructor(
    private api: ApiService
  ) { }

  getData() {
    this.api.getUsers().subscribe((res) => {
      console.log(res, 'GOT USERS');
    }, (error) => {
      this.api.backgroundSync('get-users')
    })
  }

  notifyMe() {
    this.api.showNotification().subscribe((data:any)=>{
     console.log('Notificatio sent !');
    });
  };
  downloadFile() {
    console.log('Starting background Fetch ----');
    navigator.serviceWorker.ready.then(async (swReg: any) => {

      console.log(swReg, 'REGISTRATION---')
      const bgFetch = await swReg.backgroundFetch.fetch(
        "bg-fetch-4",
        ["https://www.eurofound.europa.eu/sites/default/files/ef_publication/field_ef_document/ef1710en.pdf"
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

      this.monitorBgFetch(bgFetch);
      let that = this;
      console.log(bgFetch, 'BACKGROUND FETCH ########');
      navigator.serviceWorker.ready.then(async (swReg:any) => {
        const ids = await swReg.backgroundFetch.getIds();
        console.log(ids,'IDS')
      });

      bgFetch.addEventListener('progress', () => {
        // If we didn't provide a total, we can't provide a %.
        // if (!bgFetch.downloadTotal) return;

        const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
        this.downloadProgress = percent;
        alert(`Progress started ${this.downloadProgress}`)
        console.log(`Progress started ------: ${percent}%`);
      });

      bgFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        event.waitUntil(
          (
            async function(){
              that.downloadProgress = 100;
              alert('File Downloaded successfully !');
            }
          )
        )
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch success and process the fetched data here

          alert('Background Fetch Success:'+JSON.stringify(fetchRecord));
        });
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
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch failure here
          console.error('Background Fetch Failed:', fetchRecord);
        });
      });

      bgFetch.addEventListener('backgroundfetchclick', (event:any) => {
        const bgFetch = event.registration;

        if (bgFetch.result === 'success') {
          console.log('DOWNLOAD SUCCESS');
        } else {
          console.log('DOWNLOAD PROGRESS',bgFetch);

        }
      });

    });
  }
  // async performBackgroundFetch() {
  //   try {
  //     const registration = await navigator.serviceWorker.ready;
  //     const controller = registration.active;

  //     const backgroundFetch = await (self as any).backgroundFetch.fetch(
  //       'backgroundFetch',
  //       [this.backgroundFetchUrl],
  //       { title: 'Background Fetch' }
  //     );


  //   } catch (error) {
  //     console.error('Background Fetch Error:', error);
  //   }
  // }


  async monitorBgFetch(bgFetch:any) {
    const that = this;
    function doUpdate() {
      const update:any = {};

      if (bgFetch.result === '') {
        update.state = 'fetching';
        that.downloadProgress = bgFetch.downloaded / bgFetch.downloadTotal;
        alert(that.downloadProgress+'- PROGRESS');
      } else if (bgFetch.result === 'success') {
        update.state = 'fetching';
        that.downloadProgress = 1;
        alert(that.downloadProgress+'- Download started');

      } else if (bgFetch.failureReason === 'aborted') { // Failure
        update.state = 'not-stored';
      } else { // other failure
        update.state = 'failed';
      }

    };

    doUpdate();

    bgFetch.addEventListener('progress', doUpdate);
  }

}
