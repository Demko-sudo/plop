const V='plop-v4',F=['./','index.html','oyun.html','icon-192.png','icon-512.png','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json')||u.pathname.endsWith('sw.js'))return;
  const html=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
  if(html){ // önce internet: her zaman en yeni sürüm; internet yoksa kayıtlı kopya
    const key=new Request(u.origin+u.pathname);
    e.respondWith(fetch(r.url.split('#')[0],{cache:'no-store'}).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(cc=>cc.put(key,c));}return x;}).catch(()=>caches.match(key).then(m=>m||caches.match('oyun.html'))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(cc=>cc.put(r,c));}return x;})));
});
