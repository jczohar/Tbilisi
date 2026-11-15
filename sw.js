const V='tbg-20261115-01',RT='tbg-rt';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r)));return}
  if(/tile\.openstreetmap\.org|upload\.wikimedia\.org/.test(u.host)){
    e.respondWith(caches.open(RT).then(c=>c.match(r).then(m=>{const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>m);return m||f})));
  }
});
