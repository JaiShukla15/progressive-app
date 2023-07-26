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
        ["https://speed.hetzner.de/100MB.bin"
        ],

        {
          title: "important one",
          icons: [
            {
              sizes: "300x300",
              src: "../../assets/icons/android/android-launchericon-48-48.png",
              type: "image/png",
            },
          ],
          downloadTotal: 14 * 1024 * 1024,
        },
      );

      this.monitorBgFetch(bgFetch);

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
        console.log('progress started ####');
        alert(`Progress started ${this.downloadProgress}`)
        console.log(`Download progress 11111: ${percent}%`);
      });

      bgFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch success and process the fetched data here
          alert('File Download successfully !');
          console.log('Background Fetch Success:', fetchRecord);
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
    const channel = new BroadcastChannel(bgFetch.id);

    channel.onmessage = (event) => {
      if (!event.data.stored) return;
      bgFetch.removeEventListener('progress', doUpdate);
      channel.close();
     console.log('updated @@@@@@');
    };
  }

   async fallbackFetch() {
    const controller = new AbortController();
    const { signal } = controller;
    this.abortControllers.set('bg-fetch-1', controller);

    try {
      const response = await fetch(this.backgroundFetchUrl, { signal });
      const chunks = [];
      let downloaded = 0;
      let lastUpdated = 0;
      const reader:any = response?.body?.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        downloaded += value.length;
        chunks.push(value);
        const now = Date.now();
        const progress = downloaded / (15 * 1024 * 1024);
        if (now - lastUpdated > 500 || progress === 1) {
          console.log({ progress });
          lastUpdated = now;
        }

      }

      const cache = await caches.open('bg-fetch-4');
      const inMemoryResponse = new Response(new Blob(chunks), { headers: response.headers });
      await cache.put(this.backgroundFetchUrl, inMemoryResponse);
      console.log({ state: 'stored', progress: 1 });
    } catch (err) {
      console.log('Aborted')
      // if (err.name === 'AbortError') return;
      // updateItem(item.id, { state: 'failed' });
    }

  }
}
