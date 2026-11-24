const CACHE = 'theflavorfind-v21';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/','/style.css','/scripts.js','/data/recipes-summary.json','/icons/icon-192.png']))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('theflavorfind-') && k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
 const u = new URL(e.request.url);
 if(e.request.method !== 'GET' || u.origin !== self.location.origin || u.pathname.startsWith('/api/') || u.pathname.startsWith('/.netlify/') || u.pathname === '/admin.html') return;
 e.respondWith(fetch(e.request).then(r => { if(r.ok) {const copy=r.clone(); e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));} return r; }).catch(async()=> (await caches.match(e.request)) || new Response('Sem ligação à Internet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
});
