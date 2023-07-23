importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  if (event.tag == 'get-chat-users') {
    const options = {
      URL: 'http://localhost:8080/api/users',
      method: `get`,
      headers: {
        'Authorization': `Bearer
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphaUB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjJhZWJjNjAzLTJiNTEtNDQ5Yi04NTI5LWI1NzE1M2IxYjE1ZCIsImlhdCI6MTY4OTgzMzM0NSwiZXhwIjoxNjg5ODM2MzQ1fQ.UeFIm20oeGiHLV599RS7udCxLeM0AHwcsYolDUKWzRI`
      }
    }
    event.waitUntil(getData(options));
  }else if(event.tag==='send-message'){
    console.log(event,'EVENT')
    event.waitUntil(sendMessage());
  }
  else if(event.tag==='get-users'){
    event.waitUntil(getUsers());

  }
})
console.log(self,'SELF #####');
//  let bgFetchButton = self.document?.querySelector('#bgFetchButton');

  // // bgFetchButton?.addEventListener('click', async event => {
  //   try {
  //     self.registration.backgroundFetch.fetch('my-fetch', ['https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf']);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // // });

  navigator.serviceWorker.ready.then(async (swReg) => {
    const bgFetch = await swReg.backgroundFetch.fetch(
      "my-fetch",
      ["https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf",
       "https://media.istockphoto.com/id/1461268110/photo/growth-business-graph-finance-data-diagram-concept-on-stock-market-background-with-financial.jpg?s=2048x2048&w=is&k=20&c=5H6A3Ex4Ql7nXTcgUo8kaT3gnbukVxZrq6Wsr2REN3s="],
      {
        title: "Episode 5: Interesting things.",
        icons: [
          {
            sizes: "300x300",
            src: "https://media.istockphoto.com/id/1393890859/photo/happy-couple-at-home-paying-bills-online.jpg?s=2048x2048&w=is&k=20&c=joHosgeQiJnTNo-qBZOpUCPCWG3RpDqiG0E__Z7APC0=",
            type: "image/png",
          },
        ],
        downloadTotal: 60 * 1024 * 1024,
      },
    );

    console.log(bgFetch,'BACKGROUND FETCH ########');
  });


  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
function getUsers() {
  fetch('https://jsonplaceholder.typicode.com',{
    method:'get',
    headers:{
      'Content-Type':'application/json'
    }
  }).then(() => Promise.resolve()).catch(err => Promise.reject(err));
}

function getData(options) {
  fetch('http://localhost:8080/api/users',{
    method:'get',
    headers:{
      'Content-Type':'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphaUB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjJhZWJjNjAzLTJiNTEtNDQ5Yi04NTI5LWI1NzE1M2IxYjE1ZCIsImlhdCI6MTY4OTgzMzM0NSwiZXhwIjoxNjg5ODM2MzQ1fQ.UeFIm20oeGiHLV599RS7udCxLeM0AHwcsYolDUKWzRI'
    }
  }).then(() => Promise.resolve()).catch(err => Promise.reject(err));
}

function sendMessage(payload) {
  fetch('http://localhost:8080/api/chats/send',{
    method:'post',
    headers:{
      'Content-Type':'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphaUB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjJhZWJjNjAzLTJiNTEtNDQ5Yi04NTI5LWI1NzE1M2IxYjE1ZCIsImlhdCI6MTY4OTgzMzM0NSwiZXhwIjoxNjg5ODM2MzQ1fQ.UeFIm20oeGiHLV599RS7udCxLeM0AHwcsYolDUKWzRI'
    },
    body:JSON.stringify({

    })
  }).then(() => Promise.resolve()).catch(err => Promise.reject(err));

}
