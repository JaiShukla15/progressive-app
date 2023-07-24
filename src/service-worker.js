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
    this.startBackgroundFetch();
    event.waitUntil(getUsers());

  }
})

async function startBackgroundFetch() {
  if ('backgroundFetch' in self.registration) {
    try {
      const registration = await self.registration.backgroundFetch.fetch('myBackgroundFetch', 'https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf');
      registration.addEventListener('backgroundfetchsuccess', (event) => {
        // Process the fetched data here
        console.log('Background fetch success:', event);
      });
      registration.addEventListener('backgroundfetchfail', (event) => {
        // Handle fetch failure here
        console.error('Background fetch failed:', event);
      });
    } catch (error) {
      console.error('Background fetch error:', error);
    }
  } else {
    console.error('Background fetch is not supported in this browser.');
  }
}


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
