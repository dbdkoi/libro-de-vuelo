// Logbook: la página se pide siempre a la red (con la copia guardada como respaldo sin cobertura),
// así una versión nueva aparece al abrir la app. Solo atiende sus propios archivos, no los de /material/.
const CACHE='libro-vuelo-v7';
const BASE=new URL('./',self.registration.scope).href;
const CORE=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('libro-vuelo')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const put=(key,res)=>{ if(res&&res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(key,cp)); } return res; };
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res&&(res.ok||res.type==='opaque')){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); } return res; })));
    return;
  }
  if(!r.url.startsWith(BASE)||r.url.startsWith(BASE+'material/')) return;
  const page=r.mode==='navigate'||u.href===BASE||u.pathname.endsWith('/index.html');
  if(page){
    e.respondWith((async()=>{
      const cached=await caches.match(BASE);
      const net=fetch(BASE,{cache:'no-store'}).then(res=>put(BASE,res));
      if(!cached) return net;
      const timeout=new Promise(ok=>setTimeout(()=>ok(null),3500));
      const res=await Promise.race([net.catch(()=>null),timeout]);
      return (res&&res.ok)?res:cached;
    })());
    return;
  }
  if(!/\.(png|ico|svg|webmanifest|woff2?)$/.test(u.pathname)) return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>put(u.origin+u.pathname,res));
    return hit?(net.catch(()=>{}),hit):net;
  }));
});
