const V = 'hazel-v1', FILES = [
  './', './index.html', 'manifest.webmanifest', 'config.js', 'icons/icon-192.png', 'icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin || u.hostname === 'www.gstatic.com') {
    e.respondWith(fetch(e.request).then(r => {
      const c = r.clone();
      caches.open(V).then(x => x.put(e.request, c));
      return r;
    }).catch(() => caches.match(e.request)));
  }
});
