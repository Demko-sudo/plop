const V='plop-v3',F=['./','index.html','oyun.html','icon-192.png','icon-512.png','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json')||u.pathname.endsWith('sw.js'))return;
  if(e.request.cache==='reload'||e.request.cache==='no-store'){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(u.pathname.endsWith('/')?e.request:new Request(u.origin+u.pathname),c));}return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match('oyun.html'))));
});
