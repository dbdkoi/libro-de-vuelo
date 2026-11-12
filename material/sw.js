const CACHE='material-gruhel-v4';
const BASE=new URL('./',self.registration.scope).href;
const CORE=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-m-192.png','./icon-m-512.png','./apple-touch-icon.png','./splash.js','./splash-base.webp','./splash-gear.webp','./splash-cap.webp','./splash-cab.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('material-gruhel')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||!r.url.startsWith(BASE))return;
  // La página (con o sin index.html, con o sin parámetros) es siempre la misma entrada de la caché.
  const doc=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  const key=doc?BASE:u.origin+u.pathname;
  e.respondWith(caches.match(key).then(hit=>{
    const net=fetch(doc?new Request(BASE,{cache:'no-cache'}):r).then(res=>{
      if(res&&res.ok){const cp=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(key,cp)).catch(()=>{}));}
      return res;
    }).catch(()=>hit||caches.match(BASE));
    return hit||net;
  }));
});
