importScripts('./ngsw-worker.js');

if ('BackgroundFetchManager' in self) {
  console.log(' This browser supports Background Fetch !!!!!!');
}

const broadcastChannel = new BroadcastChannel('progressive-web');


self.addEventListener('sync', (event) => {
  if (event.tag === 'send-message') {
    event.waitUntil(sendMessage());
  }
  else if (event.tag === 'get-users') {
    let usersData = getUsers();
    console.log(this, 'INSIDE SERVICE WORKER ********');
    event.waitUntil(usersData);
    (
      async () => {
        let data = await getUsers();
        const cache = await caches.open(event.tag);
        await cache.put(event.tag, data);
      })();
  }
})


self.addEventListener('backgroundfetchsuccess', (event) => {
  const bgFetch = event.registration;

  event.waitUntil(async function () {
    // Create/open a cache.
    const cache = await caches.open('downloads');
    // Get all the records.
    const records = await bgFetch.matchAll();
    // Copy each request/response across.
    const promises = records.map(async (record) => {
      const response = await record.responseReady;
      await cache.put(record.request, response);
    });
    await Promise.all(promises);
    event.updateUI({ title: 'Download Completed' });
  }());
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
function getUsers() {
  return fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((data) => Promise.resolve(data)).catch(err => Promise.reject(err));
}


function sendMessage(payload) {
  fetch('http://localhost:8080/api/chats/send', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphaUB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjJhZWJjNjAzLTJiNTEtNDQ5Yi04NTI5LWI1NzE1M2IxYjE1ZCIsImlhdCI6MTY4OTgzMzM0NSwiZXhwIjoxNjg5ODM2MzQ1fQ.UeFIm20oeGiHLV599RS7udCxLeM0AHwcsYolDUKWzRI'
    },
    body: JSON.stringify({

    })
  }).then(() => Promise.resolve()).catch(err => Promise.reject(err));

}
