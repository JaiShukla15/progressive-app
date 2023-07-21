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
