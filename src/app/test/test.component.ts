import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import {  Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})

export class TestComponent {

  public abortControllers = new Map();
  public backgroundFetchUrl: string = 'https://www.eurofound.europa.eu/sites/default/files/ef_publication/field_ef_document/ef1710en.pdf';
  public downloadProgress: number = 0;
  public downloaded: number = 0;
  public startDownload: boolean = false;
  public message: string = '';
  public context: any = this;
  public subscriptions: Array<Subscription> = [];
  public broadcastChannel = new BroadcastChannel('progressive-web');
  public fileSize:number = 0;
  constructor(
    private api: ApiService
  ) { }


  vanishMessage() {
    setTimeout(() => {
      this.message = '';
    }, 2000);
  }

  notifyMe() {
    this.api.showNotification().subscribe((data: any) => {
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

      this.monitorBgFetch(bgFetch, this.context);

      navigator.serviceWorker.ready.then(async (swReg: any) => {
        const ids = await swReg.backgroundFetch.getIds();
        console.log(ids, 'IDS')
      });

      bgFetch.addEventListener('progress', (event: any) => {
        let fetchProgress = event.currentTarget;
        this.context.downloadProgress = (fetchProgress.downloaded * (1024 * 1024));
        this.context.startDownload = true;
      });

      bgFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        this.context.message = 'File Downloaded successfully !';
        this.context.vanishMessage();
        event.waitUntil(
          (
            async function () {
              await event.updateUI({ title: `File downloaded :)` });
            }
          )
        )
      });

      bgFetch.addEventListener('backgroundfetchfail', (event: any) => {
        this.message = 'Background Fetch Failed:';
        this.context.vanishMessage();
      });

      bgFetch.addEventListener('backgroundfetchclick', (event:any) => {
        const bgFetch = event.registration;

        if (bgFetch.result === 'success') {
          this.message = 'Downloaded :)';
        } else {
          this.message = 'Downloading Your file !!!!!';
        }
      });

    });
  }

  async monitorBgFetch(bgFetch: any, context: any) {
    function doUpdate() {
      const update: any = {};

      if (bgFetch.result === '') {
        context.startDownload = true;
        update.state = 'fetching';
        // context.downloadProgress = bgFetch.downloaded / bgFetch.downloadTotal;
        context.downloadProgress = (bgFetch.downloadTotal / 1024 * 1024);
        context.downloaded  = bgFetch.downloaded;
        context.message = 'Downloading ..';
        context.vanishMessage();
      } else if (bgFetch.result === 'success') {
        update.state = 'fetching';
        context.message = 'Downloaded Check';
        context.downloadProgress = 100;
        context.startDownload = true;
        context.vanishMessage();
      } else if (bgFetch.failureReason === 'aborted') { // Failure
        update.state = 'not-stored';
      } else { // other failure
        update.state = 'failed';
        context.message = 'Downloading Failed';
        context.vanishMessage();
      }

    };

    doUpdate();

    bgFetch.addEventListener('progress', doUpdate);
  }

  bytesToSize(bytes: any, decimals: any) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ngOnDestroy() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      })
    }
  }
}
