/* Service worker — Équilibre · Suivi de chantier
   - Pages de l'app : réseau d'abord, cache en secours (hors réseau)
   - Bibliothèques / polices : cache d'abord, mise à jour en arrière-plan
   - Microsoft (connexion, Graph) : jamais mis en cache */
var VERSION = 'chantier-v2';
var CORE = ['chantier.html', 'chantier.webmanifest', 'icons/chantier-192.png', 'icons/chantier-512.png', 'icons/chantier-180.png'];
var STATIC_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('chantier-') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var same = url.origin === self.location.origin;
  var ours = same && (CORE.some(function (p) { return url.pathname.endsWith('/' + p); }) || /\/chantier\.html$/.test(url.pathname));
  if (ours) {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
      return res;
    }).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
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
