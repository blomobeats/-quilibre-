/* Service worker — Orion
   - Pages de l'app : réseau d'abord, cache en secours (hors réseau)
   - Three.js et polices : cache d'abord, mise à jour en arrière-plan
   Les données ne passent jamais par ici : elles restent dans le stockage de l'appareil. */
var VERSION = 'orion-v1';
var CORE = ['./', 'index.html', 'manifest.webmanifest', 'icons/orion.svg', 'icons/orion-32.png', 'icons/orion-180.png', 'icons/orion-192.png', 'icons/orion-512.png'];
var STATIC_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('orion-') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var scope = new URL(self.registration.scope);
  if (url.origin === self.location.origin && url.pathname.indexOf(scope.pathname) === 0) {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
    }));
    return;
  }
  if (STATIC_HOSTS.indexOf(url.hostname) >= 0) {
    e.respondWith(caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res.ok || res.type === 'opaque') { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    }));
  }
});
